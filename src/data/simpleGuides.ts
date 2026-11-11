import type { CanonicalInstrumentEntry } from '@/types/cad';
import type { InstrumentTopic } from '@/types/engineering';

export interface SimpleGuideContent {
  sentences: string[];
  plantRole: string;
  analogy: string;
  typicalUse: string;
}

/**
 * Hand-written beginner-friendly explanations with plain language first
 * and technical terms placed cleanly in square brackets.
 */
const HANDCRAFTED_SIMPLE_GUIDES: Record<string, SimpleGuideContent> = {
  'rtd-pt100': {
    sentences: [
      'Measures temperature by tracking how electrical resistance increases in a pure platinum wire coil [resistance temperature detector].',
      'As the metal gets hotter, its resistance climbs smoothly and predictably from 100 ohms at 0 °C.',
      'Extra lead wires cancel cable error so readings stay accurate over long plant runs [3-wire / 4-wire compensation].',
    ],
    plantRole: 'Delivers high-accuracy temperature feedback for reactors, boilers, and FDA/pharma skids.',
    analogy: 'Like walking through a crowded hallway when people step faster and jostle more — warming platinum atoms scatter passing electrons, raising electrical resistance.',
    typicalUse: 'Precision temperature monitoring from −200 °C to +600 °C inside process pipes and vessels.',
  },
  'thermocouple-k': {
    sentences: [
      'Measures high temperatures by generating a tiny voltage when two different metal wires are joined at a heated tip [Seebeck effect thermocouple].',
      'Because the junction touches heat directly, it responds quickly and survives extreme furnaces where platinum sensors fail.',
      'A reference sensor at the terminal block corrects for room temperature before sending the signal to the control room [cold-junction compensation].',
    ],
    plantRole: 'Monitors furnaces, gas turbines, exhaust manifolds, and high-temperature cracking heaters.',
    analogy: 'Like heat pushing warm air from a campfire toward a cool tent — heat pushes electrons harder along one metal wire than the other, creating a measurable push [millivolt EMF].',
    typicalUse: 'Fast, rugged high-temperature measurement up to +1260 °C (Type K).',
  },
  'dp-transmitter': {
    sentences: [
      'Measures the difference between two pressures pushed onto opposite sides of an internal sensing diaphragm [differential pressure transmitter].',
      'Even slight pressure bends change internal oil capacitance, which smart electronics turn into a standard 4–20 mA control signal [current loop].',
      'Because one pressure difference reveals flow, tank height, or filter clogging, this is the workhorse sensor of chemical plants.',
    ],
    plantRole: 'Measures flow across orifice plates, closed-tank liquid height, and filter/column pressure drop.',
    analogy: 'Like two teams pushing opposite sides of a swinging door — whichever side pushes harder shifts the door by an exact amount you can measure.',
    typicalUse: 'Clean process flow, tank liquid level, and differential pressure loops across refineries.',
  },
  'orifice-plate': {
    sentences: [
      'Measures pipe flow by forcing fluid through a precision circular hole drilled in a thin steel plate [orifice restriction flowmeter].',
      'Squeezing through the smaller opening speeds the fluid up while dropping its downstream pressure [Bernoulli principle].',
      'A connected differential pressure transmitter reads that pressure drop and calculates exact flow rate [square-root law].',
    ],
    plantRole: 'Primary flow restriction element installed between pipe flanges for steam, water, gas, and hydrocarbons.',
    analogy: 'Like pinching the end of a garden hose — water speeds up right through the narrow opening and pressure drops immediately past it.',
    typicalUse: 'Reliable, zero-moving-parts pipe flow measurement across water, gas, and steam headers.',
  },
  'venturi-meter': {
    sentences: [
      'Measures pipe flow by gently narrowing the pipe cone to speed liquid up and then smoothly widening it back out [Venturi differential pressure meter].',
      'Pressure drops at the narrow throat proportional to flow squared, just like an orifice plate, while losing far less pumping energy [permanent pressure recovery].',
      'Smooth walls let dirty water, slurries, and large air ducts pass cleanly without clogging sharp edges.',
    ],
    plantRole: 'Large-diameter municipal water headers, flue gas ducts, and high-flow pipelines where pump power costs matter.',
    analogy: 'Like a smooth four-lane highway funneling gently into two lanes and widening back — cars speed through cleanly without the harsh bottleneck jam of a sudden barrier.',
    typicalUse: 'Low-pressure-loss flow metering in large clean or moderately dirty pipelines.',
  },
  thermistor: {
    sentences: [
      'Measures temperature using a tiny semiconductor ceramic bead whose electrical resistance changes dramatically for a small heat shift [NTC thermistor].',
      'Usually resistance drops sharply as temperature rises [negative temperature coefficient], giving huge signal sensitivity for battery and medical checks.',
      'Because the resistance curve is steep and curved, software linearizes it cleanly across narrow working bands.',
    ],
    plantRole: 'Fast local temperature protection in motor windings, HVAC ducts, and electronic reference blocks.',
    analogy: 'Like ice melting into free-flowing water — warming the semiconductor frees huge numbers of charge carriers all at once, letting current flow much more easily.',
    typicalUse: 'High-sensitivity narrow-range sensing (−50 °C to +150 °C), CJC blocks, and motor winding trips.',
  },
  'bourdon-tube': {
    sentences: [
      'Measures pressure without needing electricity by using a curved flattened metal tube that tries to straighten out when pressurized [Bourdon C-tube pressure gauge].',
      'As fluid pushes inside, the closed tip moves outward a few millimeters and rotates a small brass gear to swing a needle dial.',
      'Operators walk past the pipe and read tank or pump pressure instantly at a glance.',
    ],
    plantRole: 'Provides explosion-proof, battery-free local pressure indication on pump discharges, manifolds, and air headers.',
    analogy: 'Like a curled paper party blower that unrolls straight whenever you blow air into it — higher pressure uncurls the tube further.',
    typicalUse: 'Direct visual pressure gauges across virtually every industrial header and hydraulic unit.',
  },
  lvdt: {
    sentences: [
      'Measures tiny straight-line movement cleanly without touching friction using three wire coils and a sliding iron rod [linear variable differential transformer].',
      'Moving the center iron rod shifts how much alternating magnetic field links two balanced outer coils [differential mutual inductance].',
      'At the center zero point outputs cancel neatly; sliding left or right gives an exact smooth position voltage.',
    ],
    plantRole: 'Reads high-precision valve stem travel, turbine blade clearances, and CNC machine slide position.',
    analogy: 'Like holding a flashlight evenly between two solar panels — moving the beam a millimeter closer to the left panel makes it brighter while the right dims.',
    typicalUse: 'Frictionless micron-to-centimeter displacement sensing in turbines, hydraulic servos, and material testers.',
  },
  'strain-gauge': {
    sentences: [
      'Measures tiny metal stretching by gluing a hair-thin zig-zag foil pattern directly onto a stressed steel part [bonded metal-foil strain gauge].',
      'When the part stretches under weight or torque, the foil wires get slightly longer and thinner, raising resistance proportionally.',
      'Four gauges wired in a diamond balance circuit measure weight down to grams inside scales and bridges [Wheatstone bridge].',
    ],
    plantRole: 'Core sensing element inside weighbridge load cells, robotic grippers, and structural pipe stress monitors.',
    analogy: 'Like stretching a rubber band painted with conductive ink — pulling it longer narrows its track, making it harder for electricity to squeeze through.',
    typicalUse: 'Converting mechanical tension, bending, or weight into clean millivolt signals.',
  },
  'load-cell': {
    sentences: [
      'Weighs tanks, hoppers, or truck scales by letting heavy weight slightly bend an engineered steel block fitted with internal foil sensors [strain-gauge load cell].',
      'Four temperature-compensated sensors inside detect pure downward weight while cancelling side tilts and room heat changes.',
      'A summing box converts tiny millivolts directly into exact kilograms or tons on the control screen.',
    ],
    plantRole: 'Monitors batch mixing hoppers, silo inventory, and conveyor belt weighers cleanly without touching wet chemicals.',
    analogy: 'Like standing on a springy diving board — heavier loads flex the beam by microscopic amounts that four precision gauges measure reliably.',
    typicalUse: 'Industrial hopper batching, silo inventory weighing, and precision platform balances.',
  },
  rotameter: {
    sentences: [
      'Measures pipe flow visually using a small weighted float suspended inside a vertically tapered glass or metal tube [variable-area flowmeter].',
      'Upward liquid or gas flow lifts the float until the wider annular gap balances gravity weight cleanly.',
      'Operators simply read the flow mark directly opposite the top rim of the spinning float.',
    ],
    plantRole: 'Purge gas meters, analyser sample loops, and cooling water lines where simple visual check is ideal.',
    analogy: 'Like holding a ping-pong ball steady in a rising hair-dryer stream — blowing harder lifts the ball higher where the airflow widens and weakens to match its weight.',
    typicalUse: 'Low-to-medium clean gas and liquid purge/sample flow indication.',
  },
  'electromagnetic-flow-meter': {
    sentences: [
      'Measures conductive liquid flow completely unobstructively by passing a magnetic field across an insulated pipe liner [Faraday magnetic flowmeter].',
      'Conductive water or acid slicing across the magnetic field induces a tiny sideways voltage directly proportional to average velocity.',
      'Two flush wall electrodes read that voltage with zero pipe blockage and zero moving parts.',
    ],
    plantRole: 'Meters corrosive acids, municipal wastewater, slurries, pulp, and conductive food liquids cleanly.',
    analogy: 'Like moving a copper wire through magnets in a generator — conductive liquid is the moving wire itself, creating voltage strictly from speed.',
    typicalUse: 'Slurry, chemical, wastewater, and clean conductive liquid flow measurement.',
  },
  radar: {
    sentences: [
      'Measures tank height from the roof without touching the product by firing high-frequency radio pulses straight down [80 GHz FMCW radar level transmitter].',
      'Waves bounce cleanly off the liquid or powder surface back to the antenna in billionths of a second [time-of-flight ranging].',
      'Because radio waves ignore heavy dust, steam, and pressure shifts, measurements stay dead accurate safely above harsh liquids.',
    ],
    plantRole: 'Custody-transfer storage tanks, hot reactors, corrosive acid silos, and tall grain bunkers.',
    analogy: 'Like shouting toward a distant canyon wall and timing the echo — faster echo return means the surface has climbed closer.',
    typicalUse: 'Non-contact continuous level measurement under vacuum, vapor, or extreme vessel temperatures.',
  },
  ph: {
    sentences: [
      'Measures acidity or alkalinity using a delicate hydrated glass bulb whose surface trades hydrogen ions with the water sample [potentiometric Nernst electrode].',
      'At neutral pH 7 the sensor produces zero millivolts; each pH step shifts voltage by roughly 59 mV.',
      'Plant controllers watch this millivolt signal continuously to dose acid or caustic smoothly into effluent streams.',
    ],
    plantRole: 'Controls wastewater neutralization basins, fermentation bioreactors, and boiler feedwater treatment.',
    analogy: 'Like a delicate battery whose voltage leans negative in alkaline soap and positive in sour lemon juice purely from hydrogen ion concentration.',
    typicalUse: 'Continuous aqueous acidity/alkalinity monitoring (0–14 pH) with two-buffer calibration.',
  },
  'wheatstone-bridge': {
    sentences: [
      'Detects tiny fractional resistance changes by wiring four resistors into a diamond and watching the voltage across the center [Wheatstone bridge network].',
      'When opposite resistance ratios balance equally, zero current flows through the center meter [null balance condition].',
      'Even a tiny fraction-of-an-ohm change in an RTD or strain gauge tilts the center cleanly for precision lab measurement.',
    ],
    plantRole: 'Backbone signal-conditioning front-end for strain gauges, load cells, RTDs, and precision bridge calibrators.',
    analogy: 'Like an equal-arm balance scale — placing a single grain of sand on one side makes the center pointer swing noticeably even when both weights are heavy.',
    typicalUse: 'Converting minute milliohm/microstrain resistance shifts into clean measurable millivolts.',
  },
  'pmmc-instrument': {
    sentences: [
      'Measures steady direct current by suspending a lightweight copper coil between strong permanent magnet poles [permanent-magnet moving-coil d’Arsonval meter].',
      'Sending DC current pushes the coil forward evenly against fine hairsprings, moving a needle across an equally spaced scale [linear scale].',
      'Because the magnet pulls smoothly one way with average current, it accurately reads pure DC without responding to fast AC reversals.',
    ],
    plantRole: 'Panel DC ammeters, voltmeters, and sensitive galvanometer null detectors in bench testing.',
    analogy: 'Like a tiny electric motor held back by a spring — double the battery current pushes twice as hard, swinging the pointer twice as far.',
    typicalUse: 'Precision analog DC current and voltage metering with uniform linear graduations.',
  },
  'cro-crt': {
    sentences: [
      'Draws live fast electrical waves on a glowing screen by steering a focused electron beam left-right and up-down [cathode ray oscilloscope].',
      'Horizontal plates sweep the dot steadily across time while input voltage pulls the beam vertically without mechanical needle lag.',
      'Engineers inspect exact wave shapes, distortion, phase shifts, and microseconds-wide pulses directly visually.',
    ],
    plantRole: 'Diagnoses encoder pulses, ultrasonic echoes, noise ripple, and phase shifts in calibration labs.',
    analogy: 'Like waving a laser pointer across a dark wall while shaking your hand vertically in time with music — you trace the exact shape of the vibration live.',
    typicalUse: 'Viewing high-frequency voltage waveforms, timing, and Lissajous phase measurements.',
  },
  'control-valves': {
    sentences: [
      'Throttles process fluid flow continuously like a heavy motorized industrial faucet positioned by controller air pressure [globe control valve].',
      'Moving the shaped internal metal plug up and down opens or squeezes a precision seat ring to regulate flow rate.',
      'Combined with an air diaphragm actuator, it can snap completely closed or open automatically if plant power fails [fail-safe action].',
    ],
    plantRole: 'Final physical muscle of process control loops, regulating steam heating, reactor cooling, and tank outflow.',
    analogy: 'Like turning the hot-water shower handle fraction by fraction while watching the water temperature until it holds steady right on target.',
    typicalUse: 'Throttling liquid, steam, and gas flow continuously under 4–20 mA / pneumatic PID control.',
  },
  'deadweight-tester': {
    sentences: [
      'Calibrates pressure gauges against basic physics by floating precision calibrated steel weights atop an oiled vertical piston [primary deadweight pressure standard].',
      'Pumping oil until the spinning piston floats lifts an exact force divided by exact piston area [P = F / A], producing dead-accurate test pressure.',
      'Every plant workshop relies on it to verify pressure transmitters before placing them in critical refinery loops.',
    ],
    plantRole: 'Primary calibration bench standard certifying dial gauges and smart pressure transmitters against national standards.',
    analogy: 'Like balancing known grocery weights on one piston to push fluid into an exact pressure chamber until it lifts cleanly.',
    typicalUse: 'Traceable workshop calibration of industrial pressure gauges and DP transmitters.',
  },
  '4-20-ma': {
    sentences: [
      'Carries sensor measurements across kilometers of factory wire as a constant electric current between 4 and 20 milliamperes [analog current loop standard].',
      'Using current instead of voltage keeps readings immune to long wire resistance drops and noisy electric motors nearby.',
      'Starting zero at 4 mA instead of 0 mA lets the control room immediately spot a broken wire whenever current drops to zero [live zero fault detection].',
    ],
    plantRole: 'Universal wiring language linking tens of thousands of field transmitters cleanly to plant DCS and PLC cabinets.',
    analogy: 'Like counting how many liters per minute arrive at the end of a full hose — pressure can drop down a long hose, but every liter put in still comes out the other end.',
    typicalUse: 'Long-distance, noise-immune field instrumentation signaling across plants (0–100% span = 4–20 mA).',
  },
  hart: {
    sentences: [
      'Piggybacks two-way digital computer messages onto existing 4–20 mA sensor wires using tiny high-frequency audio tones [HART digital FSK protocol].',
      'Because rapid audio ripples average cleanly to zero, older analog control loops read the 4–20 mA signal uninterrupted while laptops read diagnostics digitally.',
      'Technicians configure zero, span, damping, and sensor health right from the control rack without walking up tanks.',
    ],
    plantRole: 'Upgrades legacy analog 4–20 mA loops with smart asset diagnostics, valve signature logs, and remote re-ranging.',
    analogy: 'Like sending invisible radio station music down the exact same power wire without altering the steady electricity lighting your bulb.',
    typicalUse: 'Smart field transmitter configuration, asset management, and multi-variable loop telemetry.',
  },
  'intel-8085': {
    sentences: [
      'An early 8-bit computer chip that fetches one numbered step at a time from memory, calculates an answer, and moves to the next step [8085 microprocessor].',
      'It shares eight wire pins briefly for both memory addresses and data so all 40 pins fit neatly onto one chip [multiplexed AD0–AD7 bus].',
      'Learning its registers, stack, and hardware interrupts teaches you cleanly how every real-world controller actually steps through code.',
    ],
    plantRole: 'Teaches foundational assembly timing, memory/port decoding, and interrupt handling used in digital plant controllers.',
    analogy: 'Like a focused chef following a numbered recipe card step by step while keeping today’s ingredients in small labelled bowls on the counter.',
    typicalUse: 'Core 8-bit processor timing, 8255/8253 peripheral interfacing, and interrupt priority labs.',
  },
  'intel-8086': {
    sentences: [
      'A 16-bit processor split into two workers inside one chip: one pre-fetches upcoming instructions while the other executes the current math [BIU + EU pipeline].',
      'By pairing a shifted 16-bit segment register with a 16-bit offset, it reaches one full megabyte of external memory cleanly [20-bit physical address].',
      'Its segmented register design became the foundation of the x86 family inside industrial PCs and SCADA servers.',
    ],
    plantRole: 'Bridges simple 8-bit chips to modern pipelined industrial computers and real-time plant servers.',
    analogy: 'Like a two-person checkout lane where one helper unpacks items ahead onto a conveyor belt so the cashier never waits idle.',
    typicalUse: '16-bit pipelining, memory segmentation, and minimum/maximum multiprocessor bus labs.',
  },
  'intel-8051': {
    sentences: [
      'Packs a complete tiny computer—processor, program memory, data RAM, timers, serial UART, and 32 I/O pins—inside a single chip [8051 microcontroller].',
      'Separate paths for code and data prevent fetching instructions from slowing down fast sensor reads [Harvard memory architecture].',
      'Single-bit instructions let you turn individual indicator lights, LCD pins, or relays on and off directly.',
    ],
    plantRole: 'Drives smart field transmitters, local LCD panel displays, keypad stations, and benchtop timers.',
    analogy: 'Like a Swiss Army knife compared with a loose toolbox—memory, timers, and I/O ports are all folded into one self-contained chip.',
    typicalUse: 'Dedicated appliance control, LCD / 7-segment interfacing, UART links, and ADC/DAC sensor boards.',
  },
  'arduino-uno': {
    sentences: [
      'A beginner-friendly microcontroller circuit board with a built-in USB port so you can upload C++ programs in seconds [Arduino UNO R3].',
      'Six analog pins read voltages directly into numbers from 0 to 1023, while digital pins switch relays and motors cleanly [10-bit ADC + PWM].',
      'Because no heavy operating system stands in the way, timing loops run steadily down to microseconds.',
    ],
    plantRole: 'Rapidly prototypes sensor test jigs, motor drivers, and laboratory calibration rigs.',
    analogy: 'Like an electronic LEGO hub where plugging USB lets you test a sensor idea in minutes without soldering complex clock circuits.',
    typicalUse: 'Quick bench sensor testing, stepper/servo control, and student automation projects.',
  },
  'raspberry-pi': {
    sentences: [
      'A credit-card-sized computer that runs a full Linux desktop, Wi-Fi networking, Python, and databases alongside hardware pins [Raspberry Pi SBC].',
      'Unlike an Arduino, it lacks built-in analog inputs and runs GPIO pins strictly at 3.3 volts, so analog sensors connect through an external ADC chip.',
      'Engineers use it to gather field measurements into dashboards, cameras, and cloud logs.',
    ],
    plantRole: 'Acts as an edge gateway logging factory sensor data to local screens and network dashboards.',
    analogy: 'If an Arduino is a reflex muscle reacting instantly to pain, a Raspberry Pi is a brain analyzing pictures, charts, and web traffic.',
    typicalUse: 'IIoT data loggers, camera quality checks, and plant browser dashboards.',
  },
  'lcd-display-16x2': {
    sentences: [
      'Displays two crisp rows of sixteen letters and numbers using tiny liquid-crystal grids lit cleanly from behind [16×2 alphanumeric LCD].',
      'Sending a command setups cursor position, while toggling the Enable pin latches each ASCII letter right onto the screen [HD44780 interface].',
      'Running in 4-bit mode uses just six microcontroller wires to show live plant values.',
    ],
    plantRole: 'Shows clear local temperature, pressure, and alarm text directly on instruments and controller fronts.',
    analogy: 'Like tiny electronic venetian blinds rotating per letter to either block or pass backlight cleanly through.',
    typicalUse: 'Local field indicator panels and embedded project readouts.',
  },
  'seven-segment-display': {
    sentences: [
      'Forms glowing digits 0 through 9 using seven bar LEDs arranged in a figure-eight [7-segment LED display].',
      'Lighting different segment pins—through protective current resistors—draws crisp bright numbers visible from across a dark control room.',
      'Switching between digits over 100 times per second lets one port drive multiple digits steadily [multiplexing].',
    ],
    plantRole: 'Provides high-contrast digital panel readouts for counters, weighing scales, and boiler temperatures.',
    analogy: 'Like turning on specific neon tubes on a digital scoreboard to spell out any number clearly from afar.',
    typicalUse: 'Weighbridge readouts, RPM counters, and digital temperature controllers.',
  },
  'monochromator-optics': {
    sentences: [
      'Splits mixed white light into pure single colors using curved mirrors and a finely grooved reflective grating [diffraction grating monochromator].',
      'Tilting the grating sweeps exact wavelengths one by one through a narrow exit slit to test samples cleanly.',
      'Using mirrors instead of glass lenses preserves ultraviolet light accurately across wide color scans.',
    ],
    plantRole: 'Forms the optical heart inside UV-Visible and emission spectrophotometers for chemical purity checks.',
    analogy: 'Like holding a shiny compact disc under sunlight and tilting it slowly so only pure emerald green shines through a keyhole.',
    typicalUse: 'Optical wavelength scanning in chemical composition and laser alignment benches.',
  },
  'dsp-processor-board': {
    sentences: [
      'A specialized processor built to multiply and add streams of sensor numbers in a single clock tick [Digital Signal Processor].',
      'Separate memory paths let it grab both a fresh sensor sample and a filter weight at the exact same instant [Harvard MAC core].',
      'Hardware wrap-around counters run digital filters and frequency transforms cleanly with zero missed deadlines.',
    ],
    plantRole: 'Powers real-time vibration FFT analyzers, Coriolis flowmeters, and noisy sensor filtering inside smart transmitters.',
    analogy: 'Like an assembly line built strictly to stamp bottle caps ten times faster than a general handyman doing one chore after another.',
    typicalUse: 'Real-time digital filtering, spectral vibration diagnostics, and smart sensor electronics.',
  },
  'vibrating-fork-level': {
    sentences: [
      'A twin-prong metal tuning fork buzzes silently at a steady pitch inside a tank wall using a tiny vibrating crystal [piezoelectric fork].',
      'As soon as rising liquid touches the prongs, its weight slows the buzz noticeably—just like dipping a ringing fork into water.',
      'Electronics spot that sudden pitch drop instantly and flip a safety switch so pumps stop or overfill alarms sound.',
    ],
    plantRole: 'Acts as an independent high-high safety backup preventing dangerous tank spills and pump dry-runs.',
    analogy: 'Like tapping a metal dinner fork and dipping it into water: the bright ringing tone drops dead in an instant.',
    typicalUse: 'Liquid high/low alarm switches on chemical tanks, storage silos, and pump suction lines.',
  },
  'mass-flow-controller': {
    sentences: [
      'An all-in-one miniature gas regulator that weighs passing gas molecules and adjusts its own valve simultaneously [MFC].',
      'A tiny heated pipe beside the main path senses how much cooling the gas carries away to find true mass flow.',
      'Its built-in valve pinches open or shut in milliseconds to keep exact gas delivery even if cylinder supply pressure drops.',
    ],
    plantRole: 'Meters ultra-precise specialty gases into semiconductor reactors, biopharma fermenters, and gas analyzers.',
    analogy: 'Like a cruise-control driver watching wind resistance constantly and adjusting the throttle to hold one exact speed.',
    typicalUse: 'Precision sccm/slpm gas dosing in labs, cleanrooms, fermenters, and fuel-cell rigs.',
  },
  'variable-frequency-drive': {
    sentences: [
      'An electronic speed controller that turns fixed grid AC power into adjustable voltage and frequency for big motors [PWM VFD].',
      'Slowing a pump motor slightly with this drive saves massive electricity compared to fighting full motor speed with a pinched valve.',
      'Fast power switches inside sculpt smooth waves so heavy blowers start gently without tripping breakers.',
    ],
    plantRole: 'Replaces energy-wasting throttling valves on large centrifugal pumps, cooling fans, and conveyors.',
    analogy: 'Like pedaling your bicycle gently at the exact speed needed instead of pedaling flat-out with the brakes dragged half shut.',
    typicalUse: 'Energy-saving pump/fan speed modulation and soft-starting across water, HVAC, and process plants.',
  },
  'dry-well-calibrator': {
    sentences: [
      'A portable precision heater-chiller block with snug drilled holes used to test factory temperature probes cleanly [dry-block].',
      'You slide a plant RTD beside a master reference probe into the heated brass sleeve and command exact reference temperatures.',
      'Once both probes settle together at a steady number, any error in the plant probe stands out immediately without hot oil baths.',
    ],
    plantRole: 'Let maintenance teams certify field RTDs, thermocouples, and trip switches directly beside process racks.',
    analogy: 'Like a precision digital waffle iron holding two thermometers side-by-side at one exact oven temperature.',
    typicalUse: 'Annual ISO calibration and turnaround loop checks for RTDs, thermocouples, and thermal switches.',
  },
  'process-loop-calibrator': {
    sentences: [
      'The instrument technician’s Swiss-army pocket meter built specifically for 4–20 mA factory signal loops [loop calibrator].',
      'It can impersonate a missing transmitter by injecting exact mA into a control panel, or supply 24 V power to test a sensor alone.',
      'Flipping one internal switch adds the 250-ohm resistor required so digital HART communicators can talk on the bench.',
    ],
    plantRole: 'Pinpoints in seconds whether a bad plant reading comes from the field sensor, the cable, or the control-room PLC card.',
    analogy: 'Like an electrician’s signal tester that can either pretend to be the sensor or power the sensor on a kitchen table.',
    typicalUse: 'Control valve stroking, 5-point transmitter loop checks, and commissioning PLC/DCS analog inputs.',
  },
};

function cleanBracketTerm(entry: CanonicalInstrumentEntry): string {
  if (entry.abbreviation && entry.abbreviation.length > 2) {
    return `${entry.name.toLowerCase()} [${entry.abbreviation}]`;
  }
  return `[${entry.name.toLowerCase()}]`;
}

function stripStandardTokens(text: string): string {
  return text
    .replace(/\(\s*(?:IEC|ISA|ASME|ISO|DIN|ANSI|ASTM)[^)]*\)/gi, '')
    .replace(/\b(IEC|ISA|ASME|ISO|DIN|ANSI|ASTM)[-\s/]*[A-Z0-9.]*\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .trim();
}

function lcFirst(text: string): string {
  if (!text) return '';
  // Preserve leading acronyms (e.g., RTD, LVDT, AC, DC, RF, pH)
  if (/^(?:[A-Z]{2,}|pH\b|mV\b)/.test(text)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function getPlainDisplayName(entry: CanonicalInstrumentEntry): string {
  return stripStandardTokens(entry.name);
}

export function getPlainSummaryLine(entry: CanonicalInstrumentEntry): string {
  const custom = HANDCRAFTED_SIMPLE_GUIDES[entry.id];
  if (custom) {
    return stripStandardTokens(custom.sentences[0].replace(/\s*\[[^\]]+\]/g, ''));
  }
  return stripStandardTokens(
    `Measures ${lcFirst(entry.measurementQuantity)} using ${lcFirst(entry.physicalPhenomenon)}.`,
  );
}

export function getSimpleGuide(
  entry: CanonicalInstrumentEntry,
  topic?: InstrumentTopic,
): SimpleGuideContent {
  const custom = HANDCRAFTED_SIMPLE_GUIDES[entry.id];
  if (custom) return custom;

  const firstApp = stripStandardTokens(
    entry.practical.industrialApps[0] ?? topic?.applications[0]?.service ?? 'industrial process monitoring',
  );
  const bracketName = cleanBracketTerm(entry);
  const inputLabel = stripStandardTokens(lcFirst(entry.inputOutput.input));
  const outputLabel = stripStandardTokens(lcFirst(entry.inputOutput.output));

  const sentences = [
    stripStandardTokens(`Measures ${lcFirst(entry.measurementQuantity)} by sensing ${lcFirst(entry.physicalPhenomenon)} ${bracketName}.`),
    `It takes ${inputLabel} from the process and converts it cleanly into ${outputLabel}.`,
    stripStandardTokens(entry.workingPrincipleSteps[0] ?? 'Built to give repeatable readings under factory and laboratory operating conditions.'),
  ];

  const plantRole = stripStandardTokens(
    topic?.purposeAndPrinciple.purpose ??
      `Used across ${firstApp} so operators and controllers get reliable measurements.`,
  );

  const analogy =
    entry.classification === 'concept-domain'
      ? `Think of this as the common signal rulebook every field instrument follows so readings mean the exact same thing across different plant devices.`
      : `Like translating an invisible physical change (${inputLabel}) into a clear needle movement or digital readout (${outputLabel}) you can act on immediately.`;

  const typicalUse =
    entry.performance.range
      ? `${entry.measurementQuantity} across ${firstApp} (range: ${entry.performance.range}).`
      : `${entry.measurementQuantity} for ${firstApp}.`;

  return {
    sentences: sentences.slice(0, 3),
    plantRole,
    analogy,
    typicalUse,
  };
}

