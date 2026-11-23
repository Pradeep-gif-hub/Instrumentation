export const SEMESTER_NOTES = [
  { key: 'sem1', label: 'Semester 1' },
  { key: 'sem2', label: 'Semester 2' },
  { key: 'sem3', label: 'Semester 3' },
  { key: 'sem4', label: 'Semester 4' },
  { key: 'sem5', label: 'Semester 5' },
  { key: 'additional', label: 'Additional semesters' },
] as const;

export type SemesterNoteKey = (typeof SEMESTER_NOTES)[number]['key'];

export function semesterNote(key: string | undefined) {
  return SEMESTER_NOTES.find((note) => note.key === key) ?? null;
}
