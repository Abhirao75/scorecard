import Papa from 'papaparse';
import type { Feature } from '../types';

export function exportToCSV(features: Feature[]) {
  const rows = features.map(f => ({
    name: f.name,
    description: f.description,
    notes: f.notes,
    tags: f.tags.join(', '),
    status: f.status,
    rice_reach: f.rice?.reach ?? '',
    rice_impact: f.rice?.impact ?? '',
    rice_confidence: f.rice?.confidence ?? '',
    rice_effort: f.rice?.effort ?? '',
    rice_score: f.rice?.score ?? '',
    ice_impact: f.ice?.impact ?? '',
    ice_confidence: f.ice?.confidence ?? '',
    ice_ease: f.ice?.ease ?? '',
    ice_score: f.ice?.score ?? '',
  }));
  const csv = Papa.unparse(rows);
  downloadFile(csv, 'scorecard-export.csv', 'text/csv');
}

export function exportToJSON(features: Feature[]) {
  const json = JSON.stringify({ version: 1, features }, null, 2);
  downloadFile(json, 'scorecard-backup.json', 'application/json');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
