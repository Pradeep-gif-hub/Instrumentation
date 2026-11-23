const KEYS = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5'] as const;

export type SemesterFolderKey = (typeof KEYS)[number] | 'additional';

export function semesterFolderId(key: string | undefined): string | null {
  if (key === 'additional') return readId('sem1');
  if (!key || !KEYS.includes(key as (typeof KEYS)[number])) return null;
  return readId(key);
}

function readId(key: string): string | null {
  const id = process.env[`NOTES_FOLDER_${key.toUpperCase()}`]?.trim() ?? '';
  return /^[a-zA-Z0-9_-]{10,80}$/.test(id) ? id : null;
}
