import type { CurriculumSubjectDetail } from '../types/curriculum';
import type { AcademicSubject } from '../types/engineering';
import { NITJ_CURRICULUM_SUBJECTS } from './curriculum/index';

export const ROADMAP_DISCLAIMER =
  'Structured around the official syllabus of Dr. B. R. Ambedkar NIT Jalandhar (B.Tech. Instrumentation & Control Engineering — July 2023 Admissions Onwards, Revised June 2025) for Semesters III–V Core. Semesters I–II & Drive companion notes, Synchronous Machine extension, and ICMI0303 Testing & Calibration (Sem V Minor Elective-I) are transparently labeled separate from compulsory ICE core.';

function toAcademicCategory(
  category: CurriculumSubjectDetail['category'],
): AcademicSubject['category'] {
  if (category === 'Supplementary') return 'Core ICE';
  return category;
}

function curriculumToAcademicSubject(subj: CurriculumSubjectDetail): AcademicSubject {
  const numericSemester = subj.semester === 'additional' ? 5 : subj.semester;
  const codeDisplay =
    subj.code === 'VERIFY-CODE' || subj.code.startsWith('SEM')
      ? subj.code
      : subj.code;

  return {
    id: subj.id,
    semester: numericSemester,
    code: codeDisplay,
    name:
      subj.syllabusStatus === 'supplementary-elective'
        ? `${subj.name} [Supplementary Elective]`
        : subj.name,
    credits: subj.credits,
    category: toAcademicCategory(subj.category),
    overview: `${subj.syllabusBadge} — ${subj.overview}`,
    units: subj.units.map((u) => ({
      unitNumber: u.unitNumber,
      title: u.title,
      hours: u.hours,
      topics: u.topics.map((t) => ({
        name: t.title,
        subtopics: [
          t.summary,
          ...(t.realWorldApplications.examples.slice(0, 2).map((e) => `Industrial: ${e}`)),
        ],
        linkedRoute: t.linkedPlatformRoute,
      })),
    })),
  };
}

const SEM6_CAPSTONE_SUBJECT: AcademicSubject = {
  id: 'nitj-sem6-scada-placement',
  semester: 6,
  code: 'ICE-SEM6-SYNTH',
  name: 'DCS / PLC / SCADA Integration, P&ID Loop Design & Placement Readiness',
  credits: 4,
  category: 'Control & Automation',
  overview:
    'Capstone synthesis hub preparing pre-final year students for industrial automation engineering roles: ISA-5.1 P&ID tagging, ladder logic, Modbus/PROFINET/HART fieldbus, and EPC instrumentation interviews (verify Sem VI departmental elective codes per your NITJ batch).',
  units: [
    {
      unitNumber: 1,
      title: 'PLC, DCS, SCADA & Fieldbus Communications',
      hours: 10,
      topics: [
        {
          name: 'PLC Scan Cycle, IEC 61131-3 Ladder & Fail-Safe Interlocks',
          subtopics: ['Input Scan → Program → Output Scan', 'Seal-in latching, TON/TOF timers & counters', 'SIL ESD separation vs BPCS'],
          linkedRoute: '/automation',
        },
        {
          name: 'Industrial Protocols: 4–20 mA HART, Modbus RTU/TCP, PROFIBUS & OPC UA',
          subtopics: ['HART 1200/2200 Hz FSK Bell 202', 'RS-485 2-wire differential termination', 'Foundation Fieldbus H1 vs HSE'],
          linkedRoute: '/automation',
        },
      ],
    },
    {
      unitNumber: 2,
      title: 'EPC Instrument Sizing, Loop Sheets & Placement Assessments',
      hours: 8,
      topics: [
        {
          name: 'Control Valve Cv, Orifice β-Ratio & Transmitter Loop Drop Sizing',
          subtopics: ['24 VDC loop resistance margin', 'Valve Equal-% vs Linear installed gain', 'Cavitation / flashing check'],
          linkedRoute: '/instrumentation/final-control/control-valves',
        },
        {
          name: 'Core Company Interview Preparation (PSUs, EPCs & Product OEMs)',
          subtopics: ['Yokogawa, Honeywell, Emerson, ONGC/IOCL, Rockwell scenarios', 'Troubleshooting noisy 4–20 mA loops'],
          linkedRoute: '/interview',
        },
      ],
    },
  ],
};

export const DEFAULT_ACADEMIC_SUBJECTS: AcademicSubject[] = [
  ...NITJ_CURRICULUM_SUBJECTS.map(curriculumToAcademicSubject),
  SEM6_CAPSTONE_SUBJECT,
];
