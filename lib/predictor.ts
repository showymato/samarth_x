// Rank & college estimate for the #start predictor card.
// Same formula and data as the terminal's `predict` command (lib/behaviors/terminal.ts).
// It never invents numbers: with no official data loaded, `rank` is null and `colleges` is empty.
import { predictor } from '@/lib/content';
import jeeData from '@/data/predictor/jee.json';
import neetData from '@/data/predictor/neet.json';

type JeeRow = { institute: string; program: string; category: string; closingRank: number };
type NeetRow = { college: string; state?: string; category: string; closingRank: number };
type Data<R> = { year: number | null; rows: R[]; marksToRank?: { marks: number; rank: number }[] };
const jee = jeeData as unknown as Data<JeeRow>;
const neet = neetData as unknown as Data<NeetRow>;

export type Exam = 'jee' | 'neet';
export type Estimate = { rank: number | null; colleges: { name: string; closing: number }[]; year: number | null };

export const EXAMS = {
  jee: { label: 'JEE Main', unit: 'percentile', min: 0, max: 100, step: 0.1, start: 97.4 },
  neet: { label: 'NEET-UG', unit: 'marks / 720', min: 0, max: 720, step: 1, start: 610 },
} as const;

export function estimate(exam: Exam, score: number, category = 'OPEN'): Estimate {
  if (exam === 'jee') {
    const total = Number(predictor.jeeTotalCandidates);
    if (!Number.isFinite(total) || total <= 0) return { rank: null, colleges: [], year: jee.year };
    const rank = Math.max(1, ((100 - score) * total) / 100);
    const colleges = jee.rows
      .filter((r) => r.category.toUpperCase() === category && r.closingRank >= rank)
      .sort((a, b) => a.closingRank - b.closingRank)
      .slice(0, 3)
      .map((r) => ({ name: `${r.institute} · ${r.program}`, closing: r.closingRank }));
    return { rank, colleges, year: jee.year };
  }
  const table = (neet.marksToRank ?? []).slice().sort((a, b) => b.marks - a.marks);
  if (!neet.rows.length || table.length < 2) return { rank: null, colleges: [], year: neet.year };
  let rank = table[table.length - 1].rank;
  if (score >= table[0].marks) rank = table[0].rank;
  else
    for (let i = 0; i < table.length - 1; i++) {
      const a = table[i], b = table[i + 1];
      if (score <= a.marks && score >= b.marks) {
        rank = a.rank + ((a.marks - score) / (a.marks - b.marks || 1)) * (b.rank - a.rank);
        break;
      }
    }
  const colleges = neet.rows
    .filter((r) => r.category.toUpperCase() === category && r.closingRank >= rank)
    .sort((a, b) => a.closingRank - b.closingRank)
    .slice(0, 3)
    .map((r) => ({ name: r.state ? `${r.college} · ${r.state}` : r.college, closing: r.closingRank }));
  return { rank, colleges, year: neet.year };
}
