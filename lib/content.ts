// ─────────────────────────────────────────────────────────────
// All landing-page copy lives here. Edit this file to update text.
// Anything in {{DOUBLE_BRACES}} is a placeholder: see CHANGES.md.
// ─────────────────────────────────────────────────────────────

export const brand = {
  name: 'SamarthX',
  // the hero h1 is two words with the student illustration standing between them
  wordmark: ['samarth', 'x'] as [string, string],
  tagline: '{{TAGLINE}}',
  domain: '{{DOMAIN}}',
  url: 'https://{{DOMAIN}}/',
  email: '{{EMAIL}}',
  phone: '{{PHONE}}',
  phoneHref: 'tel:{{PHONE}}',
  whatsapp: '{{WHATSAPP}}',
  whatsappHref: 'https://wa.me/{{WHATSAPP}}',
  instagram: '{{INSTAGRAM}}',
  youtube: '{{YOUTUBE}}',
  linkedin: '{{LINKEDIN}}',
  city: '{{CITY}}, IN',
  timezone: 'Asia/Kolkata',
  host: 'student@samarthx',
  handle: 'aspirant',
  // flight-board prefix in the "built for" strip → "AIR 01"
  initials: 'AIR',
  // square avatar (stickers, polaroid) and the hero cut-out (transparent PNG, mirror-selfie pose)
  photo: '/img/avatar.jpg',
  cutout: '/img/hero-aspirant.png',
  cutoutW: 289,
  cutoutH: 695,
};

// ─────────────────────────────────────────────────────────────
// PRICES: the one place to change any price on the page.
// ─────────────────────────────────────────────────────────────
const P = {
  monthly: 3999,
  quarterly: 10799,
  annual: 38399,
  addons: {
    mentorSession: 799,
    mentorPack5: 3499,
    doubtPass: 699,
    doubtBundle: 1799,
    olympiadTrack: 1499,
    mockMarathon: 2999,
    printedKit: 4999,
    counselling: 2999,
    parentPro: 499,
    calmMind: 499,
  },
};

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const pricing = {
  ...P,
  perDayMonthly: Math.round(P.monthly / 30),
  perDayAnnual: Math.round(P.annual / 365),
  effQuarterly: Math.round(P.quarterly / 3),
  effAnnual: Math.round(P.annual / 12),
  saveQuarterly: P.monthly * 3 - P.quarterly,
  saveAnnual: P.monthly * 12 - P.annual,
  gstNote: 'prices incl. GST {{CONFIRM_GST}}',
};

export const cta = {
  primary: `start for ${inr(P.monthly)}/mo`,
  diagnostic: 'take the free diagnostic test',
  parentCall: 'book a 15-min parent call',
  // the diagnostic test is booked over WhatsApp until a form exists
  diagnosticHref: `${brand.whatsappHref}?text=free%20diagnostic%20test`,
};

export const hero = {
  file: { dir: `${brand.name} /`, name: 'timetable_final_FINAL_v', ext: '.pdf', repo: 'rank' },
  status: 'admissions open',
  statusSub: 'JEE 2028 · NEET 2028 · Olympiad',
  bubble: 'turning “kal se pakka” into “aaj se hi.”',
  // the hero chat bubble cycles through these
  bubbles: [
    'turning “kal se pakka” into “aaj se hi.”',
    'mirror selfie, mid-revision. the formulas stayed.',
    'DPP at 6, mock at 9. i’m fine. totally fine.',
    'bas 5 minute aur. (it never works.)',
    'phone’s going in the other room. right after this.',
  ],
  roleLine1: 'one app, one mentor,',
  roleLine2Pre: 'one rank to',
  roleLine2Em: 'chase',
  ctaSmall: '/mo',
  callPre: 'or call',
  callPost: ' · a real mentor picks up',
  lede: {
    pre: 'we combine ',
    bold: ['personal mentorship', 'complete study material', 'tests with real analytics', 'a parent dashboard'],
    mid: '. one app: ',
    a: 'for the student, and ',
    b: 'for the parents. JEE · NEET · Olympiad, ',
    em: 'with parents in the loop.',
  },
  quip: ['we don’t sell motivation.', 'we install discipline.'],
  stamp: 'scroll for receipts ✦ results do the talking ✦',
  // multiplayer cursors that chat over the hero (an illustration, not a real conversation)
  cursors: [
    ['parent', 'is my kid actually studying?'],
    ['mentor', '5h 40m today. it’s on your dashboard.'],
    ['parent', 'and sunday’s mock?'],
    ['mentor', 'up 18 marks. the silly mistakes are next.'],
    ['parent', 'can you make them sleep on time?'],
    ['mentor', 'already in the plan. 11 p.m., lights out.'],
  ] as [string, string][],
  cursorNames: { a: 'parent', b: 'mentor' },
  xray: [
    ['frontal lobe', 'one more DPP, at 2 a.m.'],
    ['occipital lobe', 'spots a sign error from orbit.'],
    ['cerebellum', 'muscle memory: formulas, ctrl+z.'],
  ] as [string, string][],
  xrayPhone: 'covering face, as is tradition.',
  xrayHeart: 'runs on chai, streaks and 2 a.m. doubts.',
  xrayTag: 'x-ray · 206 bones · 0 excuses',
  photoAlt: 'Illustrated student taking a selfie, surrounded by study stickers.',
  builtFor: 'built for',
  gateNote: ['gate 2028 · no delays reported', 'by your mentor'],
};

// halftone loading screen: DPI steps and what it says at each one
export const loader = {
  steps: [
    [6, 'low-res aspirant. loading discipline.'],
    [9, 'low-res aspirant. loading discipline.'],
    [12, 'low-res aspirant. loading discipline.'],
    [18, 'low-res aspirant. loading discipline.'],
    [28, 'adding dots. lots of DPPs.'],
    [44, 'adding dots. lots of DPPs.'],
    [72, 'that’s a student. probably.'],
    [110, 'that’s a student. probably.'],
    [150, 'sharpening. so many formulas.'],
    [200, 'sharpening. so many formulas.'],
    [240, 'aligning the inks.'],
    [300, 'exam ready.'],
  ] as [number, string][],
  counterLabel: 'posters',
};

// split-flap board in the yellow strip ("built for"). Names: max 14 characters.
// Text only: no institution or company logos (that would imply a partnership).
export const flipboard = [
  { name: 'JEE MAIN', role: 'physics · chem · maths', year: '2028', st: 'boarding now' },
  { name: 'JEE ADVANCED', role: 'class 11 · 12 · droppers', year: '2028', st: 'boarding now' },
  { name: 'BITSAT', role: 'speed + accuracy', year: '2028', st: 'on time' },
  { name: 'NEET-UG', role: 'physics · chem · biology', year: '2028', st: 'boarding now' },
  { name: 'IOQM · INMO', role: 'olympiad · maths', year: 'cl 8–12', st: 'gate open' },
  { name: 'NSEP · INPHO', role: 'olympiad · physics', year: 'cl 8–12', st: 'gate open' },
  { name: 'NSEC · INCHO', role: 'olympiad · chemistry', year: 'cl 8–12', st: 'gate open' },
  { name: 'NSEB · INBO', role: 'olympiad · biology', year: 'cl 8–12', st: 'gate open' },
  { name: 'NSEJS', role: 'junior science', year: 'cl 8–10', st: 'gate open' },
  { name: 'CBSE · STATE', role: 'boards, class 11–12', year: '2028', st: 'on time' },
];

export const shortVersion = {
  pre: ['most', 'students', 'pick', 'a', 'lane:'],
  a: 'coaching',
  or: 'or',
  b: 'self-study',
  mid: ['we', 'merged', 'a', 'mentor', 'and', 'a', 'system'],
  plus: '+mentor',
  minus: '−confusion',
  diffLabel: 'a mentor added, confusion removed',
  after: ['zero', 'conflicts.', 'we', 'don’t', 'claim', 'we’re', 'the', 'best.'],
  last: ['our', 'results', 'do.'],
  sub: 'here are the receipts',
};

/*
  RECEIPTS
  Launch mode (live): true commitments of the plan, not success claims.
  Results mode: switch ONLY with verified, documented data. Never invent ranks,
  selection counts, toppers, percentages or testimonials (CCPA guidelines on
  coaching advertisements penalise unverified success claims).
*/
export const receiptsMode: 'launch' | 'results' = 'launch';

export const receipts = [
  { pre: '', n: 1, suf: ':1', label: 'a personal mentor for every student', foot: 'not a WhatsApp group of 4,000' },
  { pre: '', n: 52, suf: '+', label: 'tests a year in the core plan', foot: 'sunday mocks are a lifestyle' },
  { pre: '', n: 20, suf: ' yrs', label: 'of PYQs, solved and tagged by chapter', foot: 'history repeats. especially in JEE' },
  { pre: '', n: 12, suf: '', label: 'parent reports a year, minimum', foot: 'no more “haan padh raha hoon”' },
  {
    pre: '₹',
    n: pricing.perDayMonthly,
    suf: '',
    label: `a day on the monthly plan (≈${inr(pricing.perDayAnnual)}/day on annual)`,
    foot: 'less than one canteen run',
  },
];

// Results mode, ready for when the numbers are real and verified:
// export const receipts = [
//   { pre: 'AIR ', n: {{RESULT_TOP_AIR}}, suf: '', label: 'best rank, JEE Advanced {{YEAR}}', foot: '{{SOURCE}}' },
//   { pre: '', n: {{RESULT_SELECTIONS}}, suf: '', label: 'selections, JEE + NEET', foot: '{{SOURCE}}' },
//   { pre: '+', n: {{RESULT_AVG_IMPROVEMENT}}, suf: '%', label: 'average mock-score improvement', foot: '{{SOURCE}}' },
//   { pre: '', n: {{RESULT_OLYMPIAD_QUALIFIERS}}, suf: '', label: 'olympiad stage-2 qualifiers', foot: '{{SOURCE}}' },
//   { pre: '', n: 1, suf: ':1', label: 'a personal mentor for every student', foot: 'still not a WhatsApp group' },
// ];

export const receiptsCopy = {
  title: 'receipts',
  aside: 'because “trust me bro” isn’t a metric.',
};

type Link = { label: string; href?: string; main?: boolean };

export type StackCard = {
  id: string;
  accent: string;
  mock: 'mentor' | 'parents' | 'score';
  sticker?: string;
  role: string;
  title: string;
  blurb: string;
  tags: string[];
  links: Link[];
};

export const work = {
  eyebrow: 'what’s inside the app · 2026',
  titlePre: 'what’s inside',
  titleSerif: 'the app',
  lever: { a: 'the app', b: 'the wall' },
  lede: [
    'three pillars, ',
    { b: 'one subscription' },
    ': a person who knows your weak chapters, tests that explain themselves, and a dashboard your parents will actually open. each card is a ',
    { b: 'live mock' },
    ' of the app screen, sample data included.',
  ] as (string | { b: string })[],
  stack: [
    {
      id: 'p-mentor',
      accent: '#ff6b1a',
      mock: 'mentor',
      sticker: 'me, at the 7 p.m. 1:1.',
      role: 'Pillar 01 · personal mentorship · 1:1',
      title: 'Your mentor, on speed-dial: a person, not a group chat.',
      blurb:
        'One mentor who knows your name, your weak chapters and your excuses. Two 1:1 sessions a month, a weekly plan that gets re-made after every test, and strategy calls before the big ones. For parents: every 1:1 ends with a note in your app.',
      tags: ['Personal mentor', '1:1 sessions', 'Weekly plan', 'Strategy calls'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        { label: 'free diagnostic test', href: cta.diagnosticHref },
      ],
    },
    {
      id: 'p-tests',
      accent: '#12a150',
      mock: 'score',
      role: 'Pillar 02 · tests + analytics',
      title: 'Tests that tell you why: not just how much.',
      blurb:
        'Chapter tests every week, full mocks every month, an All-India Test Series. Then the useful part: a chapter-wise heatmap, time per question, and a silly-mistake tracker that shows exactly how many marks you threw away. For parents: the trend, not just the score.',
      tags: ['Chapter tests', 'Full mocks', 'All-India test series', 'Error analysis'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        { label: 'take a free test first', href: cta.diagnosticHref },
      ],
    },
    {
      id: 'p-parents',
      accent: '#7c3aed',
      mock: 'parents',
      sticker: 'parents? also watching.',
      role: 'Pillar 03 · parent app · reports',
      title: 'Parents see everything. Students hide nothing.',
      blurb:
        'Attendance, study hours, test trend, chapter strength and the mentor’s remarks, in one dashboard. A monthly report, instant alerts on missed tests or broken streaks, and a quarterly video PTM. For students: this is the end of “haan padh raha hoon.”',
      tags: ['Parent app', 'Monthly report', 'Alerts', 'PTM calls'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        { label: cta.parentCall, href: brand.phoneHref },
      ],
    },
  ] as StackCard[],
  bench: {
    title: 'pick your battlefield',
    head: 'three programs, one plan, one price. pick the exam; the mentor, the tests and the parent dashboard come with all of them.',
    cards: [
      {
        id: 'p-jee',
        accent: '#ff4f9a',
        mock: 'editor' as const,
        role: 'JEE Main + Advanced · class 11 · 12 · droppers',
        title: 'JEE: Physics, Chemistry, Maths',
        blurb:
          'Concept-first notes, daily DPPs, 20 years of PYQs by chapter, and mocks in the real exam pattern. Irodov is optional. Consistency isn’t.',
        tags: ['Physics', 'Chemistry', 'Maths', 'BITSAT'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic test', href: cta.diagnosticHref },
        ],
      },
      {
        id: 'p-neet',
        accent: '#8b5cf6',
        mock: 'chat' as const,
        role: 'NEET-UG · class 11 · 12 · droppers',
        title: 'NEET: Physics, Chemistry, Biology',
        blurb:
          'NCERT line by line, because NEET reads it that way. Diagram drills, assertion-reason practice and full-length mocks with OMR timing.',
        tags: ['Biology', 'Chemistry', 'Physics', 'NCERT-mapped'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic test', href: cta.diagnosticHref },
        ],
      },
      {
        id: 'p-olympiad',
        accent: '#ff3b30',
        mock: 'flight' as const,
        role: 'Olympiad · class 8–12',
        title: 'Olympiad: for when JEE is the warm-up',
        blurb:
          'IOQM/INMO, NSEP/INPhO, NSEC/INChO, NSEB/INBO and NSEJS. Stage-wise roadmaps, proof-writing practice and a mentor who has sat the paper.',
        tags: ['IOQM · INMO', 'NSEP · INPhO', 'NSEC · INChO', 'NSEB · NSEJS'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic test', href: cta.diagnosticHref },
        ],
      },
    ],
  },
  more: {
    title: 'add-ons',
    head: 'the core plan covers everything. these are for when you want more.',
    rows: [
      {
        n: 'Extra 1:1s',
        w: 'extra 60-minute mentor sessions, any subject or strategy',
        s: `${inr(P.addons.mentorSession)}/session · 5 for ${inr(P.addons.mentorPack5)}`,
      },
      {
        n: 'Doubt Pass',
        w: 'PCMB live doubt rooms with subject experts and a priority queue',
        s: `${inr(P.addons.doubtPass)}/subject/mo · 3 for ${inr(P.addons.doubtBundle)}`,
      },
      {
        n: 'Olympiad Pro',
        w: 'proof-writing, INMO/INPhO-level problem sets and an olympiad mentor',
        s: `${inr(P.addons.olympiadTrack)}/mo`,
      },
      {
        n: 'Mocks × 15',
        w: '15 full-length, exam-pattern mocks with a national percentile',
        s: `${inr(P.addons.mockMarathon)} one-time`,
      },
      {
        n: 'Printed Kit',
        w: 'modules, formula books and PYQ books, delivered home',
        s: `${inr(P.addons.printedKit)} one-time`,
      },
      {
        n: 'Counselling',
        w: 'JoSAA/CSAB or MCC/state counselling, choice filling and shortlisting',
        s: `${inr(P.addons.counselling)} one-time`,
      },
      {
        n: 'Parent Pro',
        w: 'a monthly video PTM with the mentor, plus a detailed report',
        s: `${inr(P.addons.parentPro)}/mo`,
      },
      {
        n: 'Calm Mind',
        w: 'an exam-stress and focus session with a counsellor',
        s: `${inr(P.addons.calmMind)}/session`,
      },
    ],
  },
};

export const plans = {
  eyebrow: 'pricing · one plan',
  titlePre: `${brand.name}`,
  titleSerif: 'One',
  lede: 'one plan. JEE, NEET or Olympiad. no hidden “premium” tier. same features on every cycle; only the billing changes.',
  cycles: [
    {
      id: 'monthly',
      accent: '#ff6b1a',
      badge: 'try it out',
      cycle: 'Monthly',
      price: P.monthly,
      per: '/mo',
      line: `${inr(P.monthly)} a month · cancel any time`,
      sub: `≈${inr(pricing.perDayMonthly)} a day`,
      cta: 'start monthly',
      // no checkout yet: enrolment happens over WhatsApp
      href: `${brand.whatsappHref}?text=enrol%20monthly`,
    },
    {
      id: 'quarterly',
      accent: '#8b5cf6',
      badge: 'most chosen',
      cycle: 'Quarterly',
      price: P.quarterly,
      per: '/3 mo',
      line: `${inr(pricing.effQuarterly)}/mo effective · save ${inr(pricing.saveQuarterly)}`,
      sub: 'one term, one mentor, zero gaps',
      cta: 'start quarterly',
      // no checkout yet: enrolment happens over WhatsApp
      href: `${brand.whatsappHref}?text=enrol%20quarterly`,
    },
    {
      id: 'annual',
      accent: '#12a150',
      badge: 'best value',
      cycle: 'Annual',
      price: P.annual,
      per: '/yr',
      line: `${inr(pricing.effAnnual)}/mo effective · save ${inr(pricing.saveAnnual)}`,
      sub: `≈${inr(pricing.perDayAnnual)} a day · the whole syllabus, one plan`,
      cta: 'start annual',
      // no checkout yet: enrolment happens over WhatsApp
      href: `${brand.whatsappHref}?text=enrol%20annual`,
    },
  ],
  includedTitle: 'everything included',
  includedSub: 'on every cycle. no asterisks.',
  included: [
    { k: 'mentor', items: ['Dedicated personal mentor', '2 × 1:1 sessions a month', 'Daily + weekly study plan', 'Re-planned after every test'] },
    { k: 'material', items: ['Notes + DPPs', 'Chapter-wise PYQs, 20 years', 'Formula sheets', 'NCERT-mapped content'] },
    { k: 'tests', items: ['Weekly chapter tests', 'Monthly full mocks', 'All-India Test Series', 'Doubts answered within 24h'] },
    { k: 'analytics', items: ['Chapter heatmaps', 'Time per question', 'Silly-mistake tracker', 'Rank predictor'] },
    { k: 'discipline + parents', items: ['The Discipline Engine', 'Parent dashboard', 'Monthly report + alerts', 'Board-exam alignment, 11–12'] },
  ],
  trust: ['free diagnostic test', '7-day full refund', 'EMI available', 'sibling discount 10%'],
  note: pricing.gstNote,
  parents: 'for parents: one subscription, one invoice, and a report every month that shows where the money is going.',
};

export const play = {
  eyebrow: 'the wall · posters',
  titlePre: 'the',
  titleSerif: 'wall',
  aside: '*for your study desk',
  lede: 'posters for your study desk. screenshot one. look at it at 2 a.m. this is what happens when the motivation runs out and the discipline has to take over.',
  cta: 'follow us on Instagram',
  ctaHref: brand.instagram,
  marquee: ['focus', 'revise', 'practise', 'test', 'analyse', 'repeat', 'show up'],
  filters: [
    { key: 'all', label: 'all' },
    { key: 'discipline', label: 'discipline' },
    { key: 'exams', label: 'exams' },
    { key: 'habits', label: 'habits' },
  ],
  tiles: [
    { tags: 'discipline', src: '/img/wall/poster-01.svg', w: 640, h: 905, cap: 'Discipline > Motivation, poster 01', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-02.svg', w: 640, h: 640, cap: 'The syllabus is finite, poster 02', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-03.svg', w: 640, h: 960, cap: 'Show up every day, poster 03', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-04.svg', w: 640, h: 640, cap: 'Rank = habits, poster 04', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-05.svg', w: 640, h: 960, cap: '1 DPP a day, poster 05', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-06.svg', w: 640, h: 640, cap: 'Clear the doubt today, poster 06', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-07.svg', w: 640, h: 960, cap: 'Boring Tuesdays, poster 07', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-08.svg', w: 640, h: 640, cap: 'Fewer tabs, poster 08', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-09.svg', w: 640, h: 410, cap: 'Mocks warn you, poster 09', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-10.svg', w: 640, h: 640, cap: 'Consistency, poster 10', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-11.svg', w: 640, h: 640, cap: 'Arise, awake, poster 11', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-12.svg', w: 640, h: 905, cap: 'Excellence is a habit, poster 12', year: '2026' },
  ],
  arcadeTitle: 'the arcade',
  arcadeHead: 'four tiny games for your 5-minute break. five. not fifty. best scores stay on your device.',
};

export const quotes = [
  'Motivation gets you to the desk. Discipline keeps you there.',
  'The syllabus is finite. Your excuses aren’t.',
  'Nobody cracks JEE in a day. Everyone who cracked it showed up every day.',
  'Your rank is a lagging indicator of your habits.',
  '1 DPP a day beats 10 on Sunday.',
  'Clear the doubt today, not in the exam hall.',
  'Toppers aren’t made on result day. They’re made on boring Tuesdays.',
  'You don’t need more time. You need fewer tabs.',
  'Mock tests don’t judge you. They warn you.',
  'Consistency is a superpower nobody wants to train.',
  '“Arise, awake, and stop not till the goal is reached.” — Swami Vivekananda',
  '“We are what we repeatedly do. Excellence, then, is not an act but a habit.” — Will Durant',
];

export type Commit = {
  v: string;
  vSmall?: string;
  type: 'pre-release' | 'major' | 'minor' | 'latest';
  lane: 'main' | 'work' | 'side';
  date: string;
  title: string;
  org: string;
  notes: [('add' | 'chg' | 'bug'), string][];
};

export const journey = {
  eyebrow: 'the journey · git log --graph',
  titlePre: 'release notes',
  titleSerif: 'for',
  titlePost: 'your rank.',
  lede: [
    'every version of the journey, on one branch graph. ',
    { b: 'breaking changes documented' },
    ', bad habits deprecated, and no version gets skipped.',
  ] as (string | { b: string })[],
  // lane names on the graph and in the legend
  lanes: { main: 'main', work: 'practice', side: 'support' },
  commits: [
    {
      v: 'v0.1', vSmall: '-beta', type: 'pre-release', lane: 'main', date: 'day 0',
      title: 'Diagnostic test', org: 'free · 90 minutes · all subjects',
      notes: [['add', 'we find where you actually stand'], ['bug', 'known issue: you thought you knew rotational motion']],
    },
    {
      v: 'v0.2', vSmall: '-beta', type: 'pre-release', lane: 'side', date: 'week 1',
      title: 'Mentor match & plan', org: 'personal mentor · weekly plan',
      notes: [['add', 'a mentor who knows your name and your weak chapters'], ['add', 'a plan built around your school timings']],
    },
    {
      v: 'v1.0', type: 'major', lane: 'main', date: 'month 1',
      title: 'First full mock', org: 'full syllabus pattern · timed',
      notes: [['add', 'baseline score set'], ['chg', 'panic: handled']],
    },
    {
      v: 'v1.1', type: 'minor', lane: 'work', date: 'month 2',
      title: 'The habit phase', org: 'the discipline engine',
      notes: [['add', 'daily DPPs, weekly 1:1, streaks'], ['bug', 'breaking change: phone goes in the other room']],
    },
    {
      v: 'v1.2', type: 'minor', lane: 'side', date: 'month 2',
      title: 'First parent report', org: 'parent app · monthly',
      notes: [['add', 'parents stop asking, start seeing'], ['chg', '“how’s it going?” → a dashboard']],
    },
    {
      v: 'v2.0', type: 'major', lane: 'main', date: 'month 6',
      title: 'Syllabus 50%', org: 'chapter tests · heatmap',
      notes: [['add', 'chapter tests green across the board'], ['bug', 'known issue: organic still has opinions']],
    },
    {
      v: 'v2.1', type: 'minor', lane: 'work', date: 'month 8',
      title: 'Revision cycle 1', org: 'spaced revision · error log',
      notes: [['add', 'spaced revision, error-log review'], ['chg', 'old mistakes: deprecated']],
    },
    {
      v: 'v3.0', type: 'major', lane: 'main', date: 'month 12',
      title: 'All-India Test Series', org: 'national percentile · monthly',
      notes: [['add', 'a national percentile, every month'], ['chg', 'you vs. the country']],
    },
    {
      v: 'v3.1', type: 'minor', lane: 'work', date: 'last 60',
      title: 'Last 60 days', org: 'PYQ marathon · mock-a-day',
      notes: [['add', 'PYQ marathon, mock-a-day, time strategy'], ['bug', 'sleep schedule: protected by your mentor']],
    },
    {
      v: 'v3.2', type: 'latest', lane: 'main', date: 'exam day',
      title: 'Exam day', org: 'calm · timed · prepared',
      notes: [['add', 'calm, timed, prepared'], ['bug', 'known issue: will check the OMR 3 times']],
    },
  ] as Commit[],
  next: {
    v: 'v4.0',
    title: 'Your rank, next.',
    branch: 'feat/crack-it',
    notes: [['add', 'counselling, college, the next chapter'], ['chg', 'your relatives finally stop asking']] as [('add' | 'chg'), string][],
    cta: 'start your journey',
    href: '#pricing',
  },
  npm: {
    bar: '~/enrolment',
    cmd: 'npm install rank@latest',
    out1: ['added ', '1 personal mentor, 52 tests a year, 1 parent dashboard', ' in 2y 0m'],
    out2: ['found ', '0', ' excuses'],
    out3pre: '1 student is about to get serious. run ',
    out3: 'enroll --plan annual',
    out3post: ' for details',
    href: '#pricing',
  },
};

export const about = {
  titleHot: 'things nobody puts in a brochure',
  titleRest: ': the 2 a.m. desk, the streaks, the chai.',
  titleMutedPre: '(the aspirant in question',
  titleAria: 'and for the things nobody puts in a brochure: the 2 a.m. desk, the streaks, the chai. (the aspirant in question)',
  note1: 'a study desk, live. type ',
  note2: ' on the screen, or go straight for ',
  noteCmd: 'sudo crack jee',
  note3: 'drag anything. study mode is 6 a.m. and knolled. revision mode is 11 p.m. and isn’t. pick a side →',
  modes: { day: 'study mode', night: 'revision mode' },
  lampAria: 'Desk lamp: switch between 6 a.m. and 11 p.m.',
  time: { day: ['6:00', 'a.m.'], night: ['11:00', 'p.m.'] },
  mood: {
    day: 'sunrise · NCERT open · chai #1',
    night: 'lamp on · formula sheets everywhere · chai #3',
  },
  deskStatus: 'light ash · chai-only zone',
  neofetch: [
    ['user', 'aspirant'],
    ['os', 'Aspirant 2028 LTS'],
    ['role', 'future topper, part-time procrastinator (recovering)'],
    ['shell', 'chai + NCERT'],
    ['debugger', 'error log notebook'],
    ['uptime', '42-day streak'],
    ['cpu', 'brain @ 2 cups of chai'],
    ['memory', '70% formulas, 30% reaction mechanisms'],
  ],
  todo: ['✓ finish DPP 14', '✓ revise thermo', '✓ analyse sunday mock', '☐ sleep 8 hours (mentor insists)', '☐ touch grass (sun, 5 pm)'],
  pinkNote: ['motivation gets you to the desk.', 'discipline keeps you there.'],
  badge: ['42', 'day streak'],
  badgeAria: 'Badge: a 42-day streak',
  patch: ['discipline engine', 'streak · day 42'],
  card: [brand.name, 'mentor-first super app', 'JEE · NEET · Olympiad'],
  polaroidMe: 'me, mock-test sunday',
  polaroidDesk: 'the error log, mock 14',
  polaroidDeskSrc: '/img/wall/desk-errorlog.svg',
  phoneHeader: 'focus mode: on. reels: off.',
  // what the app sends (sample notifications)
  phone: [
    { key: 'mentor', app: 'Mentor', when: 'now', text: 'great mock! let’s fix those 7 silly mistakes at 7 pm.' },
    { key: 'streak', app: 'Streak', when: '4m', text: '42 days. don’t you dare break it.' },
    { key: 'check', app: 'Doubt solved', when: '1h', text: 'your Ksp question has a 2-step answer.' },
    { key: 'mentor', app: 'Parent app', when: '2h', text: 'Aarav: 5h 40m studied today, mock 214/300 ↑18' },
    { key: 'streak', app: 'Reels', when: 'blocked', text: 'focus mode said no. nice try.' },
    { key: 'check', app: 'Test', when: '3h', text: 'sunday full mock unlocks at 9 a.m.' },
  ],
  frame: {
    aria: 'A gold frame with no photo in it. not pictured: the friends who quizzed you on the periodic table at 1 a.m.',
    code: '404: photo not found',
    b: 'not pictured: the friends who quizzed you on the periodic table at 1 a.m.',
    p: 'you know who you are. after the exam, let’s take a selfie.',
    plate: 'no photo. still study buddies.',
  },
  headphonesAria: 'Headphones. The focus playlist is on.',
  toasts: {
    esc: 'esc isn’t here. it’s somewhere <b>on the desk</b>.',
    badge: '42-day streak. don’t you dare break it.',
    key: 'esc pressed. the syllabus is still here.',
    chaiEmpty: 'cup empty. refilled. chai #2 begins.',
    chai: (n: number) => `sip ${n}. focus +12%.`,
    frame: 'yes, you too.',
    plant: 'watered. it’s on a streak too.',
    patch: 'the discipline engine: daily targets, streaks, weekly review.',
    headphones: 'now playing: <b>lo-fi for focus</b> 🎧',
  },
  stackTitle: 'the stack',
  stackSerif: '(that gets you selected)',
  stackSub: 'what’s actually in the box. parents: this is the list to screenshot.',
  stack: [
    { k: 'mentorship', items: ['Personal mentor', '1:1s', 'Strategy calls'] },
    { k: 'study material', items: ['Notes', 'DPPs', 'PYQs', 'NCERT maps'] },
    { k: 'tests + analytics', items: ['Chapter tests', 'Full mocks', 'AITS', 'Heatmaps', 'Mistake tracker'] },
    { k: 'discipline', items: ['Streaks', 'Focus mode', 'Daily targets', 'Weekly review'] },
    { k: 'parents', items: ['Dashboard', 'Reports', 'Alerts', 'PTMs'] },
  ],
};

export const faq = {
  eyebrow: 'faq · the honest version',
  title: 'questions parents',
  titleSerif: 'actually ask',
  lede: 'and a few students ask too, usually at 1 a.m. still unsure? call us; a mentor picks up.',
  items: [
    {
      q: `Is ${inr(P.monthly)} really everything?`,
      a: 'Yes. Mentor, 1:1s, study material, every test, analytics, doubt solving, the Discipline Engine and the parent dashboard. Add-ons are optional extras, never a locked “premium” version of the core.',
    },
    {
      q: 'How are mentors selected?',
      a: '{{MENTOR_CRITERIA}}',
    },
    {
      q: 'What do parents actually see?',
      a: 'Attendance, study hours, test scores and their trend, chapter strength, the habit score and the mentor’s remarks. Plus a monthly report and instant alerts on missed tests or broken streaks.',
    },
    {
      q: 'Can I switch between JEE and NEET?',
      a: 'Yes. It’s the same plan and the same price. Your mentor rebuilds the study plan around the new syllabus.',
    },
    {
      q: 'Do I need this if I already go to offline coaching?',
      a: 'It works alongside it. Your mentor plans around your coaching timetable and uses the app for practice, tests, analysis and the parent reports.',
    },
    {
      q: 'What is the refund policy?',
      a: 'A 7-day full refund on your first payment. {{CONFIRM}}',
    },
    {
      q: 'Which classes do you cover?',
      a: 'JEE and NEET: class 11, class 12 and droppers. Olympiads: class 8 to 12. Board-exam alignment for class 11–12.',
    },
    {
      q: 'Hindi or English medium?',
      a: '{{CONFIRM}}',
    },
    {
      q: 'How fast are doubts answered?',
      a: 'In-app doubts are answered within 24 hours. The Live Doubt Pass add-on gets you live rooms and a priority queue.',
    },
    {
      q: 'Is my child’s data private?',
      a: 'Your child’s data is used only to plan, teach and report to you. We never sell it. {{PRIVACY_POLICY_URL}}',
    },
  ],
};

export const footer = {
  title1: 'let’s make it work',
  title2pre: 'on',
  title2serif: 'every',
  title2post: 'answer sheet.',
  hire: cta.primary,
  copyright: `© 2026 ${brand.name} · built for aspirants, checked by parents.`,
  bugsSay: 'a few distractions got into the footer. squash them.',
  bugsCount: 'distractions squashed',
  allSquashed: 'all distractions squashed. back to the DPP.',
  respawn: 'new notifications arrived. naturally.',
  duckGot: 'got one. quack.',
  cols: [
    {
      h: 'students',
      links: [
        { label: 'free diagnostic test', href: cta.diagnosticHref, ext: true, cursor: 'test' },
        { label: 'WhatsApp us', href: brand.whatsappHref, ext: true, cursor: 'chat' },
      ],
    },
    {
      h: 'parents',
      links: [
        { label: 'book a call', href: brand.phoneHref, ext: false, cursor: 'call' },
        { label: 'sample parent report', href: '#p-parents', ext: false, cursor: 'look' },
      ],
    },
    {
      h: 'follow',
      links: [
        { label: 'Instagram', href: brand.instagram, ext: true, cursor: 'instagram' },
        { label: 'YouTube', href: brand.youtube, ext: true, cursor: 'youtube' },
        { label: 'LinkedIn', href: brand.linkedin, ext: true, cursor: 'linkedin' },
      ],
    },
    {
      h: 'paperwork',
      links: [
        { label: 'plans & pricing', href: '#pricing', ext: false, cursor: 'look' },
        { label: 'refund policy', href: '#faq', ext: false, cursor: 'look' },
        { label: 'back to top', href: '#top', ext: false, cursor: 'up' },
      ],
    },
  ],
  dock: [
    { id: 'work', label: 'app' },
    { id: 'pricing', label: 'plans' },
    { id: 'timeline', label: 'journey' },
    { id: 'faq', label: 'faq' },
  ],
  dockCta: `${inr(P.monthly)}/mo`,
  dockMail: 'say hi',
  duck: [
    'explain it to me out loud. if you can’t, you don’t know it yet.',
    'it’s probably a sign error.',
    'check the units. it’s always the units.',
    'read the question again. slowly.',
    'the mistake is in the step you skipped.',
    'sleep. the formula will still be there tomorrow.',
    'got it right? put it in the error log anyway.',
    'quack. (that was your doubt, solved.)',
  ],
};
