import { v4 as uuidv4 } from 'uuid';
import type { Feature } from '../types';

export const SAMPLE_FEATURES: Feature[] = [
  {
    id: uuidv4(),
    name: 'Global Search',
    description: 'Allow users to search across all content from any page',
    notes: 'Top requested feature in Q1 survey. 80% of power users cite this.',
    tags: ['growth', 'ux'],
    status: 'planned',
    createdAt: new Date().toISOString(),
    rice: { reach: 800, impact: 2, confidence: 0.8, effort: 5, score: 256 },
    ice: { impact: 8, confidence: 8, ease: 6, score: 38.4 },
  },
  {
    id: uuidv4(),
    name: 'Onboarding Flow Redesign',
    description: 'Redesign the first-run experience to reduce time-to-value',
    notes: 'Current drop-off at step 3 is 40%. New design tested at 20% drop-off.',
    tags: ['retention', 'growth'],
    status: 'planned',
    createdAt: new Date().toISOString(),
    rice: { reach: 1200, impact: 2, confidence: 1.0, effort: 8, score: 300 },
    ice: { impact: 9, confidence: 9, ease: 5, score: 40.5 },
  },
  {
    id: uuidv4(),
    name: 'Dark Mode',
    description: 'System-aware dark color scheme across the entire product',
    notes: 'High demand on social channels but low impact on core KPIs.',
    tags: ['ux', 'polish'],
    status: 'planned',
    createdAt: new Date().toISOString(),
    rice: { reach: 500, impact: 0.5, confidence: 0.8, effort: 3, score: 66.7 },
    ice: { impact: 5, confidence: 7, ease: 7, score: 24.5 },
  },
];
