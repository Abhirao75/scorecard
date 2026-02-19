export type Status = 'planned' | 'in-progress' | 'done';

export interface RiceData {
  reach: number;
  impact: number;      // 0.25 | 0.5 | 1 | 2 | 3
  confidence: number;  // 0.5 | 0.8 | 1.0
  effort: number;      // Fibonacci: 1 | 2 | 3 | 5 | 8 | 13 | 21
  score: number;       // computed
}

export interface IceData {
  impact: number;      // 1–10
  confidence: number;  // 1–10
  ease: number;        // 1–10
  score: number;       // computed: (impact × confidence × ease) / 10
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  notes: string;
  tags: string[];
  status: Status;
  createdAt: string;
  riceManualRank?: number;
  iceManualRank?: number;
  rice: RiceData | null;
  ice: IceData | null;
}

export type Framework = 'rice' | 'ice' | 'both';
