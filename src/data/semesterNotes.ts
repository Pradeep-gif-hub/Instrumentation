export const SEMESTER_NOTES = [
  { key: 'sem1', label: 'Semester 1', folderId: '1p49STgJqpYccV_EAPbOXggUUQut-Omdj' },
  { key: 'sem2', label: 'Semester 2', folderId: '1qKgMco_DMXC6CNVOgyZC95FfZtWE074b' },
  { key: 'sem3', label: 'Semester 3', folderId: '14sL1xKHOQUE1i2ULdxyNv29PgsN2ZJIZ' },
  { key: 'sem4', label: 'Semester 4', folderId: '1Ek8sYBgBtd_RQM2V-9lPstkOca5vQSNV' },
  { key: 'sem5', label: 'Semester 5', folderId: '1uP6ZAVXDa25fUbJ7sSw7qcr3EO-CM2RZ' },
  { key: 'additional', label: 'Additional semesters', folderId: '1p49STgJqpYccV_EAPbOXggUUQut-Omdj' },
] as const;

export type SemesterNoteKey = (typeof SEMESTER_NOTES)[number]['key'];

export function semesterNote(key: string | undefined) {
  return SEMESTER_NOTES.find((note) => note.key === key) ?? null;
}
