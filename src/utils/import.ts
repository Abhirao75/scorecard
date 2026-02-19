import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import type { Feature } from '../types';
import { computeRiceScore, computeIceScore } from './scoring';

export function importFromJSON(json: string): Feature[] {
  const parsed = JSON.parse(json);
  if (!parsed.features || !Array.isArray(parsed.features)) {
    throw new Error('Invalid JSON format: expected { features: [...] }');
  }
  return parsed.features as Feature[];
}

export function importFromCSV(csv: string): Feature[] {
  const result = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });
  return result.data.map(row => {
    const name = row.name?.trim();
    if (!name) throw new Error('Each CSV row must have a "name" column');

    const reach = parseFloat(row.rice_reach);
    const impact = parseFloat(row.rice_impact);
    const confidence = parseFloat(row.rice_confidence);
    const effort = parseFloat(row.rice_effort);
    const hasRice = !isNaN(reach) && !isNaN(impact) && !isNaN(confidence) && !isNaN(effort);

    const iceImpact = parseFloat(row.ice_impact);
    const iceConf = parseFloat(row.ice_confidence);
    const iceEase = parseFloat(row.ice_ease);
    const hasIce = !isNaN(iceImpact) && !isNaN(iceConf) && !isNaN(iceEase);

    return {
      id: uuidv4(),
      name,
      description: row.description?.trim() ?? '',
      notes: row.notes?.trim() ?? '',
      tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: (row.status as Feature['status']) || 'planned',
      createdAt: new Date().toISOString(),
      rice: hasRice
        ? { reach, impact, confidence, effort, score: computeRiceScore({ reach, impact, confidence, effort }) }
        : null,
      ice: hasIce
        ? { impact: iceImpact, confidence: iceConf, ease: iceEase, score: computeIceScore({ impact: iceImpact, confidence: iceConf, ease: iceEase }) }
        : null,
    };
  });
}
