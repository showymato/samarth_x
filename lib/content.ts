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
  // hero characters (owner-supplied art, prepared by scripts/prep-hero-images.mjs:
  // same canvas, same face position, so the JEE ⟷ NEET curtain splits one face cleanly)
  cutout: '/img/hero/aspirant-engineer.webp',
  cutoutDoctor: '/img/hero/aspirant-doctor.webp',
  cutoutW: 720,
  cutoutH: 1038,
  // how much of the figure shows above the yellow strip, and its width as a share of the
  // space between the two text columns; centred between the columns
  cutoutVisible: 0.95,
  cutoutMaxCol: 0.62,
  cutoutCentred: true,
};

// ─────────────────────────────────────────────────────────────
// PRICES: the one place to change any price on the page.
// ─────────────────────────────────────────────────────────────
const P = {
  monthly: 3999,
  quarterly: 10799,
  annual: 38399,
  // starter offers: the funnel between "free" and the core plan
  starter: {
    trial: 1,
    mockReview: 99,
    blueprint: 499,
    companion: 999,
  },
  addons: {
    mentorSession: 799,
    mentorPack5: 3499,
    doubtPass: 699,
    doubtBundle: 1799,
    backlog: 2499,
    dropper: 1999,
    awayFromHome: 699,
    olympiadTrack: 1499,
    counselling: 2999,
    printedKit: 4999,
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

// ─────────────────────────────────────────────────────────────
// LEAD CAPTURE: every CTA on the page goes through one of these two.
// The `offer` param / prefilled message tells the owner which CTA a lead came from.
// ─────────────────────────────────────────────────────────────
export const LEAD_URL = '{{FORM_URL}}'; // Tally / Google Form / own backend
export const lead = (offer: string, extra: Record<string, string> = {}) =>
  `${LEAD_URL}?${new URLSearchParams({ offer, ...extra }).toString()}`;
export const WHATSAPP_URL = (message: string) => `${brand.whatsappHref}?text=${encodeURIComponent(message)}`;

export const funnel = {
  scholarshipDate: '{{SCHOLARSHIP_DATE}}',
  // discount on the quarterly / annual core plan. {{CONFIRM_SCHOLARSHIP_TIERS}}
  // `min` is the lowest score (%) in each band, read from the `score` label next to it.
  scholarshipTiers: [
    { score: '90%+', min: 90, off: 50 },
    { score: '75–89%', min: 75, off: 30 },
    { score: '60–74%', min: 60, off: 15 },
    { score: 'everyone who appears', min: 0, off: 5 },
  ],
  // flip to true once the tiers above are confirmed: the #start scholarship pass drops its "illustrative" label
  scholarshipConfirmed: false,
  referral: {
    buddy: 'study buddy: 2 friends join, both get 1 month 50% off',
    squad: 'squad of 3+: 15% off each + shared leaderboard',
    // short forms for chips (chips never wrap)
    buddyChip: 'study buddy: both get 50% off a month',
    squadChip: 'squad of 3+: 15% off each',
  },
  trialTerms: '₹1 trial: no auto-debit. you choose a plan after 7 days.', // {{CONFIRM_TRIAL_TERMS}}
  // seasonal "last 60 days" sprint: off. Nothing renders while enabled is false.
  sprint: { enabled: false },
};

// Rank & College Predictor (desk terminal). Never invent numbers: see data/predictor/README.md
export const predictor = {
  jeeTotalCandidates: '{{JEE_MAIN_TOTAL_CANDIDATES}}', // official NTA count for the year, as a number
  year: '{{YEAR}}',
  whatsappMessage: 'Predict my college: exam __, score __, category __, state __',
};

export const cta = {
  primary: `start for ${inr(P.monthly)}/mo`,
  diagnostic: 'take the free diagnostic test',
  parentCall: 'book a 15-min parent call',
  diagnosticHref: lead('diagnostic'),
};

export const hero = {
  file: { dir: `${brand.name} /`, name: 'timetable_final_FINAL_v', ext: '.pdf', repo: 'prep' },
  status: 'scholarship test',
  statusSub: `up to 50% off · ${'{{SCHOLARSHIP_DATE}}'}`,
  statusHref: '#start',
  ctaSecondary: `or the full plan at ${inr(P.starter.trial)} for 7 days`,
  ctaSecondaryHref: '#pricing',
  ctaNote: '15-min mentor call included · parents welcome',
  bubble: 'you don’t need more information. you need direction.',
  // the hero chat bubble cycles through these
  bubbles: [
    'you don’t need more information. you need direction.',
    'DPP at 6, mock at 9. i’m fine. totally fine.',
    'bas 5 minute aur. (it never works.)',
    'so many tabs open. no idea where to start.',
    'finally, someone to ask what to do next.',
  ],
  roleLine1: 'one dream, one mentor,', // nbsp: on narrow columns it breaks after "dream,"
  roleLine2Pre: 'every step',
  roleLine2Em: 'together',
  ctaPrimary: 'find your mentor',
  ctaSmall: '₹0',
  ctaScholarship: 'scholarship test',
  ctaScholarshipHref: lead('scholarship', { from: 'hero' }),
  lede: {
    pre: 'we combine ',
    bold: ['a mentor of your own', 'structured study material', 'tests that explain themselves', 'a parent dashboard'],
    mid: '. one place: ',
    a: 'for the student, and ',
    b: 'for the parents. JEE · NEET · Olympiad, ',
    em: 'one clear step at a time.',
  },
  quip: ['less confusion. more clarity.', 'someone by your side.'],
  stamp: 'scroll for receipts ✦ promises we can keep ✦',
  // multiplayer cursors that chat over the hero (an illustration, not a real conversation)
  cursors: [
    ['parent', 'how is my child doing, honestly?'],
    ['mentor', 'steady. 5h 40m today, and calmer.'],
    ['parent', 'and sunday’s mock?'],
    ['mentor', 'up 18 marks. silly mistakes are next.'],
    ['parent', 'they seem tired this week.'],
    ['mentor', 'noticed. lighter plan, sleep first.'],
  ] as [string, string][],
  cursorNames: { a: 'parent', b: 'mentor' },
  xray: [
    ['frontal lobe', 'plans the week. then re-plans it.'],
    ['occipital lobe', 'spots a sign error from orbit.'],
    ['cerebellum', 'muscle memory: formulas, ctrl+z.'],
  ] as [string, string][],
  xrayPhone: 'covering face, as is tradition.',
  xrayHeart: 'runs on chai, small wins and 2 a.m. doubts.',
  xrayTag: 'x-ray · 206 bones · 1 mentor',
  photoAlt: 'Illustrated student taking a selfie, surrounded by study stickers.',
  builtFor: 'built for',
  gateNote: ['gate 2028 · no delays reported', 'by your mentor'],
};

// "Two futures, one aspirant": the hero curtain (JEE engineer ⟷ NEET doctor).
// All numbers are illustrative mock-UI values, not result claims.
export const futures = {
  handle: { a: 'JEE', b: 'NEET', aria: 'Switch between future engineer and future doctor' },
  aria: {
    eng: 'Illustrated student taking a selfie as a future engineer, surrounded by study notes.',
    doc: 'Illustrated student taking a selfie as a future doctor, surrounded by study notes.',
  },
  hint: ['drag →', 'see the doctor'],
  caption: { eng: 'future engineer · JEE', doc: 'future doctor · NEET' },
  bubbleBoth: 'why not both? ask your mentor.',
  // [spot, engineer, doctor]
  callouts: [
    ['frontal lobe', 'derives it before memorising it.', 'remembers every NCERT line. even the footnotes.'],
    ['occipital lobe', 'spots a sign error from orbit.', 'spots the wrong option in 0.3 s.'],
    ['cerebellum', 'muscle memory: integration by parts.', 'muscle memory: Krebs cycle, in order.'],
    ['heart ♡', 'runs on chai and 2 a.m. doubts.', '72 bpm. even during the mock.'],
    ['arms', 'crossed: the sunday mock is done.', 'crossed: the NEET mock is done.'],
  ] as [string, string, string][],
  label: { eng: 'blueprint · 1 aspirant · 1 mentor', doc: 'x-ray · 206 bones · 1 mentor' },
  chips: {
    eng: ['42 STREAK', 'SUNDAY MOCK 214/300 ↑18', 'focus mode: ON', 'PV = nRT'],
    doc: ['42 STREAK', 'NEET MOCK 642/720 ↑31', 'focus mode: ON', 'ATP → ADP + Pᵢ'],
  },
  idLanyard: 'Dr. ___ (loading…)',
};

// halftone loading screen: DPI steps and what it says at each one
export const loader = {
  steps: [
    [6, 'low-res aspirant. loading clarity.'],
    [9, 'low-res aspirant. loading clarity.'],
    [12, 'low-res aspirant. loading clarity.'],
    [18, 'low-res aspirant. loading clarity.'],
    [28, 'adding dots. lots of DPPs.'],
    [44, 'adding dots. lots of DPPs.'],
    [72, 'that’s a student. probably.'],
    [110, 'that’s a student. probably.'],
    [150, 'sharpening. so many formulas.'],
    [200, 'sharpening. so many formulas.'],
    [240, 'aligning the inks.'],
    [300, 'ready when you are.'],
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
  pre: ['most', 'students', 'have'],
  a: 'coaching',
  or: 'and',
  b: 'content',
  mid: ['what’s', 'missing', 'is', 'direction,', 'and', 'someone', 'to', 'ask'],
  plus: '+mentor',
  minus: '−confusion',
  diffLabel: 'a mentor added, confusion removed',
  after: ['no', 'rank', 'promises.', 'no', 'hard', 'sell.', 'just'],
  last: ['a', 'clear', 'next', 'step.'],
  sub: 'here’s what we commit to',
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
  { pre: '', n: 1, suf: ':1', label: 'a personal mentor for every student', foot: 'one person who knows your plan' },
  { pre: '', n: 52, suf: '+', label: 'tests a year in the core plan', foot: 'feedback, not a verdict' },
  { pre: '', n: 20, suf: ' yrs', label: 'of PYQs, solved and tagged by chapter', foot: 'so you know what gets asked' },
  { pre: '', n: 12, suf: '', label: 'parent reports a year, minimum', foot: 'calmer conversations at home' },
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
  aside: 'what we commit to. not what we claim.',
};

type Link = { label: string; href?: string; main?: boolean };

// "start here. it's free." (#start): the top of the funnel
export const start = {
  eyebrow: 'start here · free',
  title: 'start here.',
  titleSerif: 'it’s free.',
  lede: 'not sure where to begin? begin here. no payment, no sales pitch. parents welcome on every call.',
  // every preview below is a demo with sample data: it collects nothing and is not anyone's result
  sampleNote: 'illustrative · sample data',
  diagnostic: {
    id: 'start-diagnostic',
    accent: '#ff6b1a',
    no: '01 / assess',
    eyebrow: 'know where you stand',
    title: 'find your starting point.',
    blurb: 'understand your strengths, identify learning gaps and discover what to focus on next, with guidance from a mentor.',
    meta: ['90 minutes', 'free', '15-minute mentor review'],
    cta: 'start assessment',
    href: lead('diagnostic', { from: 'start' }),
    preview: 'preview assessment',
    replay: 'replay',
    analysing: 'analysing responses',
    exams: {
      jee: {
        label: 'JEE',
        subjects: [
          { k: 'Physics', v: 74, insight: 'physics is steady. mechanics is your strong ground.', next: 'your next step: timed practice on rotational motion.' },
          { k: 'Chemistry', v: 58, insight: 'chemistry needs a little more attention.', next: 'your next step: revise organic chemistry fundamentals.' },
          { k: 'Mathematics', v: 86, insight: 'mathematics is your strongest subject right now.', next: 'your next step: keep it warm with one mixed set a day.' },
        ],
      },
      neet: {
        label: 'NEET',
        subjects: [
          { k: 'Physics', v: 61, insight: 'physics needs a little more attention.', next: 'your next step: rebuild the basics of current electricity.' },
          { k: 'Chemistry', v: 72, insight: 'chemistry is coming along well.', next: 'your next step: NCERT line-by-line for p-block.' },
          { k: 'Biology', v: 84, insight: 'biology is your strongest subject right now.', next: 'your next step: diagram drills to protect the easy marks.' },
        ],
      },
    },
  },
  scholarship: {
    id: 'start-scholarship',
    accent: '#8b5cf6',
    no: '02 / access',
    eyebrow: 'make guidance accessible',
    title: 'ambition deserves a chance.',
    blurb: 'explore scholarship opportunities that make personal mentorship more accessible.',
    meta: ['online', 'free to take', `next: ${'{{SCHOLARSHIP_DATE}}'}`],
    cta: 'explore scholarship',
    href: lead('scholarship', { from: 'start' }),
    slider: 'example score',
    applies: 'off the quarterly or annual core plan',
    message: (off: number, everyone: boolean) =>
      everyone
        ? `everyone who appears gets ${off}% off. taking the test is already a step.`
        : `a score in this band would mean ${off}% off. your mentor stays the same either way.`,
    pending: 'not an offer yet',
  },
  predictor: {
    id: 'start-predictor',
    accent: '#12a150',
    no: '03 / explore',
    eyebrow: 'explore your possibilities',
    title: 'see what lies ahead.',
    blurb: 'understand your potential college options and make informed decisions about your academic future.',
    meta: ['JEE Main', 'NEET-UG', 'estimate, not a guarantee'],
    cta: 'explore colleges',
    href: '#about',
    whatsapp: { label: 'full list on WhatsApp', href: WHATSAPP_URL('Predict my college: exam __, score __, category __, state __') },
    explore: 'explore',
    restart: 'change score',
    nodes: ['your score', 'est. rank', 'colleges'],
    noData: 'awaiting official data',
    noDataNote: 'no official cutoff data is loaded yet, so no rank or college is shown. the terminal and WhatsApp give you the full estimate.',
    disclaimer: 'an estimate from official data, never a guarantee.',
  },
};

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
    ': a person who knows where you get stuck, tests that show what to work on next, and a dashboard that keeps parents in the loop. each card is a ',
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
      title: 'Someone who sees more than your marks: a person, not a chat.',
      blurb:
        'One mentor who knows your weak chapters and what gets in the way. Two 1:1s a month, a weekly plan re-made after every test, strategy calls before the big ones. Stuck? You have someone to ask. Parents get a note after every 1:1.',
      tags: ['Personal mentor', '1:1 sessions', 'Weekly plan', 'Strategy calls'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        { label: 'free diagnostic test', href: lead('diagnostic', { from: 'mentor' }) },
      ],
    },
    {
      id: 'p-tests',
      accent: '#12a150',
      mock: 'score',
      role: 'Pillar 02 · tests + analytics',
      title: 'Tests that tell you why: not just how much.',
      blurb:
        'Chapter tests every week, full mocks every month, an All-India Test Series. Plus a chapter-wise heatmap, time per question, and a silly-mistake tracker for the easiest marks to win back. Marks are feedback, not identity. Parents see the trend, not just the score.',
      tags: ['Chapter tests', 'Full mocks', 'All-India test series', 'Error analysis'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        { label: `${inr(P.starter.mockReview)} mock + mentor review`, href: lead('mock99', { from: 'tests' }) },
      ],
    },
    {
      id: 'p-parents',
      accent: '#7c3aed',
      mock: 'parents',
      sticker: 'parents? in the loop.',
      role: 'Pillar 03 · parent app · reports',
      title: 'Parents stay informed. Students stay trusted.',
      blurb:
        'Attendance, study hours, test trend, chapter strength and the mentor’s remarks, in one dashboard. A monthly report, an instant heads-up on missed tests or broken streaks, and a quarterly video PTM. For students: fewer worried questions at home.',
      tags: ['Parent app', 'Monthly report', 'Alerts', 'PTM calls'],
      links: [
        { label: 'see the plan', href: '#pricing', main: true },
        // {{CONFIRM}}: the PDF is a clearly-labelled SAMPLE with fictional data
        { label: 'see a sample parent report (PDF)', href: '/sample-parent-report.pdf' },
        { label: cta.parentCall, href: brand.phoneHref },
      ],
    },
  ] as StackCard[],
  bench: {
    title: 'discover your path',
    head: 'three programs, one plan, one price. choose your path; the mentor, the tests and the parent dashboard come with all of them.',
    cards: [
      {
        id: 'p-jee',
        accent: '#ff4f9a',
        mock: 'editor' as const,
        role: 'JEE Main + Advanced · class 11 · 12 · droppers',
        title: 'JEE: Physics, Chemistry, Maths',
        blurb:
          'Ambition, with direction. Concept-first notes, daily DPPs, chapter PYQs, real-pattern mocks. Irodov is optional. Consistency isn’t.',
        tags: ['Physics', 'Chemistry', 'Maths', 'BITSAT'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic', href: lead('diagnostic', { exam: 'jee' }) },
        ],
      },
      {
        id: 'p-neet',
        accent: '#8b5cf6',
        mock: 'chat' as const,
        role: 'NEET-UG · class 11 · 12 · droppers',
        title: 'NEET: Physics, Chemistry, Biology',
        blurb:
          'A big syllabus, in days you can manage: NCERT line-by-line, daily biology flashcards, diagram drills, assertion-reason practice and mocks with OMR timing.',
        tags: ['Biology', 'Chemistry', 'Physics', 'NCERT-mapped'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic', href: lead('diagnostic', { exam: 'neet' }) },
        ],
      },
      {
        id: 'p-olympiad',
        accent: '#ff3b30',
        mock: 'flight' as const,
        role: 'Olympiad & Foundation · class 8–12',
        title: 'Olympiad & Foundation · Class 8–12',
        blurb:
          'Curiosity deserves a companion. NSEJS, IOQM, NSEP, NSEC, NSEB + weekend problem camps, stage-wise roadmaps, proof-writing. Foundation years: no rush.',
        tags: ['NSEJS', 'IOQM · INMO', 'NSEP · NSEC', 'NSEB'],
        links: [
          { label: 'see plan', href: '#pricing' },
          { label: 'free diagnostic', href: lead('diagnostic', { exam: 'olympiad' }) },
        ],
      },
    ],
  },
  more: {
    title: 'add-ons',
    head: 'the core plan covers everything. these are for when you need a little extra.',
    rows: [
      {
        n: 'Extra 1:1s',
        w: 'Extra 1:1 Mentor Sessions: 60 minutes, any subject or strategy',
        s: `${inr(P.addons.mentorSession)}/session · 5 for ${inr(P.addons.mentorPack5)}`,
        href: lead('addon-extra-1on1'),
      },
      {
        n: 'Doubt Pass',
        w: 'PCMB Live Doubt Pass: live doubt rooms, subject experts, priority queue',
        s: `${inr(P.addons.doubtPass)}/subject/mo · science bundle ${inr(P.addons.doubtBundle)}/mo`,
        href: lead('addon-doubt-pass'),
      },
      {
        n: 'Backlog Khatam',
        w: 'Backlog Khatam Bootcamp, 30 days: class 11 backlog, cleared calmly before class 12 begins',
        s: `${inr(P.addons.backlog)} · 30 days`,
        href: lead('addon-backlog'),
      },
      {
        n: 'Dropper Reset',
        w: 'plan rebuild + a counsellor session. one bad year is data, not destiny',
        s: `${inr(P.addons.dropper)} first month`,
        href: lead('addon-dropper'),
      },
      {
        n: 'Away From Home',
        w: 'for hostel/PG students: daily check-ins, wellbeing calls, instant parent updates',
        s: `${inr(P.addons.awayFromHome)}/mo`,
        href: lead('addon-away-from-home'),
      },
      {
        n: 'Olympiad Pro',
        w: 'Olympiad Advanced Track: proof-writing, INMO/INPhO-level sets, an olympiad mentor',
        s: `${inr(P.addons.olympiadTrack)}/mo`,
        href: lead('addon-olympiad'),
      },
      {
        n: 'Counselling',
        w: 'JoSAA/CSAB, MCC & state counselling, choice filling. open to non-members',
        s: `${inr(P.addons.counselling)} one-time`,
        href: lead('addon-counselling'),
      },
      {
        n: 'Printed Kit',
        w: 'Printed Study Kit: modules, formula books and PYQ books, delivered home',
        s: `${inr(P.addons.printedKit)} one-time`,
        href: lead('addon-printed-kit'),
      },
    ],
  },
};

export const plans = {
  eyebrow: 'pricing · one plan',
  titlePre: `${brand.name}`,
  titleSerif: 'One',
  lede: 'one mentorship experience. three ways to begin. choose the billing cycle that works for you.',
  motto: 'one plan. your pace. your choice.',
  sameValue: 'same mentorship. same features. different billing cycle.',
  views: [
    { id: 'total', label: 'total billed' },
    { id: 'monthly', label: 'per month' },
    { id: 'savings', label: 'savings' },
  ] as const,
  // illustrative preparation stages for the plan previews: not mentorship schedules or promised outcomes
  monthlyWeeks: [
    { from: 1, to: 7, k: 'getting started', d: 'meet your mentor, map the syllabus, agree on a realistic week.' },
    { from: 8, to: 14, k: 'setting priorities', d: 'pick the chapters that matter most right now, and park the rest.' },
    { from: 15, to: 21, k: 'focused practice', d: 'daily DPPs on the priority chapters, doubts cleared as they come.' },
    { from: 22, to: 27, k: 'understanding progress', d: 'a test, then a calm look at what moved and what didn’t.' },
    { from: 28, to: 30, k: 'adjusting your plan', d: 'keep what worked, change what didn’t, set up next month.' },
  ],
  quarterMonths: [
    { k: 'find direction', items: ['diagnostic + mentor match', 'a weekly plan around school', 'first chapter tests'] },
    { k: 'build consistency', items: ['daily DPPs + streaks', 'regular mentor check-ins', 'error log, every test'] },
    { k: 'reflect and refine', items: ['full mock + review', 'revise the weak chapters', 'plan the next term'] },
  ],
  yearPhases: [
    { k: 'understand', d: 'concepts first. find where you stand and build the base.' },
    { k: 'strengthen', d: 'close the gaps chapter by chapter, with regular tests.' },
    { k: 'practise', d: 'full mocks, PYQs and timing, reviewed with your mentor.' },
    { k: 'refine', d: 'revision cycles, the error log, a calm plan for exam day.' },
  ],
  cycles: [
    {
      id: 'monthly',
      months: 1,
      accent: '#ff6b1a',
      eyebrow: '01 / month by month',
      headline: 'find your rhythm.',
      desc: 'begin with a month of structured preparation, personal guidance and someone to help you stay on track.',
      badge: 'try it out',
      cycle: 'Monthly',
      price: P.monthly,
      per: '/mo',
      line: `${inr(P.monthly)} a month · cancel any time`,
      sub: `≈${inr(pricing.perDayMonthly)} a day`,
      cta: 'start monthly',
      href: lead('plan-monthly'),
    },
    {
      id: 'quarterly',
      months: 3,
      accent: '#8b5cf6',
      eyebrow: '02 / a full term',
      headline: 'build your momentum.',
      desc: 'give yourself three months to find direction, develop better habits and prepare with consistent guidance.',
      badge: 'a full term',
      cycle: 'Quarterly',
      price: P.quarterly,
      per: '/3 mo',
      line: `${inr(pricing.effQuarterly)}/mo effective · save ${inr(pricing.saveQuarterly)}`,
      sub: 'one term, one mentor, zero gaps',
      cta: 'start quarterly',
      href: lead('plan-quarterly'),
    },
    {
      id: 'annual',
      months: 12,
      accent: '#12a150',
      eyebrow: '03 / the long journey',
      headline: 'every step, together.',
      desc: 'a full year of guidance, structured preparation and a mentor by your side as your academic journey evolves.',
      badge: 'best value',
      cycle: 'Annual',
      price: P.annual,
      per: '/yr',
      line: `${inr(pricing.effAnnual)}/mo effective · save ${inr(pricing.saveAnnual)}`,
      sub: `≈${inr(pricing.perDayAnnual)} a day · the whole syllabus, one plan`,
      cta: 'start annual',
      href: lead('plan-annual'),
    },
  ],
  includedTitle: 'everything included',
  includedSub: 'on every cycle. no asterisks.',
  included: [
    { k: 'mentor', items: ['Dedicated personal mentor', '2 × 1:1 sessions a month', 'Daily + weekly study plan', 'Re-planned after every test'] },
    { k: 'material', items: ['Notes + DPPs', 'Chapter-wise PYQs, 20 years', 'Formula sheets', 'NCERT-mapped content'] },
    { k: 'tests', items: ['Weekly chapter tests', 'Monthly full mocks', 'All-India Test Series', 'Doubts answered within 24h'] },
    { k: 'analytics', items: ['Chapter heatmaps', 'Time per question', 'Silly-mistake tracker', 'Rank predictor'] },
    { k: 'habits + parents', items: ['The Consistency Engine', 'Parent dashboard', 'Monthly report + alerts', 'Boards + competitive, together'] },
  ],
  trust: [
    'free diagnostic',
    'scholarships up to 50%',
    funnel.referral.buddyChip,
    funnel.referral.squadChip,
    '7-day refund {{CONFIRM}}',
  ],
  // "not ready for ₹3,999? start small." (receipts cards under the core plan)
  starterTitle: `not ready for ${inr(P.monthly)}? start small.`,
  starterSub: 'try it first. decide when you’re sure.',
  starter: [
    {
      id: 'diagnostic', price: 0, suf: '', name: 'Free Diagnostic Test',
      line: '90 minutes, a chapter-wise weakness map and a 15-min mentor call. parents welcome',
      cta: 'take the test', href: lead('diagnostic', { from: 'pricing' }),
    },
    {
      id: 'trial', price: P.starter.trial, suf: '', name: '7-day trial',
      line: 'the full core plan for a week, including one real 1:1 mentor session',
      cta: 'start the ₹1 trial', href: lead('trial'),
    },
    {
      id: 'mock99', price: P.starter.mockReview, suf: '', name: 'Mock + Mentor Review',
      line: 'one full mock, deep analysis, a 20-min call: “here’s what to fix first”',
      cta: 'book the review', href: lead('mock99'),
    },
    {
      id: 'blueprint', price: P.starter.blueprint, suf: '', name: 'Exam Strategy Blueprint',
      line: 'one 1:1 session. you leave with a plan all the way to exam day',
      cta: 'get the blueprint', href: lead('blueprint'),
    },
    {
      id: 'companion', price: P.starter.companion, suf: '/mo', name: 'Coaching Companion',
      line: 'already in a coaching institute? upload your current coaching’s tests; your mentor analyses them and plans your week',
      cta: 'add a companion', href: lead('companion'),
    },
  ],
  trialNote: funnel.trialTerms,
  note: pricing.gstNote,
  parents: 'for parents: the same guidance, the same support, and clear visibility into your child’s preparation. only the billing cycle changes.',
};

export const play = {
  eyebrow: 'the wall · posters',
  titlePre: 'the',
  titleSerif: 'wall',
  aside: '*for your study desk',
  lede: 'posters for your study desk. screenshot one. look at it on a hard day, or at 2 a.m. small reminders that progress counts, even the slow kind.',
  cta: 'join the 7-day consistency challenge',
  ctaHref: lead('challenge', { from: 'wall' }),
  marquee: ['focus', 'revise', 'practise', 'ask', 'analyse', 'rest', 'show up'],
  filters: [
    { key: 'all', label: 'all' },
    { key: 'discipline', label: 'consistency' },
    { key: 'exams', label: 'exams' },
    { key: 'habits', label: 'habits' },
  ],
  tiles: [
    { tags: 'discipline', src: '/img/wall/poster-01.svg', w: 640, h: 905, cap: 'Small habits, poster 01', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-02.svg', w: 640, h: 640, cap: 'The syllabus is finite, poster 02', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-03.svg', w: 640, h: 960, cap: 'Day by day, poster 03', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-04.svg', w: 640, h: 640, cap: 'Progress = habits, poster 04', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-05.svg', w: 640, h: 960, cap: '1 DPP a day, poster 05', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-06.svg', w: 640, h: 640, cap: 'Ask the doubt today, poster 06', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-07.svg', w: 640, h: 960, cap: 'Boring Tuesdays, poster 07', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-08.svg', w: 640, h: 640, cap: 'Fewer tabs, poster 08', year: '2026' },
    { tags: 'exams', src: '/img/wall/poster-09.svg', w: 640, h: 410, cap: 'Mocks guide you, poster 09', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-10.svg', w: 640, h: 640, cap: 'Consistency, poster 10', year: '2026' },
    { tags: 'discipline', src: '/img/wall/poster-11.svg', w: 640, h: 640, cap: 'Rest is part of the plan, poster 11', year: '2026' },
    { tags: 'habits', src: '/img/wall/poster-12.svg', w: 640, h: 905, cap: 'Excellence is a habit, poster 12', year: '2026' },
  ],
  arcadeTitle: 'the arcade',
  arcadeHead: 'four tiny games for your 5-minute break. five. not fifty. best scores stay on your device.',
};

export const quotes = [
  'Motivation gets you to the desk. Small habits keep you there.',
  'The syllabus is finite. You’ll get through it.',
  'Nobody gets ready in a day. Everyone who did, did it day by day.',
  'Progress is a lagging indicator of your habits.',
  '1 DPP a day beats 10 on Sunday.',
  'Ask the doubt today, not in the exam hall.',
  'Progress isn’t made on result day. It’s made on boring Tuesdays.',
  'You don’t need more time. You need fewer tabs.',
  'Mock tests don’t judge you. They guide you.',
  'Consistency is a superpower you build quietly.',
  'Rest is part of the plan. Not a break from it.',
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
  titlePost: 'your prep.',
  lede: [
    'every version of the journey, on one branch graph. ',
    { b: 'small steps documented' },
    ', old habits deprecated, and nobody ships it alone.',
  ] as (string | { b: string })[],
  // lane names on the graph and in the legend
  lanes: { main: 'main', work: 'practice', side: 'support' },
  commits: [
    {
      v: 'v0.1', vSmall: '-beta', type: 'pre-release', lane: 'main', date: 'day 0',
      title: 'Diagnostic test', org: 'free · 90 minutes · all subjects',
      notes: [['add', 'we find where you actually stand'], ['add', 'free. with a mentor call. parents welcome.'], ['bug', 'known issue: you thought you knew rotational motion']],
    },
    {
      v: 'v0.2', vSmall: '-beta', type: 'pre-release', lane: 'side', date: 'week 1',
      title: 'Mentor match & plan', org: 'personal mentor · weekly plan',
      notes: [['add', 'a mentor who knows your name and your weak chapters'], ['add', 'a plan built around your school timings']],
    },
    {
      v: 'v1.0', type: 'major', lane: 'main', date: 'month 1',
      title: 'First full mock', org: 'full syllabus pattern · timed',
      notes: [['add', 'baseline score set'], ['chg', 'panic → a plan']],
    },
    {
      v: 'v1.1', type: 'minor', lane: 'work', date: 'month 2',
      title: 'The habit phase', org: 'the consistency engine',
      notes: [['add', 'daily DPPs, weekly 1:1, streaks'], ['bug', 'breaking change: phone goes in the other room']],
    },
    {
      v: 'v1.2', type: 'minor', lane: 'side', date: 'month 2',
      title: 'First parent report', org: 'parent app · monthly',
      notes: [['add', 'parents informed, not anxious'], ['chg', '“how’s it going?” → a real answer']],
    },
    {
      v: 'v2.0', type: 'major', lane: 'main', date: 'month 6',
      title: 'Syllabus 50%', org: 'chapter tests · heatmap',
      notes: [['add', 'more chapters turning green'], ['bug', 'known issue: organic still has opinions']],
    },
    {
      v: 'v2.1', type: 'minor', lane: 'work', date: 'month 8',
      title: 'Revision cycle 1', org: 'spaced revision · error log',
      notes: [['add', 'spaced revision, error-log review'], ['chg', 'old mistakes: deprecated']],
    },
    {
      v: 'v3.0', type: 'major', lane: 'main', date: 'month 12',
      title: 'All-India Test Series', org: 'national percentile · monthly',
      notes: [['add', 'a national percentile, every month'], ['chg', 'a clearer picture of where you stand']],
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
    title: 'Your next chapter.',
    branch: 'feat/next-chapter',
    notes: [['add', 'counselling, college, and beyond'], ['add', 'counselling desk: choice filling done right'], ['chg', 'your relatives finally stop asking']] as [('add' | 'chg'), string][],
    cta: 'start your journey',
    href: '#pricing',
  },
  npm: {
    bar: '~/enrolment',
    cmd: 'npm install rank@latest',
    out1: ['added ', '1 personal mentor, 52 tests a year, 1 parent dashboard', ' in 2y 0m'],
    out2: ['found ', '0', ' reasons to do it alone'],
    out3pre: '1 student is about to find their direction. run ',
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
    ['role', 'curious mind, part-time procrastinator (recovering)'],
    ['shell', 'chai + NCERT'],
    ['debugger', 'error log notebook'],
    ['uptime', '42-day streak'],
    ['cpu', 'brain @ 2 cups of chai'],
    ['memory', '70% formulas, 30% reaction mechanisms'],
  ],
  todo: ['✓ finish DPP 14', '✓ revise thermo', '✓ analyse sunday mock', '☐ sleep 8 hours (mentor insists)', '☐ touch grass (sun, 5 pm)'],
  pinkNote: ['motivation gets you to the desk.', 'small habits keep you there.'],
  badge: ['42', 'day streak'],
  badgeAria: 'Badge: a 42-day streak',
  patch: ['consistency engine', 'streak · day 42'],
  card: [brand.name, 'mentor · guide · companion', 'JEE · NEET · Olympiad'],
  polaroidMe: 'me, mock-test sunday',
  polaroidDesk: 'the error log, mock 14',
  polaroidDeskSrc: '/img/wall/desk-errorlog.svg',
  phoneHeader: 'focus mode: on. reels: off.',
  // what the app sends (sample notifications)
  phone: [
    { key: 'mentor', app: 'Mentor', when: 'now', text: 'great mock! let’s fix those 7 silly mistakes at 7 pm.' },
    { key: 'streak', app: 'Streak', when: '4m', text: '42 days. and if it breaks, we restart.' },
    { key: 'check', app: 'Scholarship', when: 'now', text: 'you scored 82%. 30% off unlocked.' },
    { key: 'mentor', app: 'Parent app', when: '2h', text: 'Aarav: 5h 40m studied today, mock 214/300 ↑18' },
    { key: 'streak', app: 'Reels', when: 'blocked', text: 'focus mode said no. nice try.' },
    { key: 'streak', app: 'Challenge', when: '2h', text: 'day 4/7 done. 3 more to win.' },
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
    badge: '42-day streak. one day at a time.',
    key: 'esc pressed. take a breath. the syllabus will wait.',
    chaiEmpty: 'cup empty. refilled. chai #2 begins.',
    chai: (n: number) => `sip ${n}. focus +12%.`,
    frame: 'yes, you too.',
    plant: 'watered. it’s on a streak too.',
    patch: 'the consistency engine: daily targets, streaks, weekly review.',
    headphones: 'now playing: <b>lo-fi for focus</b> 🎧',
  },
  stackTitle: 'the stack',
  stackSerif: '(that keeps you going)',
  stackSub: 'what’s actually in the box. parents: this is the list to screenshot.',
  stack: [
    { k: 'mentorship', items: ['Personal mentor', '1:1s', 'Strategy calls'] },
    { k: 'study material', items: ['Notes', 'DPPs', 'PYQs', 'NCERT maps'] },
    { k: 'tests + analytics', items: ['Chapter tests', 'Full mocks', 'AITS', 'Heatmaps', 'Mistake tracker'] },
    { k: 'consistency', items: ['Streaks', 'Focus mode', 'Daily targets', 'Weekly review'] },
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
      a: 'Yes. Mentor, 1:1s, study material, every test, analytics, doubt solving, the Consistency Engine and the parent dashboard. Add-ons are optional extras, never a locked “premium” version of the core.',
    },
    {
      q: 'How are mentors selected?',
      a: '{{MENTOR_CRITERIA}}',
    },
    {
      q: 'What do parents actually see?',
      a: 'Attendance, study hours, test trend, chapter strength, habit score and the mentor’s remarks. A monthly report, plus instant alerts on missed tests or broken streaks. Informed, never hovering.',
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
      q: 'How does the scholarship test work?',
      a: `It’s free and online. Your score sets your discount on the quarterly or annual core plan: ${funnel.scholarshipTiers.map((t) => `${t.score} → ${t.off}% off`).join(', ')}. Next test: {{SCHOLARSHIP_DATE}}.`,
    },
    {
      q: `What exactly do I get in the ${inr(P.starter.trial)} trial? Will I be charged after?`,
      a: 'The full core plan for 7 days, including one real 1:1 mentor session. No auto-debit: nothing is charged after the 7 days unless you choose a plan. {{CONFIRM_TRIAL_TERMS}}',
    },
    {
      q: 'I already go to a coaching institute. Is the Coaching Companion for me?',
      a: `Yes, that’s exactly who it’s for (${inr(P.starter.companion)}/mo). Upload your current coaching’s tests; your mentor analyses them and plans your week around your classes. We don’t replace your coaching. We make it work.`,
    },
    {
      q: 'How accurate is the predictor?',
      a: 'It’s an estimate from last year’s official data, not a guarantee. Cutoffs and closing ranks change every year with paper difficulty, seats and category.',
    },
    {
      q: 'How does the Study Buddy referral work?',
      a: `When 2 friends join through you, you and they each get 1 month at 50% off. Squads of 3 or more get 15% off each plus a shared leaderboard. {{CONFIRM}}`,
    },
    {
      q: 'My child lives in a hostel. What does the Away-From-Home Pack include?',
      a: `Daily check-ins, wellbeing calls with a counsellor, and instant parent alerts on missed tests or broken streaks. ${inr(P.addons.awayFromHome)}/mo on top of the core plan.`,
    },
    {
      q: 'Is my child’s data private?',
      a: 'Your child’s data is used only to plan, teach and report to you. We never sell it. {{PRIVACY_POLICY_URL}}',
    },
  ],
};

export const footer = {
  title1: 'let’s figure it out',
  title2pre: 'every',
  title2serif: 'step',
  title2post: 'of the way.',
  hire: 'take the free test',
  hireHref: lead('diagnostic', { from: 'footer-hire' }),
  copyright: `© 2026 ${brand.name} · a mentor. a guide. a companion.`,
  bugsSay: 'a few distractions got into the footer. squash them.',
  bugsCount: 'distractions squashed',
  allSquashed: 'all distractions squashed. back to the DPP.',
  respawn: 'new notifications arrived. naturally.',
  duckGot: 'got one. quack.',
  cols: [
    {
      h: 'students',
      links: [
        { label: 'free diagnostic test', href: lead('diagnostic', { from: 'footer' }), ext: true, cursor: 'test' },
        { label: `scholarship test · ${'{{SCHOLARSHIP_DATE}}'}`, href: lead('scholarship', { from: 'footer' }), ext: true, cursor: 'register' },
        { label: 'WhatsApp us', href: WHATSAPP_URL('Hi SamarthX, I have a question'), ext: true, cursor: 'chat' },
      ],
    },
    {
      h: 'parents',
      links: [
        { label: 'book a call', href: brand.phoneHref, ext: false, cursor: 'call' },
        { label: 'sample parent report', href: '/sample-parent-report.pdf', ext: true, cursor: 'pdf' },
        { label: 'book the free diagnostic', href: lead('diagnostic', { from: 'footer-parents' }), ext: true, cursor: 'test' },
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
    { id: 'start', label: 'start' },
    { id: 'pricing', label: 'plans' },
    { id: 'timeline', label: 'journey' },
    { id: 'faq', label: 'faq' },
  ],
  dockCta: 'free test',
  dockCtaHref: lead('diagnostic', { from: 'dock' }),
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
