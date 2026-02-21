import Papa from 'papaparse';
import type { GeneratedTicket } from '../types';

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // Delay revocation so the browser can start the download before the URL is released
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function exportTicketsToCSV(tickets: GeneratedTicket[]) {
  const rows = tickets.map((t) => ({
    title: t.title,
    type: t.type,
    userStory: t.userStory,
    description: t.description,
    acceptanceCriteria: t.acceptanceCriteria.join('; '),
    storyPoints: t.storyPoints,
    priority: t.priority,
    tags: t.tags.join(', '),
    parentEpic: t.parentEpic ?? '',
  }));
  const csv = Papa.unparse(rows);
  downloadFile(csv, 'tickets.csv', 'text/csv');
}

export function exportTicketsToJiraJSON(tickets: GeneratedTicket[], projectName = 'Scorecard Export', projectKey = 'SCORE') {
  const workItems = tickets.map((t, i) => {
    const item: Record<string, unknown> = {
      summary: t.title,
      description: `${t.userStory}\n\n${t.description}\n\nAcceptance criteria:\n${t.acceptanceCriteria.map((c) => `- ${c}`).join('\n')}`,
      priority: t.priority,
      labels: t.tags,
      workType: t.type === 'epic' ? 'Epic' : 'Story',
      externalId: String(i + 1),
      customFieldValues: [
        {
          fieldName: 'Story Points',
          fieldType: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
          value: String(t.storyPoints),
        },
      ],
    };
    return item;
  });

  const links: { name: string; sourceId: string; destinationId: string }[] = [];
  tickets.forEach((t, i) => {
    if (t.parentEpic) {
      const epicIdx = tickets.findIndex((x) => x.type === 'epic' && x.title === t.parentEpic);
      if (epicIdx >= 0) {
        links.push({
          name: 'Epic-Story Link',
          sourceId: String(i + 1),
          destinationId: String(epicIdx + 1),
        });
      }
    }
  });

  const jiraJson = {
    projects: [
      {
        name: projectName,
        key: projectKey,
        'work items': workItems,
      },
    ],
    links,
  };
  downloadFile(JSON.stringify(jiraJson, null, 2), 'jira-import.json', 'application/json');
}
