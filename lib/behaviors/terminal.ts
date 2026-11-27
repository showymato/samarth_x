import { qs, copyText, toast } from './utils';
import { brand as person, work, about, plans, quotes, faq, inr, pricing, cta } from '@/lib/content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type Out = string | (() => string | Promise<string>);

const HELP = `available commands:
  <b>plans</b>       the one plan, three billing cycles
  <b>jee</b>         JEE Main + Advanced
  <b>neet</b>        NEET-UG
  <b>olympiad</b>    IOQM, INMO, NSEP, INPhO…
  <b>addons</b>      extras, for when you want more
  <b>parent</b>      what parents see
  <b>discipline</b>  the discipline engine
  <b>quote</b>       one for the wall
  <b>diagnostic</b>  the free diagnostic test
  <b>faq</b>         the honest answers
  <b>contact</b>     call, whatsapp, email
  <b>clear</b>       tidy up
  …and a few secret ones. aspirants try things.`;

let chai = 0;
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
  whoami: `<b>aspirant</b>. future topper, part-time procrastinator (recovering).
current streak: 42 days. current weakness: organic. current plan: fix it.`,
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
no more “haan padh raha hoon”.`,
  discipline: `<b>the discipline engine</b>
  ✓ daily targets set by your mentor
  ✓ streaks + accountability check-ins
  ✓ focus timer with distraction blocking
  ✓ weekly review: planned vs done
  ✓ missed-target alerts to mentor and parent
  ✓ a monthly habit score in the parent report
motivation gets you to the desk. this keeps you there.`,
  quote: () => {
    let k = Math.floor(Math.random() * quotes.length);
    if (k === lastQuote) k = (k + 1) % quotes.length;
    lastQuote = k;
    return esc(quotes[k]);
  },
  diagnostic: () => {
    window.setTimeout(() => window.open(cta.diagnosticHref, '_blank', 'noopener'), 900);
    return `booking your <b>free diagnostic test</b>… 90 minutes, all subjects.
we find where you stand. you find out what to fix first.
<span class="ok">opening WhatsApp…</span>`;
  },
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
  'git status': `on branch <b>feat/crack-it</b>
your branch is ahead of 'origin/excuses' by 42 days.

changes to be committed:
  <span class="ok">new file:   dpp-14.md</span>
  <span class="ok">modified:   error-log.md (7 silly mistakes, fixed)</span>

untracked files:
  <span class="err">organic-chemistry/</span>`,
  'git log': `<b>a4b6954</b> sunday mock: up 18 <span class="dim">(HEAD -> feat/crack-it)</span>
<b>9cb2e51</b> 42-day streak
<b>3aea5ec</b> first parent report
<b>7345bf8</b> mentor match & plan
<b>d9a4652</b> day 0: diagnostic test`,
  chai: () => {
    chai += 1;
    return chai > 3 ? `☕ that’s cup #${chai}. focus +40%. sleep −${chai}h. your mentor has been notified.` : '☕ refuelled. focus +40%.';
  },
  coffee: 'this is a chai-only zone. try <b>chai</b>.',
  ls: 'physics/  chemistry/  maths/  biology/  dpp/  pyq/  error-log.md  timetable.pdf  secrets.txt',
  'cat secrets.txt': 'ok fine: i still count on my fingers in mental maths. and i revise in the bathroom mirror.',
  'cat error-log.md': 'mock 14: sign error ×3, units ×2, read the question ×2. total: −28 marks. fixable.',
  pwd: `/home/${person.handle}/prep`,
  date: () => new Date().toLocaleString('en-IN', { timeZone: person.timezone }),
  hello: 'hi! type <b>help</b> if you’re lost.',
  hi: 'hello! type <b>help</b> if you’re lost.',
  sudo: 'nice try. you’re not in the sudoers file. this incident will be reported (to your parents, via the app).',
  'rm -rf /': '<span class="err">permission denied.</span> also, the syllabus can’t be deleted.',
  'rm -rf syllabus': '<span class="err">permission denied.</span> the syllabus is finite. your excuses aren’t.',
  exit: 'you can check out any time you like, but the mock is still on sunday.',
  vim: 'you are now stuck in vim. like organic. <b>:q</b>',
  ':q': 'see? easy. now do the same with reels.',
  reels: '<span class="err">blocked.</span> focus mode said no. nice try.',
  'sudo crack jee': `[sudo] password for aspirant: ********
<span class="ok">permission granted.</span> condition: show up daily.`,
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
COMMANDS['npm install rank@latest'] = 'added <b>1 personal mentor, 52 tests a year, 1 parent dashboard</b> in 2y 0m. found <span class="ok">0</span> excuses.';
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
