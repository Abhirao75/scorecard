import type { RiceData, IceData } from '../types';

export const IMPACT_OPTIONS = [
  { label: 'Massive', value: 3 },
  { label: 'High', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Low', value: 0.5 },
  { label: 'Minimal', value: 0.25 },
];

export const CONFIDENCE_OPTIONS = [
  { label: 'High (100%)', value: 1.0 },
  { label: 'Medium (80%)', value: 0.8 },
  { label: 'Low (50%)', value: 0.5 },
];

export const FIBONACCI_OPTIONS = [1, 2, 3, 5, 8, 13, 21];

export function computeRiceScore(data: Omit<RiceData, 'score'>): number {
  if (data.effort === 0) return 0;
  return Math.round((data.reach * data.impact * data.confidence) / data.effort * 10) / 10;
}

export function computeIceScore(data: Omit<IceData, 'score'>): number {
  return Math.round((data.impact * data.confidence * data.ease) / 10 * 10) / 10;
}

export function getImpactLabel(value: number): string {
  return IMPACT_OPTIONS.find(o => o.value === value)?.label ?? String(value);
}

export function getConfidenceLabel(value: number): string {
  return CONFIDENCE_OPTIONS.find(o => o.value === value)?.label ?? String(value);
}
