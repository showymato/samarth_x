import { qs, copyText, toast } from './utils';
import { brand as person, work, about, plans, quotes, faq, inr, pricing, cta, lead, WHATSAPP_URL, predictor, funnel } from '@/lib/content';
import jeeData from '@/data/predictor/jee.json';
import neetData from '@/data/predictor/neet.json';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type Out = string | (() => string | Promise<string>);

const HELP = `available commands:
  <b>plans</b>       the one plan, three billing cycles
  <b>jee</b>         JEE Main + Advanced
  <b>neet</b>        NEET-UG
  <b>olympiad</b>    IOQM, INMO, NSEP, INPhO…
  <b>addons</b>      extras, for when you want more
  <b>parent</b>      what parents see
  <b>discipline</b>  the consistency engine
  <b>quote</b>       one for the wall
  <b>diagnostic</b>  the free diagnostic test
  <b>scholarship</b> up to 50% off the core plan
  <b>trial</b>       the full plan for ₹1, 7 days
  <b>challenge</b>   the 7-day consistency challenge
  <b>predict jee</b> &lt;percentile&gt;   e.g. predict jee 97.4
  <b>predict neet</b> &lt;marks&gt;       e.g. predict neet 610
  <b>faq</b>         the honest answers
  <b>contact</b>     call, whatsapp, email
  <b>clear</b>       tidy up
  …and a few secret ones. aspirants try things.`;

let chai = 0;

/* ───────── rank & college predictor: estimates only, never invented data ───────── */
type JeeRow = { institute: string; program: string; quota?: string; category: string; gender?: string; closingRank: number };
type NeetRow = { college: string; state?: string; quota?: string; category: string; closingRank: number };
type Data<R> = { source: string; year: number | null; rows: R[]; marksToRank?: { marks: number; rank: number }[] };
const jee = jeeData as unknown as Data<JeeRow>;
const neet = neetData as unknown as Data<NeetRow>;

const link = (href: string, label: string) => `<a href="${href}" target="_blank" rel="noopener">${esc(label)}</a>`;
const disclaimer = (year: number | null) =>
  `<span class="dim">estimate based on ${year ?? esc(predictor.year)} data, not a guarantee.</span>`;
const handoff = (exam: string, score: string) =>
  `want your college list? send your score → ${link(WHATSAPP_URL(`Predict my college: exam ${exam}, score ${score}, category __, state __`), person.whatsapp)}`;
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

function predict(args: string[]): string {
  const [exam, raw, cat = 'open'] = args;
  const category = cat.toUpperCase();
  const v = Number(raw);
  if (exam === 'jee') {
    if (!raw || !Number.isFinite(v) || v < 0 || v > 100) return 'usage: <b>predict jee &lt;percentile&gt;</b> e.g. predict jee 97.4 (optional category: obc-ncl, sc, st, ews)';
    const total = Number(predictor.jeeTotalCandidates);
    const lines = [`<b>JEE Main</b> · ${v} percentile`];
    if (!Number.isFinite(total) || total <= 0) {
      lines.push('rank estimate needs the official candidate count for the year (not set yet).');
      lines.push(handoff('JEE Main', `${v} percentile`));
      lines.push(disclaimer(jee.year));
      return lines.join('\n');
    }
    const rank = ((100 - v) * total) / 100;
    lines.push(`estimated CRL rank ≈ <b>${fmt(Math.max(1, rank))}</b> <span class="dim">(= (100 − ${v}) × ${fmt(total)} / 100)</span>`);
    const hits = jee.rows
      .filter((r) => r.category.toUpperCase() === category && r.closingRank >= rank)
      .sort((a, b) => a.closingRank - b.closingRank)
      .slice(0, 8);
    if (!jee.rows.length) lines.push(handoff('JEE Main', `${v} percentile`));
    else if (!hits.length) lines.push(`no ${esc(category)} rows close above that rank in the data. ${handoff('JEE Main', `${v} percentile`)}`);
    else hits.forEach((r) => lines.push(`  ${esc(r.institute)} · ${esc(r.program)} <span class="dim">closing ${fmt(r.closingRank)}</span>`));
    lines.push(disclaimer(jee.year));
    return lines.join('\n');
  }
  if (exam === 'neet') {
    if (!raw || !Number.isFinite(v) || v < 0 || v > 720) return 'usage: <b>predict neet &lt;marks&gt;</b> e.g. predict neet 610 (out of 720)';
    const lines = [`<b>NEET-UG</b> · ${v}/720`];
    const table = (neet.marksToRank ?? []).slice().sort((a, b) => b.marks - a.marks);
    if (!neet.rows.length || table.length < 2) {
      lines.push(handoff('NEET-UG', `${v}/720`));
      lines.push(disclaimer(neet.year));
      return lines.join('\n');
    }
    // linear interpolation between the two nearest official (marks, rank) points
    let rank = table[table.length - 1].rank;
    for (let i = 0; i < table.length - 1; i++) {
      const a = table[i], b = table[i + 1];
      if (v <= a.marks && v >= b.marks) { rank = a.rank + ((a.marks - v) / (a.marks - b.marks || 1)) * (b.rank - a.rank); break; }
      if (v > table[0].marks) { rank = table[0].rank; break; }
    }
    lines.push(`estimated AIR ≈ <b>${fmt(rank)}</b>`);
    const hits = neet.rows.filter((r) => r.category.toUpperCase() === category && r.closingRank >= rank).sort((a, b) => a.closingRank - b.closingRank).slice(0, 8);
    if (!hits.length) lines.push(handoff('NEET-UG', `${v}/720`));
    else hits.forEach((r) => lines.push(`  ${esc(r.college)}${r.state ? ` · ${esc(r.state)}` : ''} <span class="dim">closing ${fmt(r.closingRank)}</span>`));
    lines.push(disclaimer(neet.year));
    return lines.join('\n');
  }
  return 'usage: <b>predict jee &lt;percentile&gt;</b> or <b>predict neet &lt;marks&gt;</b>';
}
let lastQuote = -1;

const go = (sel: string, msg: string) => () => {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  return msg;
};

const program = (id: string) => {
  const c = work.bench.cards.find((x) => x.id === id)!;
  return `<b>${esc(c.title)}</b>
<span class="dim">${esc(c.role)}</span>
${esc(c.blurb)}
covered: ${c.tags.map(esc).join(' · ')}
type <b>plans</b> for the price. same plan for every exam.`;
};

const COMMANDS: Record<string, Out> = {
  help: HELP,
  whoami: `<b>aspirant</b>. curious mind, part-time procrastinator (recovering).
current streak: 42 days. current weak spot: organic. current plan: one chapter at a time.`,
  plans: () =>
    [
      `<b>${esc(person.name)} One</b> · one plan, JEE / NEET / Olympiad. no hidden “premium” tier.`,
      '',
      ...plans.cycles.map((c) => `  <b>${c.cycle.padEnd(10)}</b>${inr(c.price).padEnd(9)}${c.per.padEnd(7)}<span class="dim">${esc(c.line)} · ${c.badge}</span>`),
      '',
      `≈${inr(pricing.perDayMonthly)}/day monthly · ≈${inr(pricing.perDayAnnual)}/day annual. ${esc(pricing.gstNote)}`,
      'type <b>open plans</b> to scroll there.',
    ].join('\n'),
  'open plans': go('#pricing', 'scrolling you to the plans…'),
  jee: program('p-jee'),
  neet: program('p-neet'),
  olympiad: program('p-olympiad'),
  addons: () =>
    work.more.rows
      .map((r, i) => `  <b>0${i + 1}</b>  ${esc(r.n.padEnd(18))}<span class="dim">${esc(r.s)}</span>`)
      .concat(['', 'the core plan covers everything. these are optional.'])
      .join('\n'),
  parent: `parents get a dashboard, not a guess:
  attendance · study hours · test trend · chapter strength · mentor remarks
  + a monthly report, instant alerts on missed tests or broken streaks,
  + a quarterly video PTM with the mentor.
fewer worried guesses. more real conversations.`,
  discipline: `<b>the consistency engine</b>
  ✓ daily targets set by your mentor
  ✓ streaks + supportive check-ins
  ✓ focus timer with distraction blocking
  ✓ weekly review: planned vs done
  ✓ missed-target alerts to mentor and parent
  ✓ a monthly habit score in the parent report
motivation gets you to the desk. small habits keep you there.`,
  quote: () => {
    let k = Math.floor(Math.random() * quotes.length);
    if (k === lastQuote) k = (k + 1) % quotes.length;
    lastQuote = k;
    return esc(quotes[k]);
  },
  diagnostic: `<b>free diagnostic test</b>: 90 minutes, a chapter-wise weakness map, a 15-min mentor call. parents welcome.
${link(lead('diagnostic', { from: 'terminal' }), 'take the free diagnostic test →')}`,
  scholarship: `<b>scholarship test</b>: score well, pay less. up to 50% off quarterly/annual. next: ${esc(funnel.scholarshipDate)}
${funnel.scholarshipTiers.map((t) => `  ${t.score.padEnd(22)}${t.off}% off`).join('\n')}
${link(lead('scholarship', { from: 'terminal' }), 'register, it’s free →')}`,
  trial: `<b>${inr(pricing.starter.trial)} trial</b>: the full core plan for 7 days, one real 1:1 mentor session included.
${esc(funnel.trialTerms)}
${link(lead('trial', { from: 'terminal' }), 'start the ₹1 trial →')}`,
  challenge: `<b>the 7-day consistency challenge</b>: free.
  a daily target from a mentor, a check-in every night, a small streak to build.
  miss a day? pick it up again. by day 7 you’ll know it: you can show up.
${link(lead('challenge', { from: 'terminal' }), 'join the challenge →')}`,
  faq: () =>
    faq.items
      .map((f, i) => `<b>Q${String(i + 1).padStart(2, '0')}</b> ${esc(f.q)}\n    <span class="dim">${esc(f.a)}</span>`)
      .join('\n'),
  contact: async () => {
    const ok = await copyText(person.email);
    if (ok) toast(`copied <b>${esc(person.email)}</b>`);
    return `  <b>call</b>       <a href="${person.phoneHref}">${esc(person.phone)}</a> <span class="dim">· a real mentor picks up</span>
  <b>whatsapp</b>   <a href="${person.whatsappHref}" target="_blank" rel="noopener">${esc(person.whatsapp)}</a>
  <b>email</b>      ${ok ? '<span class="ok">copied</span> ' : ''}${esc(person.email)}`;
  },
  socials: `  <b>instagram</b>  <a href="${person.instagram}" target="_blank" rel="noopener">${esc(person.instagram)}</a>
  <b>youtube</b>    <a href="${person.youtube}" target="_blank" rel="noopener">${esc(person.youtube)}</a>
  <b>linkedin</b>   <a href="${person.linkedin}" target="_blank" rel="noopener">${esc(person.linkedin)}</a>`,
  'git status': `on branch <b>feat/next-chapter</b>
your branch is ahead of 'origin/kal-se-pakka' by 42 days.

changes to be committed:
  <span class="ok">new file:   dpp-14.md</span>
  <span class="ok">modified:   error-log.md (7 silly mistakes, fixed)</span>

untracked files:
  <span class="err">organic-chemistry/</span>`,
  'git log': `<b>a4b6954</b> sunday mock: up 18 <span class="dim">(HEAD -> feat/next-chapter)</span>
<b>9cb2e51</b> 42-day streak
<b>3aea5ec</b> first parent report
<b>7345bf8</b> mentor match & plan
<b>d9a4652</b> day 0: diagnostic test`,
  chai: () => {
    chai += 1;
    return chai > 3 ? `☕ that’s cup #${chai}. focus +40%. sleep −${chai}h. your mentor suggests water.` : '☕ refuelled. focus +40%.';
  },
  coffee: 'this is a chai-only zone. try <b>chai</b>.',
  ls: 'physics/  chemistry/  maths/  biology/  dpp/  pyq/  error-log.md  timetable.pdf  secrets.txt',
  'cat secrets.txt': 'ok fine: i still count on my fingers in mental maths. and i revise in the bathroom mirror.',
  'cat error-log.md': 'mock 14: sign error ×3, units ×2, read the question ×2. total: −28 marks. fixable.',
  pwd: `/home/${person.handle}/prep`,
  date: () => new Date().toLocaleString('en-IN', { timeZone: person.timezone }),
  hello: 'hi! type <b>help</b> if you’re lost.',
  hi: 'hello! type <b>help</b> if you’re lost.',
  sudo: 'nice try. you’re not in the sudoers file. this incident will be reported. (kidding. nice try though.)',
  'rm -rf /': '<span class="err">permission denied.</span> also, the syllabus can’t be deleted.',
  'rm -rf syllabus': '<span class="err">permission denied.</span> the syllabus is finite. you’ll get through it.',
  exit: 'you can check out any time you like, but the mock is still on sunday.',
  vim: 'you are now stuck in vim. like organic. <b>:q</b>',
  ':q': 'see? easy. now do the same with reels.',
  reels: '<span class="err">blocked.</span> focus mode said no. nice try.',
  'sudo crack jee': `[sudo] password for aspirant: ********
checking preparation status...
  direction: <span class="ok">clearer</span>
  progress:  <span class="ok">in motion</span>
  mentor:    <span class="ok">by your side</span>
<span class="ok">permission granted.</span> condition: one step at a time.`,
};
plans.cycles.forEach((c) => {
  COMMANDS[`enroll --plan ${c.id}`] = () => {
    window.setTimeout(() => document.querySelector(`#plan-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 600);
    return `resolving <b>${esc(person.name)} One · ${c.id}</b>… ${inr(c.price)}${c.per} · ${esc(c.line)}
<span class="ok">ok.</span> scrolling you to the plan…`;
  };
});
COMMANDS['crack jee'] = 'permission denied. try <b>sudo crack jee</b>.';
COMMANDS['sudo crack neet'] = COMMANDS['sudo crack jee'];
COMMANDS['enroll'] = 'usage: <b>enroll --plan annual</b> (or monthly, quarterly). see <b>plans</b>.';
COMMANDS['npm install rank@latest'] = 'added <b>1 personal mentor, 52 tests a year, 1 parent dashboard</b> in 2y 0m. found <span class="ok">0</span> reasons to do it alone.';
COMMANDS['about'] = () => about.neofetch.map(([k, v]) => `  <b>${k.padEnd(9)}</b>${esc(v)}`).join('\n');

export function initTerminal() {
  const term = qs('[data-term]');
  if (!term) return null;
  const body = qs('.term__body', term)!;
  const out = qs('.term__out', term)!;
  const form = qs<HTMLFormElement>('[data-term-form]', term)!;
  const input = qs<HTMLInputElement>('input', form)!;
  const ps = `${person.host}:~$`;
  const history: string[] = [];
  let hi = 0;

  const print = (cmd: string, html: string) => {
    const block = document.createElement('div');
    block.className = 'term__block';
    block.innerHTML = `<div class="term__cmd"><span class="term__ps">${ps}</span> ${esc(cmd)}</div>${html ? `<pre class="term__res">${html}</pre>` : ''}`;
    out.appendChild(block);
    body.scrollTop = body.scrollHeight;
  };

  const run = async (raw: string) => {
    const cmd = raw.trim().replace(/\s+/g, ' ');
    const key = cmd.toLowerCase();
    if (!cmd) {
      print('', '');
      return;
    }
    history.push(cmd);
    hi = history.length;
    if (key === 'clear') {
      out.innerHTML = '';
      return;
    }
    let res = COMMANDS[key];
    if (!res && key.startsWith('echo ')) res = esc(cmd.slice(5));
    if (!res && key.startsWith('cd')) res = 'there’s nowhere else to go. you’re already home.';
    if (!res && key.startsWith('sudo ')) res = COMMANDS.sudo;
    if (!res && (key === 'predict' || key.startsWith('predict '))) res = predict(key.split(' ').slice(1));
    if (!res) res = `zsh: command not found: ${esc(cmd.split(' ')[0])}. try <b>help</b>`;
    const html = typeof res === 'function' ? await res() : res;
    print(cmd, html);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    run(v);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      hi = Math.max(0, hi - 1);
      input.value = history[hi];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      hi = Math.min(history.length, hi + 1);
      input.value = history[hi] || '';
      e.preventDefault();
    }
  });
  // clicking the screen focuses the prompt
  body.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) return;
    if (!window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });

  print('help', HELP);

  return {
    input,
    type(ch: string) {
      input.value += ch;
    },
    backspace() {
      input.value = input.value.slice(0, -1);
    },
    enter() {
      form.requestSubmit();
    },
    run,
  };
}
