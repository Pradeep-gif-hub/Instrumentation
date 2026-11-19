import { buildProceduralInstrument, p } from './partHelper';

const SHARED =
  'Choose the valve from the process variable you have to control. The body is then designed for the control variable: flow, steam temperature, or liquid level. Flanges bolt the valve into the line with a gasket so it can be removed for cleaning, inspection, or modification. On a modulating valve the positioner is the brain: it compares the controller signal with actual stem travel and meters compressed air to the actuator, while the flowmeter sends the measured value back.';

type ValveSeed = {
  id: string;
  name: string;
  short: string;
  kind: string;
  duty: string;
  how: string;
  use: string;
};

const VALVES: ValveSeed[] = [
  { id: 'valve-globe', name: 'Globe Valve', short: 'Globe', kind: 'globe', duty: 'Throttling flow with a plug that lifts off a seat.', how: 'A contoured plug rises inside an S-shaped body and changes the open area.', use: 'Steam and liquid flow control where accurate throttling matters more than pressure recovery.' },
  { id: 'valve-butterfly', name: 'Butterfly Valve', short: 'Butterfly', kind: 'butterfly', duty: 'Large-line flow with a quarter-turn disc.', how: 'A thin disc turns in the pipe. Near closed it throttles; near open it passes high flow with little drop.', use: 'Cooling water, air, and large gas lines.' },
  { id: 'valve-needle', name: 'Needle Valve', short: 'Needle', kind: 'needle', duty: 'Very small, precise flow.', how: 'A long tapered needle advances into a small seat, so a large handwheel turn changes flow only a little.', use: 'Instrument impulse lines, sampling, and fine laboratory flow.' },
  { id: 'valve-flow-regulating', name: 'Flow Regulating Valve', short: 'Flow regulator', kind: 'flow-reg', duty: 'Holding a set flow when upstream pressure changes.', how: 'A spring-loaded plug opens or closes until the measured flow matches the setting.', use: 'Utility headers and burner fuel lines that must stay near one flow.' },
  { id: 'valve-slide', name: 'Slide Valve', short: 'Slide', kind: 'slide', duty: 'Opening or closing a port by sliding a flat plate.', how: 'A flat slide moves across the seat and uncovers the port.', use: 'Older steam engines and some large low-pressure ducts.' },
  { id: 'valve-gate', name: 'Gate Valve', short: 'Gate', kind: 'gate', duty: 'Full-bore isolation, not throttling.', how: 'A wedge gate lifts clear of the bore so pressure drop is almost zero when open.', use: 'Block valves on process lines. Do not leave a gate half open.' },
  { id: 'valve-diaphragm', name: 'Diaphragm Valve', short: 'Diaphragm', kind: 'diaphragm', duty: 'Corrosive, slurry, or sanitary fluids.', how: 'A rubber diaphragm presses onto a weir and keeps the stem out of the process.', use: 'Chemicals, slurries, and lines that must not leak past a packed stem.' },
  { id: 'valve-y-type', name: 'Y-Type Valve', short: 'Y-type', kind: 'y-type', duty: 'Throttling with a straighter flow path than a standard globe.', how: 'The seat sits at about 45 degrees, so the fluid turns less and the pressure drop is lower.', use: 'Steam and boiler blowdown where a globe would waste too much pressure.' },
  { id: 'valve-piston-nrv', name: 'Piston Non-Return Valve', short: 'Piston NRV', kind: 'piston-nrv', duty: 'Stopping reverse flow with a guided piston.', how: 'Forward flow lifts the piston off the seat. Reverse flow and a spring drop it shut.', use: 'Pump discharge and steam lines that must not flow backwards.' },
  { id: 'valve-bpr', name: 'Back Pressure Regulator Valve', short: 'BPR', kind: 'bpr', duty: 'Holding pressure upstream of the valve.', how: 'When upstream pressure rises above the spring setting, the plug opens and relieves flow.', use: 'Reactor vents, pump recycle, and headers that must keep a minimum pressure.' },
  { id: 'valve-ball', name: 'Ball Valve', short: 'Ball', kind: 'ball', duty: 'Tight shutoff with a quarter turn.', how: 'A drilled ball rotates. The hole lines up with the pipe when open and the solid side seals when closed.', use: 'On-off isolation. A V-notch ball can also throttle.' },
  { id: 'valve-piston', name: 'Piston Valve', short: 'Piston', kind: 'piston', duty: 'Balanced shutoff or throttling with a piston instead of a plug.', how: 'A piston slides in a cage. Ports in the cage open as the piston rises, and pressure can balance across the piston.', use: 'Large steam valves where a plain plug would need a huge actuator.' },
  { id: 'valve-flush-bottom', name: 'Flush Bottom Valve', short: 'Flush bottom', kind: 'flush-bottom', duty: 'Draining a tank from the very bottom without a pocket.', how: 'The seat is flush with the vessel nozzle, so the plug opens downward or inward and the tank empties cleanly.', use: 'Reactor and crystalliser drain valves.' },
  { id: 'valve-swing-nrv', name: 'Swing Non-Return Valve', short: 'Swing NRV', kind: 'swing-nrv', duty: 'Low-loss check valve for clean liquids.', how: 'A hinged disc swings open with forward flow and falls shut if flow reverses.', use: 'Pump discharge on clean water and oil lines.' },
  { id: 'valve-pressure-reducing', name: 'Pressure Reducing Valve', short: 'PR valve', kind: 'pr', duty: 'Holding a lower, steady pressure downstream.', how: 'A downstream sense line pushes against a spring. If downstream pressure rises, the plug closes.', use: 'Steam and air letdown to a user header.' },
  { id: 'valve-angle', name: 'Angle Valve', short: 'Angle', kind: 'angle', duty: 'A globe valve whose outlet turns 90 degrees.', how: 'Fluid enters one side and leaves downward, so one elbow is built into the body. Flashing service often uses this outlet.', use: 'Letdown, flashing liquids, and piping that already turns a corner.' },
];

export const CONTROL_VALVE_TYPE_ENTRIES = VALVES.map((valve) =>
  buildProceduralInstrument({
    id: valve.id,
    name: valve.name,
    abbreviation: valve.short,
    categoryLabel: 'Final Control Elements',
    family: 'control-actuator',
    standardRef: 'IEC 60534 · ISA S75',
    proceduralKey: valve.id,
    simulationId: 'valve-stroke',
    overview: `${valve.duty} ${valve.how} ${SHARED}`,
    measurementQuantity: 'Valve opening and the flow or pressure it sets',
    physicalPhenomenon: valve.how,
    inputOutput: { input: 'Handwheel, actuator air, or 4–20 mA through a positioner', output: valve.use },
    workingPrincipleSteps: [
      valve.how,
      'The type is chosen from the process variable. Flow, steam temperature, and liquid level each ask for a different body.',
      'Flanges, with a gasket between them, bolt the valve to the pipe so it can be opened for inspection.',
    ],
    constructionSummary: `${valve.name}: ${valve.how} Body, flanges, and, where it modulates, an actuator with a positioner.`,
    performance: { duty: valve.duty },
    practical: {
      industrialApps: [valve.use],
      labApps: ['Valve cutaway and stroke demonstration'],
      advantages: [valve.duty],
      limitations: ['A valve chosen for isolation should not be left half open to throttle.'],
      failureModes: ['Seat wear, packing leak, and reverse flow if a check valve sticks'],
      calibrationAndMaintenance: 'Confirm the flow arrow, stroke the valve, and check the flange gasket before the line is boxed up.',
    },
    learning: {
      equations: [{ label: 'Why this body', latex: '\\text{Valve type} = f(\\text{process variable}), \\quad \\text{trim} = f(\\text{flow, steam temperature, or level})' }],
      vivaQuestions: [{ q: `When do you install a ${valve.name.toLowerCase()}?`, a: `${valve.duty} ${valve.use}` }],
      relatedInstrumentIds: ['control-valves', 'actuators', 'positioners'],
    },
    parts: [
      p({ id: `${valve.id}-body`, code: '01', name: 'Valve body', material: 'Cast steel, shown in section', function: 'Holds the seat. The cutaway shows the plug, disc, or piston inside.', anchor: [0, 0, 0], explodeOffset: [0, -0.35, 0], isCutawayShell: true }),
      p({ id: `${valve.id}-flange`, code: '02', name: 'Inlet and outlet flanges', material: 'Raised-face flanges and gasket', function: 'Flow enters one flange and leaves the other. The arrows grow as the valve opens.', anchor: [-0.95, 0.15, 0], explodeOffset: [-0.45, 0, 0] }),
      p({ id: `${valve.id}-plug`, code: '03', name: 'Plug, disc, or piston', material: 'Hard trim', function: 'This is the part that opens and closes the seat.', anchor: [0, 0.05, 0.15], explodeOffset: [0.35, 0.2, 0.35] }),
      p({ id: `${valve.id}-actuator`, code: '04', name: 'I/P, diaphragm, and stem', material: 'Diaphragm case, stem, and I/P relay', function: 'The controller signal reaches the I/P. Air moves the diaphragm, the stem follows, and the plug moves with the stem.', anchor: [0.35, 0.85, 0], explodeOffset: [0.3, 0.55, 0] }),
    ],
  }),
);
