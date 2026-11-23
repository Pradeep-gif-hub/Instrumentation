const KEYS = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5'] as const;

const FOLDERS: Record<(typeof KEYS)[number], string> = {
  sem1: '1u3lJWdiaCFriZZYFhLboj9AJvjeW3_VW',
  sem2: '1jcUDv8cbxm0eVJNYiKm-ECjeD3wguYoJ',
  sem3: '1NncZ6EFDWI-IHyeaAwt07BKbYWO6NbAM',
  sem4: '1Tk-ylymMkhGD3BmkxM5velpougD_7Djq',
  sem5: '1Xmy5D8-JGPFiYUrwJuxd9GY_p5Sk0iZd',
};

export type SemesterFolderKey = (typeof KEYS)[number] | 'additional';

export function semesterFolderId(key: string | undefined): string | null {
  if (key === 'additional') return readId('sem1');
  if (!key || !KEYS.includes(key as (typeof KEYS)[number])) return null;
  return readId(key);
}

function readId(key: (typeof KEYS)[number]): string | null {
  const fromEnv = process.env[`NOTES_FOLDER_${key.toUpperCase()}`]?.trim() ?? '';
  const id = /^[a-zA-Z0-9_-]{10,80}$/.test(fromEnv) ? fromEnv : FOLDERS[key];
  return /^[a-zA-Z0-9_-]{10,80}$/.test(id) ? id : null;
}
