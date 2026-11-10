import type { InstrumentSimulationConfig, SimulationPoint } from '@/types/cad';

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}

function normOf(val: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp01((val - min) / (max - min));
}

function sweepCurve(min: number, max: number, fn: (x: number) => number, steps = 25): SimulationPoint[] {
  const pts: SimulationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = min + ((max - min) * i) / steps;
    const y = fn(x);
    pts.push({
      x: Number(x.toFixed(3)),
      y: Number((Number.isFinite(y) ? y : 0).toFixed(4)),
    });
  }
  return pts;
}

function rtdPt100Resistance(t: number): number {
  const A = 3.9083e-3;
  const B = -5.775e-7;
  const C = -4.183e-12;
  if (t >= 0) return 100 * (1 + A * t + B * t * t);
  return 100 * (1 + A * t + B * t * t + C * (t - 100) * t * t * t);
}

export const INSTRUMENT_SIMULATIONS: Record<string, InstrumentSimulationConfig> = {
  // ======================= A. TEMPERATURE =======================
  'rtd-pt100': {
    id: 'rtd-pt100',
    title: 'IEC 60751 Callendar-Van Dusen Resistance Simulation',
    governingFormulaLatex: 'R(t) = R_0\\,(1 + At + Bt^2), \\quad R_0 = 100.00\\,\\Omega',
    assumptions: 'Pure platinum Pt100 (α = 0.00385 °C⁻¹), 4-wire Kelvin cancellation (zero lead offset).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Process Temperature', unit: '°C', min: -100, max: 600, step: 5, defaultValue: 100 },
    evaluate: (t) => {
      const r = rtdPt100Resistance(t);
      return {
        outputValue: `${r.toFixed(2)} Ω`,
        outputNumeric: Number(r.toFixed(2)),
        outputUnit: 'Ω',
        secondaryOutput: `Sensitivity ≈ 0.385 Ω/°C · ΔR = ${(r - 100).toFixed(2)} Ω`,
        normalizedPrimary: normOf(t, -100, 600),
        observation: `At ${t} °C, lattice phonon scattering sets Pt100 resistance to ${r.toFixed(2)} Ω.`,
        curve: sweepCurve(-100, 600, rtdPt100Resistance),
        idealCurve: sweepCurve(-100, 600, (x) => 100 * (1 + 0.00385 * x)),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Resistance',
        yUnit: 'Ω',
      };
    },
  },
  'thermocouple-k': {
    id: 'thermocouple-k',
    title: 'Type-K Seebeck Thermocouple EMF & CJC Simulation',
    governingFormulaLatex: 'E_{\\text{meas}} = E(T_{\\text{hot}}, 0^\\circ\\text{C}) - E(T_{\\text{cj}}, 0^\\circ\\text{C})',
    assumptions: 'Type K (~41 μV/°C linearised over 0–1000 °C) with adjustable cold-junction reference.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Hot Junction Temp', unit: '°C', min: 0, max: 1100, step: 10, defaultValue: 450 },
    secondaryParam: { key: 'secondary', label: 'Cold Junction Temp', unit: '°C', min: 0, max: 60, step: 1, defaultValue: 25 },
    evaluate: (th, tcj) => {
      const emfHot = 0.0412 * th - 1.8e-6 * th * th;
      const emfCj = 0.0405 * tcj;
      const net = emfHot - emfCj;
      return {
        outputValue: `${net.toFixed(2)} mV`,
        outputNumeric: Number(net.toFixed(2)),
        outputUnit: 'mV',
        secondaryOutput: `0 °C Reference EMF: ${emfHot.toFixed(2)} mV (CJC offset: ${emfCj.toFixed(2)} mV)`,
        normalizedPrimary: normOf(th, 0, 1100),
        normalizedSecondary: normOf(tcj, 0, 60),
        observation: `A ${(th - tcj).toFixed(0)} °C thermal gradient across Chromel-Alumel produces ${net.toFixed(2)} mV net terminal EMF.`,
        curve: sweepCurve(0, 1100, (t) => 0.0412 * t - 1.8e-6 * t * t - emfCj),
        xLabel: 'Hot Junction',
        xUnit: '°C',
        yLabel: 'Terminal EMF',
        yUnit: 'mV',
      };
    },
  },
  thermistor: {
    id: 'thermistor',
    title: 'NTC 10 kΩ Thermistor Exponential Beta Model',
    governingFormulaLatex: 'R(T) = R_{25}\\exp\\!\\left[\\beta\\left(\\frac{1}{T} - \\frac{1}{298.15}\\right)\\right], \\quad \\beta = 3950\\,\\text{K}',
    assumptions: 'Standard 10 kΩ @ 25 °C sintered NTC bead; negligible I²R self-heating.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Temperature', unit: '°C', min: -20, max: 150, step: 2, defaultValue: 35 },
    evaluate: (t) => {
      const calcR = (tc: number) => 10 * Math.exp(3950 * (1 / (tc + 273.15) - 1 / 298.15));
      const rK = calcR(t);
      return {
        outputValue: `${rK >= 1 ? `${rK.toFixed(2)} kΩ` : `${(rK * 1000).toFixed(0)} Ω`}`,
        outputNumeric: Number(rK.toFixed(3)),
        outputUnit: 'kΩ',
        secondaryOutput: `Sensitivity ≈ −4.4 %/°C at 25 °C (strongly nonlinear NTC)`,
        normalizedPrimary: normOf(t, -20, 150),
        observation: `Higher thermal energy floods the oxide conduction band, collapsing resistance to ${rK.toFixed(2)} kΩ.`,
        curve: sweepCurve(-20, 150, calcR),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Resistance',
        yUnit: 'kΩ',
      };
    },
  },
  bimetallic: {
    id: 'bimetallic',
    title: 'Helical Bimetallic Strip Pointer Deflection',
    governingFormulaLatex: '\\theta = K_{\\text{bimetal}}(\\alpha_1 - \\alpha_2)\\,\\Delta T',
    assumptions: 'Brass / Invar laminated helix (−50 to +250 °C span over 270° angular sweep).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Process Temp', unit: '°C', min: -50, max: 250, step: 5, defaultValue: 85 },
    evaluate: (t) => {
      const deg = ((t + 50) / 300) * 270;
      return {
        outputValue: `${deg.toFixed(1)}°`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg',
        secondaryOutput: `Gain = 0.90° / °C across mechanical dial scale`,
        normalizedPrimary: normOf(t, -50, 250),
        observation: `Differential thermal expansion winds the brass/Invar helix, sweeping pointer to ${deg.toFixed(1)}°.`,
        curve: sweepCurve(-50, 250, (x) => ((x + 50) / 300) * 270),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Dial Sweep',
        yUnit: '°',
      };
    },
  },
  'filled-system': {
    id: 'filled-system',
    title: 'Class II Vapor-Pressure Filled Thermometer',
    governingFormulaLatex: 'P(T) \\approx P_0 \\exp\\!\\left[-\\frac{\\Delta H_v}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]',
    assumptions: 'Educational Clausius-Clapeyron vapor pressure bulb response driving 0–300 °C dial.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Bulb Temp', unit: '°C', min: 0, max: 300, step: 5, defaultValue: 140 },
    evaluate: (t) => {
      const calcP = (tc: number) => 1.0 + 18.0 * Math.pow(tc / 300, 1.55);
      const bar = calcP(t);
      return {
        outputValue: `${bar.toFixed(2)} bar`,
        outputNumeric: Number(bar.toFixed(2)),
        outputUnit: 'bar',
        secondaryOutput: `Note widened graduations at upper temperature end`,
        normalizedPrimary: normOf(t, 0, 300),
        observation: `Saturated fill fluid pressurizes the capillary & spiral Bourdon tube to ${bar.toFixed(2)} bar.`,
        curve: sweepCurve(0, 300, calcP),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Capillary Pressure',
        yUnit: 'bar',
      };
    },
  },
  'optical-pyrometer': {
    id: 'optical-pyrometer',
    title: 'Disappearing-Filament Wien Radiance Balance',
    governingFormulaLatex: 'L(\\lambda, T) = \\frac{C_1}{\\lambda^5}\\exp\\!\\left(-\\frac{C_2}{\\lambda T}\\right), \\quad \\lambda = 0.65\\,\\mu\\text{m}',
    assumptions: 'Monochromatic red filter (650 nm), blackbody target (ε = 1.0) matched by filament current.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Brightness Temp', unit: '°C', min: 700, max: 2500, step: 25, defaultValue: 1350 },
    evaluate: (t) => {
      const calcMa = (tc: number) => 120 + (tc - 700) * 0.24;
      const ma = calcMa(t);
      return {
        outputValue: `${ma.toFixed(1)} mA`,
        outputNumeric: Number(ma.toFixed(1)),
        outputUnit: 'mA (Lamp)',
        secondaryOutput: `Filament disappears against molten background at matched ${t} °C radiance`,
        normalizedPrimary: normOf(t, 700, 2500),
        observation: `Rheostat lamp current = ${ma.toFixed(1)} mA matches 650 nm spectral brightness at ${t} °C.`,
        curve: sweepCurve(700, 2500, calcMa),
        xLabel: 'Target Temp',
        xUnit: '°C',
        yLabel: 'Lamp Current',
        yUnit: 'mA',
      };
    },
  },
  'radiation-pyrometer': {
    id: 'radiation-pyrometer',
    title: 'Stefan-Boltzmann Total Radiation Pyrometer',
    governingFormulaLatex: 'E = \\varepsilon\\,\\sigma\\,(T^4 - T_{\\text{amb}}^4), \\quad \\sigma = 5.67\\times 10^{-8}\\,\\text{W/m}^2\\text{K}^4',
    assumptions: 'Ideal graybody target with adjustable surface emissivity ε.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Furnace Temp', unit: '°C', min: 300, max: 1800, step: 25, defaultValue: 1000 },
    secondaryParam: { key: 'secondary', label: 'Emissivity ε', unit: '', min: 0.2, max: 1.0, step: 0.05, defaultValue: 0.85 },
    evaluate: (t, eps) => {
      const calcKw = (tc: number) => eps * 5.67e-8 * (Math.pow(tc + 273.15, 4) - Math.pow(298.15, 4)) / 1000;
      const kw = calcKw(t);
      return {
        outputValue: `${kw.toFixed(1)} kW/m²`,
        outputNumeric: Number(kw.toFixed(2)),
        outputUnit: 'kW/m²',
        secondaryOutput: `Thermopile ≈ ${(kw * 0.42).toFixed(1)} mV`,
        normalizedPrimary: normOf(t, 300, 1800),
        normalizedSecondary: normOf(eps, 0.2, 1.0),
        observation: `T⁴ Stefan-Boltzmann scaling makes irradiance grow steeply to ${kw.toFixed(1)} kW/m² at ε = ${eps.toFixed(2)}.`,
        curve: sweepCurve(300, 1800, calcKw),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Radiant Flux',
        yUnit: 'kW/m²',
      };
    },
  },
  'ir-sensor': {
    id: 'ir-sensor',
    title: 'Infrared Thermopile Non-Contact Spot Sensor',
    governingFormulaLatex: 'V_{\\text{tp}} \\propto \\varepsilon\\,\\left(T_{\\text{target}}^4 - T_{\\text{det}}^4\\right)',
    assumptions: '8–14 μm atmospheric window Ge Fresnel optic; ambient detector at 25 °C.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Target Temp', unit: '°C', min: -20, max: 500, step: 5, defaultValue: 160 },
    secondaryParam: { key: 'secondary', label: 'Target Emissivity', unit: 'ε', min: 0.3, max: 1.0, step: 0.05, defaultValue: 0.95 },
    evaluate: (t, eps) => {
      const calcMv = (tc: number) => eps * 1.1e-9 * (Math.pow(tc + 273.15, 4) - Math.pow(298.15, 4));
      const mv = calcMv(t);
      return {
        outputValue: `${mv.toFixed(2)} mV`,
        outputNumeric: Number(mv.toFixed(2)),
        outputUnit: 'mV',
        secondaryOutput: `4–20 mA linear transmitter output ≈ ${(4 + normOf(t, -20, 500) * 16).toFixed(2)} mA`,
        normalizedPrimary: normOf(t, -20, 500),
        normalizedSecondary: normOf(eps, 0.3, 1.0),
        observation: `8–14 μm LWIR photons warm the MEMS thermopile junctions to ${mv.toFixed(2)} mV.`,
        curve: sweepCurve(-20, 500, calcMv),
        xLabel: 'Target Temp',
        xUnit: '°C',
        yLabel: 'Thermopile',
        yUnit: 'mV',
      };
    },
  },
  thermowell: {
    id: 'thermowell',
    title: 'ASME PTC 19.3 TW Vortex Wake Frequency Check',
    governingFormulaLatex: 'f_s = \\text{St}\\cdot\\frac{V}{B_m}, \\quad r = \\frac{f_s}{f_n} \\le 0.8',
    assumptions: 'Educational wake resonance check for 150 mm tapered 316L bar-stock well (f_n ≈ 185 Hz).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Fluid Velocity V', unit: 'm/s', min: 1, max: 25, step: 0.5, defaultValue: 8 },
    evaluate: (v) => {
      const calcRatio = (vel: number) => (0.22 * vel / 0.018) / 185;
      const ratio = calcRatio(v);
      return {
        outputValue: `r = ${ratio.toFixed(2)} ${ratio <= 0.8 ? '(PASS)' : '(RISK)'}`,
        outputNumeric: Number(ratio.toFixed(3)),
        outputUnit: 'fs/fn',
        secondaryOutput: `Vortex shedding ${(0.22 * v / 0.018).toFixed(1)} Hz vs Natural fn = 185 Hz`,
        normalizedPrimary: normOf(v, 1, 25),
        observation: ratio <= 0.8
          ? `Wake ratio r = ${ratio.toFixed(2)} stays safely below ASME 0.80 fatigue resonance limit.`
          : `ALERT: r = ${ratio.toFixed(2)} exceeds 0.80 — shorten unsupported length or widen tip!`,
        curve: sweepCurve(1, 25, calcRatio),
        xLabel: 'Velocity',
        xUnit: 'm/s',
        yLabel: 'Freq Ratio r',
        yUnit: 'fs/fn',
      };
    },
  },
  'temp-transmitter': {
    id: 'temp-transmitter',
    title: 'Smart 4–20 mA Temperature Transmitter Scaling',
    governingFormulaLatex: 'I_{\\text{loop}} = 4 + 16\\,\\frac{T - \\text{LRV}}{\\text{URV} - \\text{LRV}}\\;(\\text{mA})',
    assumptions: 'Configured LRV = 0 °C, URV = 400 °C Pt100 linearized output.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Sensor Input T', unit: '°C', min: 0, max: 400, step: 5, defaultValue: 200 },
    evaluate: (t) => {
      const ma = 4 + (t / 400) * 16;
      return {
        outputValue: `${ma.toFixed(2)} mA`,
        outputNumeric: Number(ma.toFixed(2)),
        outputUnit: 'mA',
        secondaryOutput: `Span = ${((t / 400) * 100).toFixed(1)}% · Pt100 R = ${rtdPt100Resistance(t).toFixed(2)} Ω`,
        normalizedPrimary: normOf(t, 0, 400),
        observation: `Transmitter digitizes Callendar-Van Dusen resistance and outputs linearized ${ma.toFixed(2)} mA.`,
        curve: sweepCurve(0, 400, (x) => 4 + (x / 400) * 16),
        xLabel: 'Temp',
        xUnit: '°C',
        yLabel: 'Loop Current',
        yUnit: 'mA',
      };
    },
  },

  // ======================= B. MOTION & DISPLACEMENT =======================
  lvdt: {
    id: 'lvdt',
    title: 'LVDT Differential Stroke & Phase Demodulation',
    governingFormulaLatex: 'V_{\\text{diff}}(x) = (E_{S1} - E_{S2}) = K_{\\text{LVDT}} \\cdot x \\cdot V_{\\text{exc}}',
    assumptions: 'Linear ±25 mm stroke core, 2.5 kHz AC primary at 5 Vrms, S = 40 mV/V/mm.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Core Displacement x', unit: 'mm', min: -25, max: 25, step: 0.5, defaultValue: 10 },
    evaluate: (x) => {
      const v = x * 0.2;
      return {
        outputValue: `${v >= 0 ? '+' : ''}${v.toFixed(2)} V`,
        outputNumeric: Number(v.toFixed(2)),
        outputUnit: 'V (demod)',
        secondaryOutput: `AC Phase w.r.t. Primary: ${x >= 0 ? '0° In-Phase' : '180° Inverted'}`,
        normalizedPrimary: normOf(x, -25, 25),
        observation: x === 0 ? 'Mechanical Null: S1 = S2 exactly balances differential output to 0 V.' : `Core shifted ${x} mm couples asymmetric mutual flux, yielding ${v.toFixed(2)} V.`,
        curve: sweepCurve(-25, 25, (d) => d * 0.2),
        xLabel: 'Stroke x',
        xUnit: 'mm',
        yLabel: 'Diff Voltage',
        yUnit: 'V',
      };
    },
  },
  potentiometer: {
    id: 'potentiometer',
    title: 'Potentiometric Displacement with Loading Error',
    governingFormulaLatex: '\\frac{V_{\\text{out}}}{V_{\\text{in}}} = \\frac{\\alpha}{1 + \\alpha(1-\\alpha)(R_p/R_L)}, \\quad \\alpha = \\frac{x}{L}',
    assumptions: 'Total track Rp = 10 kΩ, length 100 mm, V_in = 10 V.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Wiper Stroke x', unit: 'mm', min: 0, max: 100, step: 2, defaultValue: 50 },
    secondaryParam: { key: 'secondary', label: 'Load Resistance RL', unit: 'kΩ', min: 5, max: 200, step: 5, defaultValue: 20 },
    evaluate: (x, rl) => {
      const calcV = (pos: number) => {
        const a = pos / 100;
        return (10 * a) / (1 + a * (1 - a) * (10 / rl));
      };
      const v = calcV(x);
      return {
        outputValue: `${v.toFixed(2)} V`,
        outputNumeric: Number(v.toFixed(2)),
        outputUnit: 'V',
        secondaryOutput: `Ideal unloaded = ${(x * 0.1).toFixed(2)} V · Error = ${(v - x * 0.1).toFixed(2)} V`,
        normalizedPrimary: normOf(x, 0, 100),
        normalizedSecondary: normOf(rl, 5, 200),
        observation: `Finite R_L = ${rl} kΩ loads the divider downward around mid-travel!`,
        curve: sweepCurve(0, 100, calcV),
        idealCurve: sweepCurve(0, 100, (d) => d * 0.1),
        xLabel: 'Position',
        xUnit: 'mm',
        yLabel: 'Output V',
        yUnit: 'V',
      };
    },
  },
  'var-inductance': {
    id: 'var-inductance',
    title: 'Air-Gap Variable Reluctance Inductance',
    governingFormulaLatex: 'L(d) = \\frac{N^2}{\\Re_{\\text{iron}} + 2d/(\\mu_0 A)} \\approx \\frac{L_0}{1 + d/d_0}',
    assumptions: 'Hyperbolic reluctance law (L₀ = 120 mH at minimum gap, d₀ = 1.5 mm).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Air Gap d', unit: 'mm', min: 0.2, max: 6, step: 0.1, defaultValue: 1.5 },
    evaluate: (d) => {
      const calcL = (g: number) => 120 / (1 + g / 1.5);
      const l = calcL(d);
      return {
        outputValue: `${l.toFixed(1)} mH`,
        outputNumeric: Number(l.toFixed(1)),
        outputUnit: 'mH',
        secondaryOutput: `Nonlinear hyperbolic falloff — best linearized differentially`,
        normalizedPrimary: normOf(d, 0.2, 6),
        observation: `Widening air-gap to ${d.toFixed(1)} mm raises reluctance and drops coil inductance to ${l.toFixed(1)} mH.`,
        curve: sweepCurve(0.2, 6, calcL),
        xLabel: 'Air Gap d',
        xUnit: 'mm',
        yLabel: 'Inductance L',
        yUnit: 'mH',
      };
    },
  },
  'cap-displacement': {
    id: 'cap-displacement',
    title: 'Parallel-Plate Capacitive Micrometer',
    governingFormulaLatex: 'C(d) = \\frac{\\varepsilon_0\\,\\varepsilon_r\\,A}{d}',
    assumptions: 'Air dielectric (εr = 1.0006), active guard-ring plate area A = 400 mm².',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Plate Separation d', unit: 'mm', min: 0.1, max: 3.0, step: 0.05, defaultValue: 0.5 },
    evaluate: (d) => {
      const calcC = (g: number) => (8.854e-12 * 400e-6 / (g * 1e-3)) * 1e12;
      const pf = calcC(d);
      return {
        outputValue: `${pf.toFixed(2)} pF`,
        outputNumeric: Number(pf.toFixed(2)),
        outputUnit: 'pF',
        secondaryOutput: `Inverse law C ∝ 1/d; capacitive reactance @ 100 kHz = ${(1e6 / (2 * Math.PI * 1e5 * pf) * 1e3).toFixed(1)} kΩ`,
        normalizedPrimary: normOf(d, 0.1, 3.0),
        observation: `Reducing electrode spacing increases electric capacitance inversely to ${pf.toFixed(2)} pF.`,
        curve: sweepCurve(0.1, 3.0, calcC),
        xLabel: 'Gap d',
        xUnit: 'mm',
        yLabel: 'Capacitance',
        yUnit: 'pF',
      };
    },
  },
  'optical-encoder': {
    id: 'optical-encoder',
    title: 'Incremental Quadrature Optical Encoder',
    governingFormulaLatex: 'f_{\\text{pulse}} = \\frac{\\text{RPM} \\times \\text{PPR}}{60}',
    assumptions: '1024 PPR slotted code wheel with A/B 90° quadrature channels.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Shaft Speed', unit: 'RPM', min: 10, max: 3000, step: 10, defaultValue: 600 },
    evaluate: (rpm) => {
      const khz = (rpm * 1024) / 60000;
      return {
        outputValue: `${khz.toFixed(2)} kHz`,
        outputNumeric: Number(khz.toFixed(2)),
        outputUnit: 'kHz / ch',
        secondaryOutput: `4× Quadrature edge count rate = ${(khz * 4).toFixed(1)} kHz (0.088° res)`,
        normalizedPrimary: normOf(rpm, 10, 3000),
        observation: `Optical wheel rotation generates ${khz.toFixed(2)} kHz square pulse trains on Phase A & Phase B.`,
        curve: sweepCurve(10, 3000, (n) => (n * 1024) / 60000),
        xLabel: 'Speed',
        xUnit: 'RPM',
        yLabel: 'Pulse Freq',
        yUnit: 'kHz',
      };
    },
  },
  tachogenerator: {
    id: 'tachogenerator',
    title: 'DC Permanent-Magnet Tachogenerator',
    governingFormulaLatex: 'V_g = K_e \\cdot N\\quad (\\text{linear V vs RPM})',
    assumptions: 'Brush-commutated DC tacho rated 20 mV / RPM (60 V @ 3000 RPM).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Shaft Speed', unit: 'RPM', min: 0, max: 3000, step: 25, defaultValue: 1200 },
    evaluate: (rpm) => {
      const vg = rpm * 0.02;
      return {
        outputValue: `${vg.toFixed(1)} V DC`,
        outputNumeric: Number(vg.toFixed(1)),
        outputUnit: 'V',
        secondaryOutput: `Linear feedback gain Ke = 0.020 V/RPM`,
        normalizedPrimary: normOf(rpm, 0, 3000),
        observation: `Spinning armature cuts stationary PM flux at ${rpm} RPM, generating ${vg.toFixed(1)} V DC.`,
        curve: sweepCurve(0, 3000, (n) => n * 0.02),
        xLabel: 'Speed',
        xUnit: 'RPM',
        yLabel: 'Generated V',
        yUnit: 'V',
      };
    },
  },
  accelerometer: {
    id: 'accelerometer',
    title: 'IEPE Piezoelectric Seismic Accelerometer',
    governingFormulaLatex: 'V_{\\text{out}} = S \\cdot a, \\quad f_{\\text{op}} \\ll f_n',
    assumptions: '100 mV/g shear-mode quartz crystal + ICP preamp below 10 kHz resonance.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Acceleration', unit: 'g', min: 0, max: 50, step: 1, defaultValue: 12 },
    secondaryParam: { key: 'secondary', label: 'Vibration Freq', unit: 'Hz', min: 10, max: 5000, step: 25, defaultValue: 120 },
    evaluate: (g, f) => {
      const mv = g * 100 * (1 / Math.sqrt(Math.pow(1 - Math.pow(f / 18000, 2), 2) + 0.04));
      return {
        outputValue: `${mv.toFixed(0)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV peak',
        secondaryOutput: `Charge sensitivity 10 pC/g → ${(g * 10).toFixed(0)} pC`,
        normalizedPrimary: normOf(g, 0, 50),
        normalizedSecondary: normOf(f, 10, 5000),
        observation: `Proof mass inertia shears the quartz stack linearly up to flat resonant corner.`,
        curve: sweepCurve(0, 50, (a) => a * 100),
        xLabel: 'Acceleration',
        xUnit: 'g',
        yLabel: 'IEPE Output',
        yUnit: 'mV',
      };
    },
  },
  'velocity-pickup': {
    id: 'velocity-pickup',
    title: 'Moving-Coil Seismic Velocity Transducer',
    governingFormulaLatex: 'e(t) = B\\,l\\,v(t) \\quad (\\text{above } f_n \\approx 8\\,\\text{Hz})',
    assumptions: 'Standard 20 mV / (mm/s) velocity pickup for turbomachinery bearing housings.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Vibration Velocity', unit: 'mm/s', min: 0, max: 40, step: 0.5, defaultValue: 7.1 },
    evaluate: (v) => {
      const mv = v * 20;
      return {
        outputValue: `${mv.toFixed(0)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV RMS',
        secondaryOutput: `ISO 10816 zone: ${v < 2.8 ? 'Good' : v < 7.1 ? 'Satisfactory' : 'Alert / Unsatisfactory'}`,
        normalizedPrimary: normOf(v, 0, 40),
        observation: `Relative motion between suspended magnet and pickup coil generates ${mv.toFixed(0)} mV.`,
        curve: sweepCurve(0, 40, (x) => x * 20),
        xLabel: 'Velocity',
        xUnit: 'mm/s',
        yLabel: 'EMF Output',
        yUnit: 'mV',
      };
    },
  },

  // ======================= C. PRESSURE & FORCE =======================
  'strain-gauge': {
    id: 'strain-gauge',
    title: 'Quarter-Bridge Cantilever Strain Gauge',
    governingFormulaLatex: '\\frac{\\Delta R}{R} = G_f \\cdot \\varepsilon, \\qquad G_f = 2.10',
    assumptions: '350 Ω Constantan foil gauge on steel beam (10 N load ≈ 120 με).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Tip Load Force', unit: 'N', min: 0, max: 100, step: 2, defaultValue: 35 },
    evaluate: (f) => {
      const strain = f * 12; // microstrain
      const dR = 350 * 2.1 * strain * 1e-6;
      return {
        outputValue: `${strain.toFixed(0)} με`,
        outputNumeric: strain,
        outputUnit: 'με',
        secondaryOutput: `ΔR = +${dR.toFixed(4)} Ω (R = ${(350 + dR).toFixed(4)} Ω)`,
        normalizedPrimary: normOf(f, 0, 100),
        observation: `Beam bending stretches the serpentine grid, raising resistance by +${dR.toFixed(4)} Ω.`,
        curve: sweepCurve(0, 100, (x) => 350 * 2.1 * (x * 12) * 1e-6),
        xLabel: 'Load Force',
        xUnit: 'N',
        yLabel: 'ΔR Change',
        yUnit: 'Ω',
      };
    },
  },
  'load-cell': {
    id: 'load-cell',
    title: 'Full-Bridge 2 mV/V Shear-Beam Load Cell',
    governingFormulaLatex: 'V_{\\text{out}} = V_{\\text{exc}} \\cdot S \\cdot \\frac{m}{m_{\\text{FS}}}, \\quad S = 2.0\\,\\text{mV/V}',
    assumptions: '500 kg rated capacity, 10.0 VDC excitation, temperature-compensated full bridge.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Applied Load', unit: 'kg', min: 0, max: 500, step: 10, defaultValue: 250 },
    evaluate: (m) => {
      const mv = (m / 500) * 20;
      return {
        outputValue: `${mv.toFixed(2)} mV`,
        outputNumeric: Number(mv.toFixed(2)),
        outputUnit: 'mV DC',
        secondaryOutput: `Sensitivity = 0.040 mV/kg at 10 V excitation`,
        normalizedPrimary: normOf(m, 0, 500),
        observation: `All 4 strain gauges act symmetrically in opposing tension/compression, producing ${mv.toFixed(2)} mV.`,
        curve: sweepCurve(0, 500, (x) => (x / 500) * 20),
        xLabel: 'Mass Load',
        xUnit: 'kg',
        yLabel: 'Bridge Output',
        yUnit: 'mV',
      };
    },
  },
  'torque-transducer': {
    id: 'torque-transducer',
    title: 'Rotary 45° Strain Torque & Shaft Power',
    governingFormulaLatex: 'P_{\\text{shaft}} = T \\cdot \\omega = \\frac{2\\pi N T}{60}',
    assumptions: '500 N·m rated steel torsion bar with secondary shaft RPM control.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Applied Torque T', unit: 'N·m', min: 0, max: 500, step: 10, defaultValue: 180 },
    secondaryParam: { key: 'secondary', label: 'Shaft Speed N', unit: 'RPM', min: 100, max: 3000, step: 50, defaultValue: 1500 },
    evaluate: (t, rpm) => {
      const kw = (2 * Math.PI * rpm * t) / 60000;
      return {
        outputValue: `${kw.toFixed(2)} kW`,
        outputNumeric: Number(kw.toFixed(2)),
        outputUnit: 'kW',
        secondaryOutput: `Shear strain output = ${((t / 500) * 15).toFixed(2)} mV`,
        normalizedPrimary: normOf(t, 0, 500),
        normalizedSecondary: normOf(rpm, 100, 3000),
        observation: `45° chevron bridge resolves principal shear torque (${t} N·m); at ${rpm} RPM shaft delivers ${kw.toFixed(2)} kW.`,
        curve: sweepCurve(0, 500, (x) => (2 * Math.PI * rpm * x) / 60000),
        xLabel: 'Torque T',
        xUnit: 'N·m',
        yLabel: 'Shaft Power',
        yUnit: 'kW',
      };
    },
  },
  'dp-transmitter': {
    id: 'dp-transmitter',
    title: 'Smart DP Transmitter (4–20 mA & Square-Root Flow)',
    governingFormulaLatex: 'I_{\\text{out}} = 4 + 16\\,\\frac{\\Delta P}{\\Delta P_{\\text{span}}}',
    assumptions: 'Calibrated 0–100 kPa DP span delivering both linear DP mA and √ΔP % Flow.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Differential ΔP', unit: 'kPa', min: 0, max: 100, step: 2, defaultValue: 25 },
    evaluate: (dp) => {
      const ma = 4 + (dp / 100) * 16;
      const qPct = Math.sqrt(dp / 100) * 100;
      return {
        outputValue: `${ma.toFixed(2)} mA`,
        outputNumeric: Number(ma.toFixed(2)),
        outputUnit: 'mA',
        secondaryOutput: `Orifice Flow Equivalent (√ΔP): ${qPct.toFixed(1)} % Flow`,
        normalizedPrimary: normOf(dp, 0, 100),
        observation: `Notice 25% ΔP (25 kPa, 8.00 mA linear) corresponds to 50.0% volumetric flow!`,
        curve: sweepCurve(0, 100, (x) => 4 + (x / 100) * 16),
        xLabel: 'DP Input',
        xUnit: 'kPa',
        yLabel: 'Loop Current',
        yUnit: 'mA',
      };
    },
  },
  'bourdon-tube': {
    id: 'bourdon-tube',
    title: 'C-Tube Bourdon Gauge Deformation & Sweep',
    governingFormulaLatex: '\\theta_{\\text{pointer}} = \\frac{P}{P_{\\text{span}}} \\cdot 270^\\circ',
    assumptions: 'EN 837-1 Class 1.0 bronze C-tube 0–10 bar gauge with sector/pinion amplification.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Gauge Pressure', unit: 'bar', min: 0, max: 10, step: 0.2, defaultValue: 4.5 },
    evaluate: (p) => {
      const deg = (p / 10) * 270;
      return {
        outputValue: `${p.toFixed(1)} bar (${deg.toFixed(0)}°)`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg sweep',
        secondaryOutput: `${(p * 14.5038).toFixed(1)} psig · Tip radial displacement ≈ ${(p * 0.28).toFixed(2)} mm`,
        normalizedPrimary: normOf(p, 0, 10),
        observation: `Internal fluid attempts to circularize the oval C-tube cross-section, driving sector-pinion to ${deg.toFixed(0)}°.`,
        curve: sweepCurve(0, 10, (x) => (x / 10) * 270),
        xLabel: 'Pressure',
        xUnit: 'bar',
        yLabel: 'Needle Angle',
        yUnit: '°',
      };
    },
  },
  diaphragm: {
    id: 'diaphragm',
    title: 'Corrugated Elastic Diaphragm Deflection',
    governingFormulaLatex: 'P = \\frac{16\\,E\\,h^4}{3(1-\\nu^2)R^4}\\left[\\frac{y}{h} + 0.488\\left(\\frac{y}{h}\\right)^3\\right]',
    assumptions: 'Thin stainless circular diaphragm showcasing stiffening cubic term at large deflections.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Applied Pressure', unit: 'kPa', min: 0, max: 200, step: 5, defaultValue: 80 },
    evaluate: (p) => {
      const calcDeflect = (pk: number) => 0.9 * Math.cbrt(pk / 200) * 0.55 + (pk / 200) * 0.45;
      const mm = calcDeflect(p);
      return {
        outputValue: `${mm.toFixed(3)} mm`,
        outputNumeric: Number(mm.toFixed(3)),
        outputUnit: 'mm center',
        secondaryOutput: `Mild S-curve stiffness (linearized by radial corrugations)`,
        normalizedPrimary: normOf(p, 0, 200),
        observation: `At high pressure membrane tension adds cubic stiffening, bounding center displacement to ${mm.toFixed(3)} mm.`,
        curve: sweepCurve(0, 200, calcDeflect),
        idealCurve: sweepCurve(0, 200, (pk) => pk / 200),
        xLabel: 'Pressure',
        xUnit: 'kPa',
        yLabel: 'Center Deflection',
        yUnit: 'mm',
      };
    },
  },
  bellows: {
    id: 'bellows',
    title: 'Spring-Loaded Metallic Bellows Stroke',
    governingFormulaLatex: 'x = \\frac{P \\cdot A_{\\text{eff}}}{K_{\\text{bellows}} + K_{\\text{spring}}}',
    assumptions: 'Phosphor-bronze capsule A_eff = 6 cm² + internal range spring suppressing hysteresis.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Pressure P', unit: 'kPa', min: 0, max: 100, step: 2, defaultValue: 40 },
    evaluate: (p) => {
      const mm = (p / 100) * 12.0;
      return {
        outputValue: `${mm.toFixed(2)} mm`,
        outputNumeric: Number(mm.toFixed(2)),
        outputUnit: 'mm stroke',
        secondaryOutput: `Sensitivity = 0.120 mm/kPa`,
        normalizedPrimary: normOf(p, 0, 100),
        observation: `Pressure compresses the bellows uniformly by ${mm.toFixed(2)} mm against the calibrated helical spring.`,
        curve: sweepCurve(0, 100, (x) => (x / 100) * 12.0),
        xLabel: 'Pressure',
        xUnit: 'kPa',
        yLabel: 'Axial Stroke',
        yUnit: 'mm',
      };
    },
  },
  'strain-pressure': {
    id: 'strain-pressure',
    title: 'Silicon Piezoresistive Flush Bridge',
    governingFormulaLatex: 'V_{\\text{out}} = K_{\\text{gauge}} \\cdot \\frac{P}{P_{\\text{FS}}} \\cdot V_{\\text{exc}}',
    assumptions: '0–40 bar diffused Wheatstone bridge, 100 mV full-scale @ 10 VDC.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Line Pressure', unit: 'bar', min: 0, max: 40, step: 1, defaultValue: 16 },
    evaluate: (p) => {
      const mv = (p / 40) * 100;
      return {
        outputValue: `${mv.toFixed(1)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV DC',
        secondaryOutput: `4–20 mA conditioned loop = ${(4 + (p / 40) * 16).toFixed(2)} mA`,
        normalizedPrimary: normOf(p, 0, 40),
        observation: `Si piezoresistance changes ~50× stronger than metal foil, yielding ${mv.toFixed(1)} mV direct output.`,
        curve: sweepCurve(0, 40, (x) => (x / 40) * 100),
        xLabel: 'Pressure',
        xUnit: 'bar',
        yLabel: 'Bridge Output',
        yUnit: 'mV',
      };
    },
  },
  'cap-pressure': {
    id: 'cap-pressure',
    title: 'Differential Capacitance Pressure Cell',
    governingFormulaLatex: '\\frac{C_1 - C_2}{C_1 + C_2} = \\frac{\\Delta d}{d_0} \\propto \\Delta P',
    assumptions: 'Symmetric twin-capacitor bridge cancelling common temperature oil expansion.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Applied ΔP', unit: 'kPa', min: -50, max: 50, step: 2, defaultValue: 20 },
    evaluate: (dp) => {
      const ratio = (dp / 50) * 0.42;
      return {
        outputValue: `${(ratio * 100).toFixed(1)} % Ratio`,
        outputNumeric: Number((ratio * 100).toFixed(1)),
        outputUnit: '% (C1-C2)/(C1+C2)',
        secondaryOutput: `Zero static drift; linear even at tiny deflections`,
        normalizedPrimary: normOf(dp, -50, 50),
        observation: `Differential ratiometric bridge yields linear ${(ratio * 100).toFixed(1)}% imbalance proportional to ΔP.`,
        curve: sweepCurve(-50, 50, (x) => (x / 50) * 42),
        xLabel: 'Delta P',
        xUnit: 'kPa',
        yLabel: 'Bridge Ratio',
        yUnit: '%',
      };
    },
  },
  'piezo-sensor': {
    id: 'piezo-sensor',
    title: 'Dynamic Piezoelectric Charge Output (q = d·A·P)',
    governingFormulaLatex: 'q = d_{11} \\cdot F, \\qquad V(t) = V_0\\,e^{-t/(R C)}',
    assumptions: 'Quartz crystal sensitivity 2.3 pC/N, area 1 cm²; unsuitable for pure static DC pressure!',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Dynamic Peak P', unit: 'bar', min: 0, max: 200, step: 5, defaultValue: 80 },
    evaluate: (p) => {
      const pc = p * 23;
      return {
        outputValue: `${pc.toFixed(0)} pC`,
        outputNumeric: Number(pc.toFixed(0)),
        outputUnit: 'pC (Peak)',
        secondaryOutput: `Voltage at charge amp @ 100 pF/bar scale ≈ ${(pc / 100).toFixed(2)} V`,
        normalizedPrimary: normOf(p, 0, 200),
        observation: `Dynamic pressure pulse generates ${pc.toFixed(0)} pC surface charge instantaneously (decays slowly under finite cable R·C).`,
        curve: sweepCurve(0, 200, (x) => x * 23),
        xLabel: 'Peak Pressure',
        xUnit: 'bar',
        yLabel: 'Crystal Charge',
        yUnit: 'pC',
      };
    },
  },
  'deadweight-tester': {
    id: 'deadweight-tester',
    title: 'Primary Piston-Gauge Dead-Weight Tester',
    governingFormulaLatex: 'P = \\frac{M \\cdot g_{\\text{local}}}{A_{\\text{eff}}}',
    assumptions: 'Effective piston area A_eff = 0.5 cm² (5×10⁻⁵ m²), local g = 9.80665 m/s².',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Total Mass M', unit: 'kg', min: 0.5, max: 35, step: 0.5, defaultValue: 10 },
    evaluate: (m) => {
      const calcBar = (mass: number) => (mass * 9.80665) / (5e-5 * 1e5);
      const bar = calcBar(m);
      return {
        outputValue: `${bar.toFixed(3)} bar`,
        outputNumeric: Number(bar.toFixed(3)),
        outputUnit: 'bar (Primary)',
        secondaryOutput: `= ${(bar * 100).toFixed(1)} kPa (${(bar * 14.5038).toFixed(2)} psi)`,
        normalizedPrimary: normOf(m, 0.5, 35),
        observation: `Spinning piston eliminates seal stiction so ${m.toFixed(1)} kg establishes primary ${bar.toFixed(3)} bar reference.`,
        curve: sweepCurve(0.5, 35, calcBar),
        xLabel: 'Loaded Mass',
        xUnit: 'kg',
        yLabel: 'Pressure P',
        yUnit: 'bar',
      };
    },
  },
  manometer: {
    id: 'manometer',
    title: 'U-Tube Hydrostatic Column Manometer',
    governingFormulaLatex: '\\Delta h = \\frac{\\Delta P}{(\\rho_{\\text{man}} - \\rho_{\\text{gas}})\\,g}',
    assumptions: 'Choose between Water (SG 1.0) and Mercury (SG 13.56) fill media.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Applied ΔP', unit: 'kPa', min: -25, max: 25, step: 0.5, defaultValue: 10 },
    secondaryParam: { key: 'secondary', label: 'Fill Fluid (0=H₂O, 1=Hg)', unit: '', min: 0, max: 1, step: 1, defaultValue: 1 },
    evaluate: (dp, isHg) => {
      const rho = isHg > 0.5 ? 13560 : 1000;
      const calcMm = (p: number) => ((p * 1000) / (rho * 9.80665)) * 1000;
      const mm = calcMm(dp);
      return {
        outputValue: `${mm >= 0 ? '+' : ''}${mm.toFixed(1)} mm`,
        outputNumeric: Number(mm.toFixed(1)),
        outputUnit: isHg > 0.5 ? 'mmHg' : 'mmH₂O',
        secondaryOutput: `Column fluid density = ${rho} kg/m³`,
        normalizedPrimary: normOf(dp, -25, 25),
        normalizedSecondary: isHg,
        observation: `${isHg > 0.5 ? 'Dense Mercury' : 'Water'} yields ${(Math.abs(mm)).toFixed(1)} mm height difference under ${dp} kPa ΔP.`,
        curve: sweepCurve(-25, 25, calcMm),
        xLabel: 'Delta P',
        xUnit: 'kPa',
        yLabel: 'Height Δh',
        yUnit: 'mm',
      };
    },
  },
  'vacuum-gauge': {
    id: 'vacuum-gauge',
    title: 'Pirani Thermal Conductivity Vacuum Response',
    governingFormulaLatex: 'P_{\\text{loss}} \\propto k_{\\text{gas}}(P) \\cdot \\Delta T \\quad (10^{-3}\\text{ to }10\\text{ Torr})',
    assumptions: 'Educational Pirani S-curve bridge imbalance (V_bridge saturates at rough atmospheric >10 Torr & UHV <10⁻⁴ Torr).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Log10 Pressure (Torr)', unit: 'log Torr', min: -4, max: 1, step: 0.2, defaultValue: -1.5 },
    evaluate: (logP) => {
      const torr = Math.pow(10, logP);
      const calcV = (lp: number) => 5.0 / (1 + Math.pow(10, -0.9 * (lp + 1.2)));
      const v = calcV(logP);
      return {
        outputValue: `${torr.toExponential(1)} Torr`,
        outputNumeric: Number(v.toFixed(2)),
        outputUnit: `(${v.toFixed(2)} V Bridge)`,
        secondaryOutput: `Pirani thermal filament cools nonlinearly across medium vacuum`,
        normalizedPrimary: normOf(logP, -4, 1),
        observation: `Gas molecular mean free path drops with pressure (${torr.toExponential(1)} Torr), changing wire heat conduction.`,
        curve: sweepCurve(-4, 1, calcV),
        xLabel: 'log10(P)',
        xUnit: 'Torr exp',
        yLabel: 'Pirani Bridge',
        yUnit: 'V',
      };
    },
  },

  // ======================= D. FLOW =======================
  'orifice-plate': {
    id: 'orifice-plate',
    title: 'ISO 5167 Orifice Quadratic Flow-DP Law',
    governingFormulaLatex: '\\Delta P = \\Delta P_{\\max}\\left(\\frac{Q}{Q_{\\max}}\\right)^2, \\qquad \\Delta P_{\\text{loss}} \\approx (1-\\beta^{1.9})\\Delta P',
    assumptions: 'Water run rated Q_max = 100 m³/h at ΔP = 100 kPa, β = 0.60.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Volumetric Flow Q', unit: 'm³/h', min: 0, max: 100, step: 2, defaultValue: 70 },
    evaluate: (q) => {
      const dp = Math.pow(q / 100, 2) * 100;
      const loss = dp * 0.62;
      return {
        outputValue: `${dp.toFixed(1)} kPa`,
        outputNumeric: Number(dp.toFixed(1)),
        outputUnit: 'kPa ΔP',
        secondaryOutput: `Permanent unrecovered head loss ≈ ${loss.toFixed(1)} kPa (62%)`,
        normalizedPrimary: normOf(q, 0, 100),
        observation: `Quadratic Bernoulli relation cuts sensitivity below 25% Q unless ΔP extractor resolution stays high.`,
        curve: sweepCurve(0, 100, (x) => Math.pow(x / 100, 2) * 100),
        xLabel: 'Flow Q',
        xUnit: 'm³/h',
        yLabel: 'Differential ΔP',
        yUnit: 'kPa',
      };
    },
  },
  venturi: {
    id: 'venturi',
    title: 'Venturi High-Recovery ΔP & Throat Velocity',
    governingFormulaLatex: '\\Delta P = \\frac{\\rho}{2}(v_{\\text{throat}}^2 - v_1^2), \\qquad \\text{Loss} \\approx 10\\%\\Delta P',
    assumptions: 'DN100 inlet / β = 0.55 throat water service, high energy recovery 7° diffuser.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Volumetric Flow Q', unit: 'm³/h', min: 0, max: 120, step: 2, defaultValue: 72 },
    evaluate: (q) => {
      const dp = Math.pow(q / 120, 2) * 80;
      const loss = dp * 0.11;
      return {
        outputValue: `${dp.toFixed(1)} kPa`,
        outputNumeric: Number(dp.toFixed(1)),
        outputUnit: 'kPa ΔP',
        secondaryOutput: `Permanent pumping loss only ${loss.toFixed(2)} kPa (vs ~50 kPa on Orifice!)`,
        normalizedPrimary: normOf(q, 0, 120),
        observation: `Gradual 7° recovery cone recovers ~89% of throat pressure drop, saving plant pumping energy.`,
        curve: sweepCurve(0, 120, (x) => Math.pow(x / 120, 2) * 80),
        xLabel: 'Flow Q',
        xUnit: 'm³/h',
        yLabel: 'Venturi ΔP',
        yUnit: 'kPa',
      };
    },
  },
  'flow-nozzle': {
    id: 'flow-nozzle',
    title: 'ASME Elliptical Flow Nozzle Steam/High-Vel ΔP',
    governingFormulaLatex: 'Q = C_d\\,A_2\\sqrt{\\frac{2\\Delta P}{\\rho(1-\\beta^4)}}, \\qquad C_d \\approx 0.99',
    assumptions: 'Contoured elliptical entry resists erosion in superheated high-velocity steam lines.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Flow Rate', unit: 't/h', min: 0, max: 150, step: 5, defaultValue: 90 },
    evaluate: (q) => {
      const dp = Math.pow(q / 150, 2) * 120;
      return {
        outputValue: `${dp.toFixed(1)} kPa`,
        outputNumeric: Number(dp.toFixed(1)),
        outputUnit: 'kPa ΔP',
        secondaryOutput: `Permanent pressure loss ≈ ${(dp * 0.4).toFixed(1)} kPa (~40%, between Venturi & Orifice)`,
        normalizedPrimary: normOf(q, 0, 150),
        observation: `Smooth quarter-ellipse throat achieves Cd ≈ 0.99 with strong cavitation/erosion resistance.`,
        curve: sweepCurve(0, 150, (x) => Math.pow(x / 150, 2) * 120),
        xLabel: 'Mass Flow',
        xUnit: 't/h',
        yLabel: 'Nozzle ΔP',
        yUnit: 'kPa',
      };
    },
  },
  rotameter: {
    id: 'rotameter',
    title: 'Variable-Area Tapered Glass Rotameter',
    governingFormulaLatex: 'Q = C_d\\,A_{\\text{annulus}}(h)\\sqrt{\\frac{2g V_f(\\rho_f - \\rho)}{\\rho A_f}}',
    assumptions: 'Constant ΔP float weight equilibrium; 0–100 LPM linear 250 mm glass scale.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Flow Rate Q', unit: 'LPM', min: 0, max: 100, step: 2, defaultValue: 48 },
    evaluate: (q) => {
      const mm = (q / 100) * 250;
      return {
        outputValue: `${mm.toFixed(0)} mm Float`,
        outputNumeric: Number(mm.toFixed(1)),
        outputUnit: 'mm height',
        secondaryOutput: `Flow area expands linearly with float elevation h under constant ΔP`,
        normalizedPrimary: normOf(q, 0, 100),
        observation: `Higher flow forces the float upward into a wider annulus until drag + buoyancy balance float gravity at ${mm.toFixed(0)} mm.`,
        curve: sweepCurve(0, 100, (x) => (x / 100) * 250),
        xLabel: 'Flow Q',
        xUnit: 'LPM',
        yLabel: 'Float Height',
        yUnit: 'mm',
      };
    },
  },
  magmeter: {
    id: 'magmeter',
    title: 'Faraday Law Electromagnetic Flow Meter',
    governingFormulaLatex: 'E = B \\cdot D \\cdot v, \\qquad Q = \\frac{\\pi D^2}{4}v',
    assumptions: 'DN100 (0.1 m) PTFE-lined spool, magnetic field B = 20 mT, conductive liquid ≥ 5 μS/cm.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Fluid Velocity v', unit: 'm/s', min: 0, max: 8, step: 0.2, defaultValue: 3.2 },
    evaluate: (v) => {
      const mv = 0.02 * 0.1 * v * 1000;
      const m3h = (Math.PI * 0.01 / 4) * v * 3600;
      return {
        outputValue: `${mv.toFixed(2)} mV`,
        outputNumeric: Number(mv.toFixed(2)),
        outputUnit: 'mV EMF',
        secondaryOutput: `Volumetric flow rate Q = ${m3h.toFixed(1)} m³/h (Zero head loss!)`,
        normalizedPrimary: normOf(v, 0, 8),
        observation: `Strictly linear EMF E = B·D·v independent of fluid density, viscosity, or pressure.`,
        curve: sweepCurve(0, 8, (vel) => 2.0 * vel),
        xLabel: 'Velocity',
        xUnit: 'm/s',
        yLabel: 'Electrode EMF',
        yUnit: 'mV',
      };
    },
  },
  'ultrasonic-flow': {
    id: 'ultrasonic-flow',
    title: 'Transit-Time Ultrasonic Delta-T',
    governingFormulaLatex: '\\Delta t = t_{\\text{up}} - t_{\\text{down}} \\approx \\frac{2\\,L\\,v\\cos\\theta}{c^2}',
    assumptions: 'Water c = 1480 m/s, 45° V-path acoustic length L = 0.25 m.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Fluid Velocity v', unit: 'm/s', min: 0, max: 10, step: 0.2, defaultValue: 4.0 },
    evaluate: (v) => {
      const calcNs = (vel: number) => ((2 * 0.25 * vel * Math.cos(Math.PI / 4)) / (1480 * 1480)) * 1e9;
      const ns = calcNs(v);
      return {
        outputValue: `${ns.toFixed(1)} ns`,
        outputNumeric: Number(ns.toFixed(1)),
        outputUnit: 'ns Δt',
        secondaryOutput: `Requires picosecond TDC timing resolution cleanly unaffected by pipe pressure`,
        normalizedPrimary: normOf(v, 0, 10),
        observation: `Acoustic beam sweeps faster downstream than upstream by ${ns.toFixed(1)} nanoseconds.`,
        curve: sweepCurve(0, 10, calcNs),
        xLabel: 'Velocity',
        xUnit: 'm/s',
        yLabel: 'Transit Δt',
        yUnit: 'ns',
      };
    },
  },
  'turbine-flow': {
    id: 'turbine-flow',
    title: 'Turbine Meter Linear Pulse Frequency',
    governingFormulaLatex: 'f_{\\text{pulse}} = K_{\\text{meter}} \\cdot Q',
    assumptions: '6-blade rotor K-factor = 150 pulses/liter above transitional Reynolds minimum.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Volumetric Flow', unit: 'L/s', min: 0.5, max: 15, step: 0.5, defaultValue: 6.0 },
    evaluate: (q) => {
      const hz = q * 150;
      return {
        outputValue: `${hz.toFixed(0)} Hz`,
        outputNumeric: hz,
        outputUnit: 'Hz pulses',
        secondaryOutput: `Totalizer increments 150 pulses per liter passed`,
        normalizedPrimary: normOf(q, 0.5, 15),
        observation: `Magnetic reluctance pickup outputs clean ${hz.toFixed(0)} Hz pulse frequency strictly linear in flow.`,
        curve: sweepCurve(0.5, 15, (x) => x * 150),
        xLabel: 'Flow Q',
        xUnit: 'L/s',
        yLabel: 'Output Freq',
        yUnit: 'Hz',
      };
    },
  },
  'vortex-flow': {
    id: 'vortex-flow',
    title: 'Kármán Vortex Shedding Frequency',
    governingFormulaLatex: 'f_v = \\text{St} \\cdot \\frac{v}{d}, \\qquad \\text{St} \\approx 0.20',
    assumptions: 'Bluff body width d = 20 mm, constant Strouhal number St = 0.20 for Re > 20,000.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Flow Velocity v', unit: 'm/s', min: 1, max: 40, step: 1, defaultValue: 12 },
    evaluate: (v) => {
      const hz = (0.2 * v) / 0.02;
      return {
        outputValue: `${hz.toFixed(0)} Hz`,
        outputNumeric: hz,
        outputUnit: 'Hz vortices',
        secondaryOutput: `Same Strouhal calibration applies to steam, gas, or water above Re threshold`,
        normalizedPrimary: normOf(v, 1, 40),
        observation: `Alternating pressure pulses downstream oscillate the piezo crystal at ${hz.toFixed(0)} Hz.`,
        curve: sweepCurve(1, 40, (x) => (0.2 * x) / 0.02),
        xLabel: 'Velocity',
        xUnit: 'm/s',
        yLabel: 'Shed Freq',
        yUnit: 'Hz',
      };
    },
  },
  'coriolis-flow': {
    id: 'coriolis-flow',
    title: 'Coriolis Phase Time-Lag & Mass Flow',
    governingFormulaLatex: '\\dot{m} = K_u \\cdot \\Delta t_{\\text{phase}}, \\qquad \\rho = A f_r^{-2} - B',
    assumptions: 'Educational linearized twist time-lag (sensitivity 2.2 μs per kg/min).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Mass Flow ṁ', unit: 'kg/min', min: 0, max: 100, step: 2, defaultValue: 45 },
    evaluate: (m) => {
      const us = m * 2.2;
      return {
        outputValue: `${us.toFixed(1)} μs`,
        outputNumeric: Number(us.toFixed(1)),
        outputUnit: 'μs lag Δt',
        secondaryOutput: `True mass flow ±0.10% accuracy directly independent of fluid ρ or P`,
        normalizedPrimary: normOf(m, 0, 100),
        observation: `Inlet vs outlet tube half-oscillations twist out of phase by ${us.toFixed(1)} μs proportionally to mass flow ṁ.`,
        curve: sweepCurve(0, 100, (x) => x * 2.2),
        xLabel: 'Mass Flow',
        xUnit: 'kg/min',
        yLabel: 'Phase Lag Δt',
        yUnit: 'μs',
      };
    },
  },
  'thermal-flow': {
    id: 'thermal-flow',
    title: 'King’s Law Constant-Temp Mass Flow / Anemometer',
    governingFormulaLatex: 'P = I^2 R_w = (A + B\\sqrt{\\dot{m}})\\,(T_w - T_g)',
    assumptions: 'CTA hot-wire/stinger held at constant ΔT = +40 °C above gas temperature.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Gas Mass Flow', unit: 'kg/h', min: 0.5, max: 200, step: 5, defaultValue: 50 },
    evaluate: (m) => {
      const calcMw = (mf: number) => (12 + 28 * Math.sqrt(mf)) * 1;
      const mw = calcMw(m);
      return {
        outputValue: `${mw.toFixed(0)} mW`,
        outputNumeric: Number(mw.toFixed(1)),
        outputUnit: 'mW heater power',
        secondaryOutput: `Highest sensitivity at ultra-low flare / purge velocities (√ṁ curvature)`,
        normalizedPrimary: normOf(m, 0.5, 200),
        observation: `Higher gas molecules sweep boundary heat faster, demanding ${mw.toFixed(0)} mW to hold ΔT = 40 °C.`,
        curve: sweepCurve(0.5, 200, calcMw),
        xLabel: 'Mass Flow',
        xUnit: 'kg/h',
        yLabel: 'Power mW',
        yUnit: 'mW',
      };
    },
  },
  'pitot-tube': {
    id: 'pitot-tube',
    title: 'Pitot-Static Dynamic Velocity Pressure',
    governingFormulaLatex: 'P_0 - P_s = \\frac{1}{2}\\,\\rho\\,v^2 \\implies v = \\sqrt{\\frac{2\\Delta P}{\\rho}}',
    assumptions: 'Ambient dry air ρ = 1.225 kg/m³ in HVAC/stack duct.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Air Velocity v', unit: 'm/s', min: 0, max: 60, step: 1, defaultValue: 22 },
    evaluate: (v) => {
      const pa = 0.5 * 1.225 * v * v;
      return {
        outputValue: `${pa.toFixed(0)} Pa`,
        outputNumeric: Number(pa.toFixed(1)),
        outputUnit: 'Pa (Dynamic)',
        secondaryOutput: `= ${(pa / 9.80665).toFixed(1)} mmH₂O differential`,
        normalizedPrimary: normOf(v, 0, 60),
        observation: `Zero-flow velocity stagnation adds ½ρv² = ${pa.toFixed(0)} Pa to nose tip port P₀ above wall static P_s.`,
        curve: sweepCurve(0, 60, (vel) => 0.5 * 1.225 * vel * vel),
        xLabel: 'Velocity',
        xUnit: 'm/s',
        yLabel: 'Dynamic ΔP',
        yUnit: 'Pa',
      };
    },
  },
  'oval-gear-pd': {
    id: 'oval-gear-pd',
    title: 'Positive Displacement Oval-Gear Pulse Output',
    governingFormulaLatex: 'Q = V_{\\text{swept}} \\cdot N, \\qquad f = K_{\\text{PD}} \\cdot Q',
    assumptions: 'Discrete pocket volume = 50 mL/rev (4 pulses/rev = 80 pulses/L); viscous lube oil.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Oil Flow Q', unit: 'L/min', min: 1, max: 80, step: 1, defaultValue: 24 },
    evaluate: (q) => {
      const hz = (q / 60) * 80;
      const rpm = (q * 1000) / 50;
      return {
        outputValue: `${hz.toFixed(1)} Hz`,
        outputNumeric: Number(hz.toFixed(1)),
        outputUnit: 'Hz',
        secondaryOutput: `Gear rotational rate = ${rpm.toFixed(0)} RPM`,
        normalizedPrimary: normOf(q, 1, 80),
        observation: `Every quarter turn traps and sweeps fixed pocket volume regardless of oil viscosity fluctuations.`,
        curve: sweepCurve(1, 80, (x) => (x / 60) * 80),
        xLabel: 'Flow',
        xUnit: 'L/min',
        yLabel: 'Hall Freq',
        yUnit: 'Hz',
      };
    },
  },

  // ======================= E. LEVEL & PROPERTIES =======================
  'float-mlg': {
    id: 'float-mlg',
    title: 'Magnetic Level Gauge Float Height & Flag Flip',
    governingFormulaLatex: 'h_{\\text{float}} = h_{\\text{liquid}} - \\text{submersion}(\\rho_{\\text{fluid}})',
    assumptions: '0–2000 mm vessel height, buoyant float tracks surface & flips magnetic flags.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Tank Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 58 },
    evaluate: (pct) => {
      const ma = 4 + (pct / 100) * 16;
      return {
        outputValue: `${(pct * 20).toFixed(0)} mm`,
        outputNumeric: pct * 20,
        outputUnit: 'mm Level',
        secondaryOutput: `Optional reed-chain transmitter output = ${ma.toFixed(2)} mA`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `Sealed SS float magnet flips flags red up to ${pct}% height cleanly without external power.`,
        curve: sweepCurve(0, 100, (x) => x * 20),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'Height mm',
        yUnit: 'mm',
      };
    },
  },
  displacer: {
    id: 'displacer',
    title: 'Archimedes Torque-Tube Buoyancy Level',
    governingFormulaLatex: 'F_{\\text{net}} = W_{\\text{dry}} - \\rho_{\\text{liq}}\\,g\\,A_{\\text{rod}}\\,h',
    assumptions: 'SG = 1.0 water covering 1.2 m displacer height; 4–20 mA linear Hall readout.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Immersion %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 45 },
    secondaryParam: { key: 'secondary', label: 'Liquid SG', unit: 'SG', min: 0.6, max: 1.5, step: 0.05, defaultValue: 1.0 },
    evaluate: (pct, sg) => {
      const buoyantN = (pct / 100) * 12 * sg;
      return {
        outputValue: `${buoyantN.toFixed(2)} N Lift`,
        outputNumeric: Number(buoyantN.toFixed(2)),
        outputUnit: 'N Buoyancy',
        secondaryOutput: `Note liquid SG density change directly scales output gain!`,
        normalizedPrimary: normOf(pct, 0, 100),
        normalizedSecondary: normOf(sg, 0.6, 1.5),
        observation: `Rising fluid lifts the displacer by ${buoyantN.toFixed(2)} N, unwinding torque tube cleanly.`,
        curve: sweepCurve(0, 100, (x) => (x / 100) * 12 * sg),
        xLabel: 'Immersion',
        xUnit: '%',
        yLabel: 'Buoyancy Lift',
        yUnit: 'N',
      };
    },
  },
  'dp-level': {
    id: 'dp-level',
    title: 'Pressurized Wet-Leg Hydrostatic DP Level',
    governingFormulaLatex: '\\Delta P = \\rho_{\\text{proc}}\\,g\\,h - \\rho_{\\text{seal}}\\,g\\,H_{\\text{wet}}',
    assumptions: '3.0 m wet condenser leg SG 1.0; process level 0–3.0 m (negative ΔP requires Zero Elevation!).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Tank Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 65 },
    evaluate: (pct) => {
      const kpa = ((pct / 100) * 3 - 3) * 9.80665;
      return {
        outputValue: `${kpa.toFixed(2)} kPa`,
        outputNumeric: Number(kpa.toFixed(2)),
        outputUnit: 'kPa (Wet-Leg)',
        secondaryOutput: `LRV (0%) = −29.42 kPa → URV (100%) = 0.00 kPa`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `Constant 3.0 m condensed wet-leg pushes HP/LP ports negative unless Zero Elevation LRV = −29.4 kPa is configured.`,
        curve: sweepCurve(0, 100, (x) => ((x / 100) * 3 - 3) * 9.80665),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'Measured ΔP',
        yUnit: 'kPa',
      };
    },
  },
  'cap-level': {
    id: 'cap-level',
    title: 'RF Dielectric Capacitance Level Probe',
    governingFormulaLatex: 'C_{\\text{total}} = C_{\\text{empty}} + k_{\\text{dielectric}}(\\varepsilon_r - 1)\\,h',
    assumptions: '2.0 m coaxial PTFE probe; secondary parameter adjusts liquid εr (Oil ≈ 2.2, Water ≈ 80).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Tank Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 50 },
    secondaryParam: { key: 'secondary', label: 'Dielectric εr', unit: '', min: 2, max: 80, step: 2, defaultValue: 40 },
    evaluate: (pct, eps) => {
      const pf = 45 + (pct / 100) * (eps > 10 ? 480 : 120);
      return {
        outputValue: `${pf.toFixed(1)} pF`,
        outputNumeric: Number(pf.toFixed(1)),
        outputUnit: 'pF',
        secondaryOutput: `Dry C₀ = 45 pF · Conductive/high-εr liquids bridge directly via PTFE sleeve`,
        normalizedPrimary: normOf(pct, 0, 100),
        normalizedSecondary: normOf(eps, 2, 80),
        observation: `Liquid replacing air around probe scales total probe capacitance linearly to ${pf.toFixed(1)} pF.`,
        curve: sweepCurve(0, 100, (x) => 45 + (x / 100) * (eps > 10 ? 480 : 120)),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'Capacitance',
        yUnit: 'pF',
      };
    },
  },
  'ultrasonic-level': {
    id: 'ultrasonic-level',
    title: 'Ultrasonic Echo Time-of-Flight Level',
    governingFormulaLatex: 'h = H_{\\text{tank}} - \\frac{c_{\\text{air}}\\cdot t_{\\text{TOF}}}{2}, \\quad c = 343\\,\\text{m/s}',
    assumptions: '5.0 m vessel height at 20 °C sound speed; watch deadband near horn face!',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Liquid Level h', unit: 'm', min: 0, max: 4.6, step: 0.1, defaultValue: 2.5 },
    evaluate: (h) => {
      const ms = ((2 * (5.0 - h)) / 343) * 1000;
      return {
        outputValue: `${ms.toFixed(2)} ms`,
        outputNumeric: Number(ms.toFixed(2)),
        outputUnit: 'ms TOF',
        secondaryOutput: `Ullage empty space = ${(5.0 - h).toFixed(2)} m above surface`,
        normalizedPrimary: normOf(h, 0, 4.6),
        observation: `Higher level shortens acoustic air round-trip delay to ${ms.toFixed(2)} ms.`,
        curve: sweepCurve(0, 4.6, (lv) => ((2 * (5.0 - lv)) / 343) * 1000),
        xLabel: 'Level h',
        xUnit: 'm',
        yLabel: 'Echo TOF',
        yUnit: 'ms',
      };
    },
  },
  'radar-level': {
    id: 'radar-level',
    title: '80 GHz FMCW Non-Contact Radar Beat Frequency',
    governingFormulaLatex: '\\Delta f = \\frac{2\\,d\\,B_{\\text{sweep}}}{c \\cdot T_{\\text{sweep}}}',
    assumptions: 'Speed of light c = 3×10⁸ m/s, 4 GHz FMCW chirp across 10.0 m tank height (vapor-immune!).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Tank Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 60 },
    evaluate: (pct) => {
      const dist = 10 * (1 - pct / 100);
      const khz = 2.67 * dist;
      return {
        outputValue: `${khz.toFixed(2)} kHz`,
        outputNumeric: Number(khz.toFixed(2)),
        outputUnit: 'kHz beat',
        secondaryOutput: `Reflects microwave pulse across ${dist.toFixed(2)} m vapor headspace accurately`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `FMCW chirp maps empty headspace into sharp FFT beat peak at ${khz.toFixed(2)} kHz unaffected by steam/dust.`,
        curve: sweepCurve(0, 100, (x) => 2.67 * (10 * (1 - x / 100))),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'FMCW Beat',
        yUnit: 'kHz',
      };
    },
  },
  'gwr-level': {
    id: 'gwr-level',
    title: 'Guided-Wave TDR Microwave Pulse Reflection',
    governingFormulaLatex: 'd = \\frac{c \\cdot t_{\\text{TDR}}}{2\\sqrt{\\varepsilon_{\\text{vapor}}}}',
    assumptions: '3.0 m stainless TDR probe; works in foam, turbulence, and liquid-liquid interfaces.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Liquid Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 40 },
    evaluate: (pct) => {
      const ns = ((2 * 3.0 * (1 - pct / 100)) / 0.3);
      return {
        outputValue: `${ns.toFixed(2)} ns`,
        outputNumeric: Number(ns.toFixed(2)),
        outputUnit: 'ns TDR echo',
        secondaryOutput: `Waveguide focuses RF pulse down probe, ignoring heavy tank internal baffles`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `Step change in dielectric constant at fluid surface reflects nanosecond pulse at ${ns.toFixed(2)} ns.`,
        curve: sweepCurve(0, 100, (x) => ((2 * 3.0 * (1 - x / 100)) / 0.3)),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'TDR Time',
        yUnit: 'ns',
      };
    },
  },
  'nuclear-level': {
    id: 'nuclear-level',
    title: 'Cs-137 Gamma Radiometric Beer Attenuation',
    governingFormulaLatex: 'I(h) = I_0\\,\\left[(1-f_h) + f_h e^{-\\mu\\,x_{\\text{liq}}}\\right]',
    assumptions: 'Educational linear scintillation rod response across 0–100% coker drum height (zero wetted penetration!).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Drum Level %', unit: '%', min: 0, max: 100, step: 2, defaultValue: 55 },
    evaluate: (pct) => {
      const cps = 12000 * (1 - 0.85 * (pct / 100));
      return {
        outputValue: `${cps.toFixed(0)} cps`,
        outputNumeric: cps,
        outputUnit: 'counts/sec',
        secondaryOutput: `Inverted trend: higher vessel mass absorbs more gamma photons → lower count rate!`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `Rising dense process medium blocks collimated Cs-137 rays, reducing detector pulses to ${cps.toFixed(0)} cps.`,
        curve: sweepCurve(0, 100, (x) => 12000 * (1 - 0.85 * (x / 100))),
        xLabel: 'Level %',
        xUnit: '%',
        yLabel: 'Gamma Rate',
        yUnit: 'cps',
      };
    },
  },
  'humidity-sensor': {
    id: 'humidity-sensor',
    title: 'Magnus-Tetens Dew Point & Polymer RH Capacitance',
    governingFormulaLatex: 'T_d = \\frac{243.04\\,\\gamma}{17.625 - \\gamma}, \\quad \\gamma = \\ln\\!\\left(\\frac{\\%\\text{RH}}{100}\\right) + \\frac{17.625\\,T}{243.04+T}',
    assumptions: 'Accurate Magnus condensation formula across 5–100% RH and 0–60 °C dry-bulb.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Relative Humidity', unit: '%RH', min: 5, max: 100, step: 2, defaultValue: 55 },
    secondaryParam: { key: 'secondary', label: 'Ambient Temp T', unit: '°C', min: 5, max: 60, step: 1, defaultValue: 25 },
    evaluate: (rh, tc) => {
      const calcTd = (r: number) => {
        const g = Math.log(r / 100) + (17.625 * tc) / (243.04 + tc);
        return (243.04 * g) / (17.625 - g);
      };
      const td = calcTd(rh);
      return {
        outputValue: `${td.toFixed(1)} °C Td`,
        outputNumeric: Number(td.toFixed(1)),
        outputUnit: '°C Dew Point',
        secondaryOutput: `Polymer dielectric C = ${(180 + rh * 0.42).toFixed(1)} pF`,
        normalizedPrimary: normOf(rh, 5, 100),
        normalizedSecondary: normOf(tc, 5, 60),
        observation: `At ${tc} °C & ${rh}% RH, chilled mirror fogs right at ${td.toFixed(1)} °C Dew Point.`,
        curve: sweepCurve(5, 100, calcTd),
        xLabel: 'Rel Humidity',
        xUnit: '%RH',
        yLabel: 'Dew Point Td',
        yUnit: '°C',
      };
    },
  },
  viscometer: {
    id: 'viscometer',
    title: 'Rotational Brookfield Spindle Torque',
    governingFormulaLatex: '\\tau = \\eta\\,\\dot{\\gamma} \\implies \\theta_{\\text{spring}} = K_{\\text{spindle}}\\,\\eta\\,\\omega',
    assumptions: 'Newtonian oil calibration at 30 RPM spindle speed across 50–1000 cP range.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Dynamic Viscosity η', unit: 'cP', min: 50, max: 1000, step: 20, defaultValue: 380 },
    evaluate: (eta) => {
      const pct = (eta / 1000) * 95;
      return {
        outputValue: `${pct.toFixed(1)} % Torque`,
        outputNumeric: Number(pct.toFixed(1)),
        outputUnit: '% Spring',
        secondaryOutput: `Ideal operational zone lies within 10–90% calibrated spring deflection`,
        normalizedPrimary: normOf(eta, 50, 1000),
        observation: `Higher fluid shear drag winds the calibrated beryllium-copper torsion spring to ${pct.toFixed(1)}%.`,
        curve: sweepCurve(50, 1000, (x) => (x / 1000) * 95),
        xLabel: 'Viscosity η',
        xUnit: 'cP',
        yLabel: 'Torque',
        yUnit: '%FS',
      };
    },
  },
  'density-meter': {
    id: 'density-meter',
    title: 'Oscillating U-Tube Resonant Period Density',
    governingFormulaLatex: '\\rho = A\\,\\tau^2 - B \\implies f_r = \\frac{1}{\\sqrt{c_1(\\rho + c_2)}}',
    assumptions: 'Precision borosilicate U-tube @ 20.00 °C measuring 0.65–1.50 g/cm³ liquids.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Liquid Density ρ', unit: 'g/cm³', min: 0.65, max: 1.5, step: 0.02, defaultValue: 1.0 },
    evaluate: (rho) => {
      const calcFreq = (d: number) => 520 / Math.sqrt(1 + 0.42 * d);
      const hz = calcFreq(rho);
      return {
        outputValue: `${hz.toFixed(1)} Hz`,
        outputNumeric: Number(hz.toFixed(1)),
        outputUnit: 'Hz Resonant',
        secondaryOutput: `Period τ = ${(1000 / hz).toFixed(3)} ms (higher fluid mass slows natural oscillation!)`,
        normalizedPrimary: normOf(rho, 0.65, 1.5),
        observation: `Adding denser liquid raises U-tube inertia, dropping natural resonance to ${hz.toFixed(1)} Hz.`,
        curve: sweepCurve(0.65, 1.5, calcFreq),
        xLabel: 'Density ρ',
        xUnit: 'g/cm³',
        yLabel: 'Freq f_r',
        yUnit: 'Hz',
      };
    },
  },

  // ======================= F. ELECTRICAL & BRIDGES =======================
  pmmc: {
    id: 'pmmc',
    title: 'PMMC Linear Current-to-Angle Deflection',
    governingFormulaLatex: 'T_d = N B A I = K_{\\text{spring}}\\theta \\implies \\theta = \\frac{N B A}{K}\\,I',
    assumptions: 'Permanent Alnico B + spring K produces uniform linear DC scale 0–100 mA.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'DC Current I', unit: 'mA', min: 0, max: 100, step: 2, defaultValue: 52 },
    evaluate: (i) => {
      const deg = (i / 100) * 110;
      return {
        outputValue: `${deg.toFixed(1)}°`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg deflection',
        secondaryOutput: `Measures strict DC AVERAGE value (reads zero on pure 50 Hz AC!)`,
        normalizedPrimary: normOf(i, 0, 100),
        observation: `Uniform radial pole shoes guarantee linear ${deg.toFixed(1)}° coil twist.`,
        curve: sweepCurve(0, 100, (x) => (x / 100) * 110),
        xLabel: 'Current I',
        xUnit: 'mA DC',
        yLabel: 'Deflection θ',
        yUnit: '°',
      };
    },
  },
  'moving-iron': {
    id: 'moving-iron',
    title: 'Moving-Iron Quadratic True-RMS Scale',
    governingFormulaLatex: 'T_d = \\frac{1}{2}\\,I^2\\,\\frac{dL}{d\\theta} \\implies \\theta \\propto I_{\\text{rms}}^2',
    assumptions: 'Ideal constant dL/dθ illustrating square-law cramping near zero and true-RMS AC/DC reading.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'RMS Current I', unit: 'A', min: 0, max: 50, step: 1, defaultValue: 32 },
    evaluate: (i) => {
      const deg = Math.pow(i / 50, 2) * 110;
      return {
        outputValue: `${deg.toFixed(1)}°`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg (θ ∝ I²)',
        secondaryOutput: `True-RMS response for both AC & DC (notice tight cramping below 15 A!)`,
        normalizedPrimary: normOf(i, 0, 50),
        observation: `Because torque scales with I², 50% current gives only 25% (${(110 * 0.25).toFixed(1)}°) raw vane deflection!`,
        curve: sweepCurve(0, 50, (x) => Math.pow(x / 50, 2) * 110),
        idealCurve: sweepCurve(0, 50, (x) => (x / 50) * 110),
        xLabel: 'Current RMS',
        xUnit: 'A',
        yLabel: 'Deflection θ',
        yUnit: '°',
      };
    },
  },
  wattmeter: {
    id: 'wattmeter',
    title: 'Electrodynamometer Single-Phase Real Power',
    governingFormulaLatex: 'W = V\\,I\\,\\cos\\phi, \\qquad \\theta \\propto \\left(\\frac{1}{T}\\int v\\,i\\,dt\\right)',
    assumptions: '240 Vrms line voltage, 0–40 A load, adjustable power factor cos φ (0.2–1.0).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Load Current I', unit: 'A', min: 0, max: 40, step: 1, defaultValue: 25 },
    secondaryParam: { key: 'secondary', label: 'Power Factor cos φ', unit: '', min: 0.2, max: 1.0, step: 0.05, defaultValue: 0.85 },
    evaluate: (i, pf) => {
      const kw = (240 * i * pf) / 1000;
      return {
        outputValue: `${kw.toFixed(2)} kW`,
        outputNumeric: Number(kw.toFixed(2)),
        outputUnit: 'kW Real Power',
        secondaryOutput: `Apparent S = ${((240 * i) / 1000).toFixed(2)} kVA · Phase φ = ${Math.round((Math.acos(pf) * 180) / Math.PI)}°`,
        normalizedPrimary: normOf(i, 0, 40),
        normalizedSecondary: normOf(pf, 0.2, 1.0),
        observation: `Moving voltage coil multiplies instantaneous magnetic fields cleanly, deflecting directly by real power ${kw.toFixed(2)} kW.`,
        curve: sweepCurve(0, 40, (x) => (240 * x * pf) / 1000),
        xLabel: 'Current',
        xUnit: 'A',
        yLabel: 'Real Power',
        yUnit: 'kW',
      };
    },
  },
  'energy-meter': {
    id: 'energy-meter',
    title: 'Single-Phase Induction Energy Meter Disc Speed',
    governingFormulaLatex: 'N_{\\text{disc}} \\propto P_{\\text{load}}, \\qquad \\text{Revs} = K_h\\,\\text{kWh}',
    assumptions: 'Meter constant K_h = 1200 rev/kWh, eddy-brake magnet sets steady-state rpm.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Active Load P', unit: 'kW', min: 0.2, max: 12, step: 0.2, defaultValue: 4.5 },
    evaluate: (kw) => {
      const rpm = (kw * 1200) / 60;
      return {
        outputValue: `${rpm.toFixed(1)} RPM`,
        outputNumeric: Number(rpm.toFixed(1)),
        outputUnit: 'RPM Disc Speed',
        secondaryOutput: `Exact shunt 90° lag ensures zero creep at no-load`,
        normalizedPrimary: normOf(kw, 0.2, 12),
        observation: `Eddy braking torque opposes electromagnetic driving torque so aluminum disc spins steadily at ${rpm.toFixed(1)} RPM.`,
        curve: sweepCurve(0.2, 12, (p) => (p * 1200) / 60),
        xLabel: 'Load Power',
        xUnit: 'kW',
        yLabel: 'Disc Speed',
        yUnit: 'RPM',
      };
    },
  },
  dmm: {
    id: 'dmm',
    title: 'True-RMS 4½-Digit Digital Multimeter',
    governingFormulaLatex: 'V_{\\text{RMS}} = \\sqrt{\\frac{1}{T}\\int_0^T v^2(t)\\,dt}',
    assumptions: 'Dual-slope / Sigma-Delta ADC reading selected Volts, Loop mA, or Ω.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Test Magnitude', unit: 'Units', min: 0, max: 24, step: 0.5, defaultValue: 12.0 },
    secondaryParam: { key: 'secondary', label: 'Selector (0=V, 1=mA, 2=kΩ)', unit: '', min: 0, max: 2, step: 1, defaultValue: 0 },
    evaluate: (val, mode) => {
      const label = mode === 0 ? `${val.toFixed(2)} V` : mode === 1 ? `${((val / 24) * 20).toFixed(2)} mA` : `${(val * 0.5).toFixed(2)} kΩ`;
      return {
        outputValue: label,
        outputNumeric: val,
        outputUnit: 'Display Readout',
        secondaryOutput: `Input impedance 10 MΩ on Volts · Dual-slope rejects 50/60 Hz line hum`,
        normalizedPrimary: normOf(val, 0, 24),
        normalizedSecondary: mode / 2,
        observation: `Rotary range switch routes test jacks cleanly to True-RMS converter & auto-ranging ADC.`,
        curve: sweepCurve(0, 24, (x) => x),
        xLabel: 'Input',
        xUnit: 'V / scale',
        yLabel: 'Meter Display',
        yUnit: 'Counts',
      };
    },
  },
  'cro-crt': {
    id: 'cro-crt',
    title: 'CRT Oscilloscope Lissajous Frequency & Phase',
    governingFormulaLatex: '\\sin\\phi = \\frac{Y_{\\text{intercept}}}{Y_{\\max}}, \\qquad \\frac{f_y}{f_x} = \\frac{N_{\\text{horiz tangent}}}{N_{\\text{vert tangent}}}',
    assumptions: 'Equal-amplitude X-Y deflection plates displaying harmonic Lissajous contours on phosphor.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Frequency Ratio fy/fx', unit: ': 1', min: 1, max: 4, step: 1, defaultValue: 1 },
    secondaryParam: { key: 'secondary', label: 'Phase Shift φ', unit: 'deg', min: 0, max: 180, step: 15, defaultValue: 45 },
    evaluate: (ratio, phi) => {
      const sinPhi = Math.sin((phi * Math.PI) / 180);
      return {
        outputValue: `sin φ = ${sinPhi.toFixed(3)}`,
        outputNumeric: Number(sinPhi.toFixed(3)),
        outputUnit: `Ratio ${ratio}:1`,
        secondaryOutput: `Trace crosses Y-axis at ±${(sinPhi * 100).toFixed(1)}% amplitude (${phi}° phase)`,
        normalizedPrimary: normOf(ratio, 1, 4),
        normalizedSecondary: normOf(phi, 0, 180),
        observation: `At φ = ${phi}° and f_y/f_x = ${ratio}:1, electron beam paints a closed Lissajous loop on CRT screen.`,
        curve: sweepCurve(0, 180, (a) => Math.sin((a * Math.PI) / 180)),
        xLabel: 'Phase Angle',
        xUnit: 'deg',
        yLabel: 'Y-Intercept / Ymax',
        yUnit: 'Ratio',
      };
    },
  },
  'phase-meter': {
    id: 'phase-meter',
    title: 'Crossed-Coil Power Factor & Phase Angle',
    governingFormulaLatex: '\\theta_{\\text{meter}} = \\phi = \\arccos(\\text{PF})',
    assumptions: '3-phase / 1-phase balanced load spanning −60° Lead to +60° Lag.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Phase Angle φ', unit: 'deg', min: -60, max: 60, step: 5, defaultValue: 30 },
    evaluate: (phi) => {
      const pf = Math.cos((phi * Math.PI) / 180);
      const tag = phi > 0 ? 'Lagging (Inductive)' : phi < 0 ? 'Leading (Capacitive)' : 'Unity PF';
      return {
        outputValue: `${pf.toFixed(3)} ${tag}`,
        outputNumeric: Number(pf.toFixed(3)),
        outputUnit: 'cos φ',
        secondaryOutput: `Crossed voltage coils rotate strictly by angle between V and I (independent of load amplitude!)`,
        normalizedPrimary: normOf(phi, -60, 60),
        observation: `Phase angle ${phi}° places PF pointer at ${pf.toFixed(3)} (${tag}).`,
        curve: sweepCurve(-60, 60, (a) => Math.cos((a * Math.PI) / 180)),
        xLabel: 'Phase φ',
        xUnit: 'deg',
        yLabel: 'Power Factor',
        yUnit: 'cos φ',
      };
    },
  },
  megger: {
    id: 'megger',
    title: 'HV Megger Logarithmic Insulation Ohmmeter',
    governingFormulaLatex: '\\frac{I_{\\text{deflect}}}{I_{\\text{control}}} \\propto \\frac{1}{R_{\\text{ins}}}\\implies \\theta = f(\\log R_{\\text{ins}})',
    assumptions: '1000 V DC generator; logarithmic compression from 1 MΩ up to 1000 MΩ.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Insulation R (log10 MΩ)', unit: 'log MΩ', min: 0, max: 3, step: 0.1, defaultValue: 1.8 },
    evaluate: (logR) => {
      const mohm = Math.pow(10, logR);
      return {
        outputValue: `${mohm.toFixed(1)} MΩ`,
        outputNumeric: Number(mohm.toFixed(1)),
        outputUnit: 'MΩ @ 1 kV',
        secondaryOutput: `Leakage current = ${(1000 / mohm).toFixed(2)} μA · No restoring spring needed!`,
        normalizedPrimary: normOf(logR, 0, 3),
        observation: `Opposing crossed coils divide leakage against voltage directly—making reading independent of hand crank RPM!`,
        curve: sweepCurve(0, 3, (lr) => (lr / 3) * 100),
        xLabel: 'log10(MΩ)',
        xUnit: 'Decade',
        yLabel: 'Scale Deflect',
        yUnit: '%',
      };
    },
  },
  fluxmeter: {
    id: 'fluxmeter',
    title: 'Grassot Ballistic Flux Linkage Meter',
    governingFormulaLatex: '\\Delta\\Phi = \\frac{G_{\\text{flux}}}{N}\\,\\Delta\\theta \\quad (\\text{mWb-turns})',
    assumptions: 'Zero restoring spring; search coil N = 50 turns in test pole gap.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Flux Change ΔΦ', unit: 'mWb', min: 0, max: 20, step: 0.5, defaultValue: 8.5 },
    evaluate: (phi) => {
      const mwbTurns = phi * 50;
      return {
        outputValue: `${mwbTurns.toFixed(0)} mWb·turns`,
        outputNumeric: mwbTurns,
        outputUnit: 'mWb-turns',
        secondaryOutput: `Heavy electromagnetic damping lets pointer settle at exact integral ∫e·dt regardless of pull speed`,
        normalizedPrimary: normOf(phi, 0, 20),
        observation: `Pulling search coil snaps total linkage ${mwbTurns.toFixed(0)} mWb-turns and locks needle proportionally.`,
        curve: sweepCurve(0, 20, (x) => x * 50),
        xLabel: 'Flux ΔΦ',
        xUnit: 'mWb',
        yLabel: 'Linkage',
        yUnit: 'mWb-t',
      };
    },
  },
  ct: {
    id: 'ct',
    title: 'Bar-Primary Current Transformer Burden Check',
    governingFormulaLatex: 'I_2 = \\frac{I_1}{K_n}, \\qquad V_{\\text{burden}} = I_2 \\cdot Z_B',
    assumptions: '400:5 A protection/metering CT with adjustable secondary burden Z_B.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Primary Bus I₁', unit: 'A', min: 20, max: 400, step: 10, defaultValue: 240 },
    secondaryParam: { key: 'secondary', label: 'Burden R_b', unit: 'Ω', min: 0.2, max: 2.5, step: 0.1, defaultValue: 0.6 },
    evaluate: (i1, rb) => {
      const i2 = i1 / 80;
      const va = i2 * i2 * rb;
      return {
        outputValue: `${i2.toFixed(2)} A`,
        outputNumeric: Number(i2.toFixed(2)),
        outputUnit: 'A Secondary',
        secondaryOutput: `Burden = ${va.toFixed(1)} VA (${(i2 * rb).toFixed(2)} V drop) · NEVER open-circuit S1-S2 live!`,
        normalizedPrimary: normOf(i1, 20, 400),
        normalizedSecondary: normOf(rb, 0.2, 2.5),
        observation: `Current transforms down by 80:1 to ${i2.toFixed(2)} A; keeping low burden prevents core flux saturation.`,
        curve: sweepCurve(20, 400, (x) => x / 80),
        xLabel: 'Primary I1',
        xUnit: 'A',
        yLabel: 'Secondary I2',
        yUnit: 'A',
      };
    },
  },
  pt: {
    id: 'pt',
    title: 'High-Voltage Potential Transformer Step-Down',
    governingFormulaLatex: 'V_2 = \\frac{V_1}{K_v}, \\qquad K_v = \\frac{11000}{110} = 100',
    assumptions: '11 kV / 110 V metering VT rated 50 VA; secondary always lightly loaded (~MΩ relay/voltmeter).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'HV Line V₁', unit: 'kV', min: 2, max: 13.2, step: 0.4, defaultValue: 11.0 },
    evaluate: (kv) => {
      const v2 = (kv * 1000) / 100;
      return {
        outputValue: `${v2.toFixed(1)} V`,
        outputNumeric: Number(v2.toFixed(1)),
        outputUnit: 'V Secondary',
        secondaryOutput: `NEVER short-circuit PT secondary (triggers dead-short transformer burnout!)`,
        normalizedPrimary: normOf(kv, 2, 13.2),
        observation: `Steps 11 kV grid voltage cleanly down to relay-safe ${v2.toFixed(1)} V.`,
        curve: sweepCurve(2, 13.2, (x) => x * 10),
        xLabel: 'Primary HV',
        xUnit: 'kV',
        yLabel: 'Secondary V2',
        yUnit: 'V',
      };
    },
  },
  wheatstone: {
    id: 'wheatstone',
    title: 'Four-Arm DC Wheatstone Null Detector',
    governingFormulaLatex: 'V_g = V_{\\text{exc}}\\left(\\frac{R_x}{R_3 + R_x} - \\frac{R_2}{R_1 + R_2}\\right)',
    assumptions: 'Equal ratio arms R₁ = R₂ = 100 Ω, 10 V excitation; slide Decade R₃ to find V_g = 0 null!',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Unknown Rx', unit: 'Ω', min: 80, max: 180, step: 1, defaultValue: 120 },
    secondaryParam: { key: 'secondary', label: 'Variable Decade R₃', unit: 'Ω', min: 80, max: 180, step: 1, defaultValue: 120 },
    evaluate: (rx, r3) => {
      const calcVg = (x: number) => 10 * (x / (r3 + x) - 0.5);
      const vg = calcVg(rx);
      return {
        outputValue: `${vg >= 0 ? '+' : ''}${(vg * 1000).toFixed(1)} mV`,
        outputNumeric: Number((vg * 1000).toFixed(1)),
        outputUnit: 'mV Galvanometer',
        secondaryOutput: Math.abs(vg) < 0.005 ? 'BALANCED NULL (Rx = R3)! Zero current drawn!' : `Adjust R₃ to ${rx} Ω to zero the needle`,
        normalizedPrimary: normOf(rx, 80, 180),
        normalizedSecondary: normOf(r3, 80, 180),
        observation: Math.abs(vg) < 0.005 ? 'Bridge achieved exact null (I_g = 0): reading independent of battery voltage drift!' : `Bridge imbalance of ${(vg * 1000).toFixed(1)} mV deflects central Galvanometer needle.`,
        curve: sweepCurve(80, 180, (x) => calcVg(x) * 1000),
        xLabel: 'Unknown Rx',
        xUnit: 'Ω',
        yLabel: 'Unbalance Vg',
        yUnit: 'mV',
      };
    },
  },
  'kelvin-double': {
    id: 'kelvin-double',
    title: 'Kelvin Double Bridge Milliohm Lead Cancellation',
    governingFormulaLatex: 'R_x = \\frac{P}{Q} R_s \\quad \\text{when } \\frac{P}{Q} = \\frac{p}{q} \\text{ cancels yoke } r!',
    assumptions: 'Standard shunt R_s = 10.0 mΩ, matching inner/outer ratio P/Q = p/q.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Test Bar Rx', unit: 'mΩ', min: 1, max: 100, step: 1, defaultValue: 25 },
    secondaryParam: { key: 'secondary', label: 'Dial S = (P/Q)·10', unit: 'mΩ', min: 1, max: 100, step: 1, defaultValue: 25 },
    evaluate: (rx, dial) => {
      const uv = (rx - dial) * 45;
      return {
        outputValue: `${uv >= 0 ? '+' : ''}${uv.toFixed(0)} μV`,
        outputNumeric: uv,
        outputUnit: 'μV Null',
        secondaryOutput: Math.abs(uv) < 10 ? '4-Terminal Null! Contact & yoke resistance cancelled!' : 'Tune outer/inner gang ratio to zero μV',
        normalizedPrimary: normOf(rx, 1, 100),
        normalizedSecondary: normOf(dial, 1, 100),
        observation: `Eliminates milliohm binding-post & interconnecting lead errors on heavy copper busbars.`,
        curve: sweepCurve(1, 100, (x) => (x - dial) * 45),
        xLabel: 'Unknown Rx',
        xUnit: 'mΩ',
        yLabel: 'Galvo μV',
        yUnit: 'μV',
      };
    },
  },
  'ac-bridge': {
    id: 'ac-bridge',
    title: 'AC Inductance & Q Bridge (Maxwell / Hay / Owen / Anderson)',
    governingFormulaLatex: 'L_x = R_2 R_3 C_4 \\quad (\\text{Maxwell: } Q = \\omega C_4 R_4)',
    assumptions: 'Mode 0=Maxwell (medium Q 1-10), 1=Hay (High Q>10), 2=Owen, 3=Anderson; 1 kHz.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Coil Inductance Lx', unit: 'mH', min: 5, max: 200, step: 5, defaultValue: 50 },
    secondaryParam: { key: 'secondary', label: 'Bridge Mode (0-3)', unit: '', min: 0, max: 3, step: 1, defaultValue: 0 },
    evaluate: (lx, mode) => {
      const names = ['Maxwell-Wien (Medium Q)', 'Hay (High Q > 10)', 'Owen (Wide L)', 'Anderson (Low Q < 1)'];
      const c4uf = (lx * 1e-3 / (1000 * 100)) * 1e6;
      return {
        outputValue: `${c4uf.toFixed(3)} μF`,
        outputNumeric: Number(c4uf.toFixed(3)),
        outputUnit: 'μF Standard C4',
        secondaryOutput: `Selected topology: ${names[mode] || names[0]} · Rx solved orthogonally`,
        normalizedPrimary: normOf(lx, 5, 200),
        normalizedSecondary: normOf(mode, 0, 3),
        observation: `Uses clean lossless standard capacitor C₄ to measure unknown iron/air inductor ${lx} mH at 1 kHz.`,
        curve: sweepCurve(5, 200, (x) => (x * 1e-3 / 1e5) * 1e6),
        xLabel: 'Inductance Lx',
        xUnit: 'mH',
        yLabel: 'Balance C4',
        yUnit: 'μF',
      };
    },
  },
  'schering-wien': {
    id: 'schering-wien',
    title: 'Schering HV Capacitance & Wien Frequency Bridge',
    governingFormulaLatex: '\\tan\\delta = \\omega C_4 R_4, \\qquad f_{\\text{Wien}} = \\frac{1}{2\\pi R C}',
    assumptions: 'HV dielectric loss measurement @ 50 Hz (secondary adjusts Wien R kΩ RC balance).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Dielectric Loss tan δ', unit: '', min: 0.001, max: 0.05, step: 0.002, defaultValue: 0.012 },
    secondaryParam: { key: 'secondary', label: 'Wien R Tuning', unit: 'kΩ', min: 1, max: 20, step: 0.5, defaultValue: 5 },
    evaluate: (tand, rk) => {
      const wf = 1 / (2 * Math.PI * (rk * 1000) * 10e-9);
      return {
        outputValue: `tan δ = ${tand.toFixed(3)}`,
        outputNumeric: Number((tand * 100).toFixed(2)),
        outputUnit: `(${(tand * 100).toFixed(2)} % PF)`,
        secondaryOutput: `Wien Null Frequency @ 10 nF = ${wf.toFixed(0)} Hz`,
        normalizedPrimary: normOf(tand, 0.001, 0.05),
        normalizedSecondary: normOf(rk, 1, 20),
        observation: `Low-voltage arm dial measures insulation moisture dissipation tan δ safely inside guarded Wagner-earth cage.`,
        curve: sweepCurve(1, 20, (r) => 1 / (2 * Math.PI * r * 1000 * 10e-9)),
        xLabel: 'Wien R',
        xUnit: 'kΩ',
        yLabel: 'Wien Freq',
        yUnit: 'Hz',
      };
    },
  },

  // ======================= G. ANALYTICAL & OPTICAL =======================
  'uv-vis': {
    id: 'uv-vis',
    title: 'Double-Beam UV-Vis Beer-Lambert Spectroscopy',
    governingFormulaLatex: 'A = \\varepsilon\\,b\\,c = -\\log_{10}(T), \\qquad \\%T = 100\\cdot 10^{-A}',
    assumptions: 'Educational Gaussian chromophore band peaking @ 510 nm, path b = 1.0 cm.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Grating Wavelength λ', unit: 'nm', min: 220, max: 750, step: 5, defaultValue: 510 },
    secondaryParam: { key: 'secondary', label: 'Sample Conc c', unit: 'mM', min: 0.05, max: 2.0, step: 0.05, defaultValue: 0.5 },
    evaluate: (lam, c) => {
      const epsBand = (l: number) => 1.8 * Math.exp(-Math.pow((l - 510) / 55, 2));
      const abs = epsBand(lam) * 1.0 * c;
      const pctT = 100 * Math.pow(10, -abs);
      return {
        outputValue: `A = ${abs.toFixed(3)}`,
        outputNumeric: Number(abs.toFixed(3)),
        outputUnit: `(${pctT.toFixed(1)} %T)`,
        secondaryOutput: `Grating disperses ${lam} nm light; double-beam chopper cancels lamp drift`,
        normalizedPrimary: normOf(lam, 220, 750),
        normalizedSecondary: normOf(c, 0.05, 2.0),
        observation: `Sample absorbs ${(100 - pctT).toFixed(1)}% of ${lam} nm monochromatic beam through cuvette!`,
        curve: sweepCurve(220, 750, (l) => epsBand(l) * c),
        xLabel: 'Wavelength λ',
        xUnit: 'nm',
        yLabel: 'Absorbance A',
        yUnit: 'AU',
      };
    },
  },
  colorimeter: {
    id: 'colorimeter',
    title: 'Single-Beam Filter Colorimeter Beer-Lambert Law',
    governingFormulaLatex: 'A = \\log_{10}\\left(\\frac{I_0}{I}\\right) = k\\cdot c',
    assumptions: 'Matched green interference filter with b = 1 cm glass test tube.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Solute Conc c', unit: 'mg/L', min: 0, max: 50, step: 1, defaultValue: 18 },
    evaluate: (c) => {
      const abs = c * 0.035;
      const pctT = 100 * Math.pow(10, -abs);
      return {
        outputValue: `${pctT.toFixed(1)} %T`,
        outputNumeric: Number(pctT.toFixed(1)),
        outputUnit: `(A = ${abs.toFixed(2)})`,
        secondaryOutput: `Must re-blank single cuvette with distilled solvent prior to sample`,
        normalizedPrimary: normOf(c, 0, 50),
        observation: `Higher dye concentration exponentially reduces photodiode current to ${pctT.toFixed(1)}% T.`,
        curve: sweepCurve(0, 50, (x) => 100 * Math.pow(10, -x * 0.035)),
        xLabel: 'Concentration',
        xUnit: 'mg/L',
        yLabel: 'Transmittance',
        yUnit: '%T',
      };
    },
  },
  ftir: {
    id: 'ftir',
    title: 'Michelson Interferometer Optical Path Difference (FTIR)',
    governingFormulaLatex: 'I(\\delta) = I_0\\,\\left[1 + \\cos\\left(2\\pi\\tilde{\\nu}\\delta\\right)\\right]',
    assumptions: 'Educational monochromatic IR laser calibration fringe (Fellgett multiplex FFT principle).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Mirror OPD Shift δ', unit: 'μm', min: 0, max: 12, step: 0.2, defaultValue: 3.0 },
    evaluate: (d) => {
      const calcI = (opd: number) => 0.5 * (1 + Math.cos(2 * Math.PI * 0.35 * opd));
      const inten = calcI(d);
      return {
        outputValue: `${(inten * 100).toFixed(0)} % I`,
        outputNumeric: Number((inten * 100).toFixed(1)),
        outputUnit: '% Interferogram',
        secondaryOutput: `Zero Path Difference (δ = 0) creates constructive Centerburst peak across ALL wavelengths!`,
        normalizedPrimary: normOf(d, 0, 12),
        observation: `Moving scan mirror modulates detector intensity cosinusoidally for simultaneous FFT wavenumber decoding.`,
        curve: sweepCurve(0, 12, calcI),
        xLabel: 'Mirror OPD δ',
        xUnit: 'μm',
        yLabel: 'Detector Sig',
        yUnit: 'Rel',
      };
    },
  },
  'flame-aas': {
    id: 'flame-aas',
    title: 'Atomic Absorption (AAS) Trace Metal Resonance',
    governingFormulaLatex: 'A_{\\text{AAS}} = k_{\\text{atom}}\\cdot C_{\\text{ppm}}',
    assumptions: 'Cu Hollow Cathode Lamp @ 324.8 nm through air-acetylene slot burner (0–10 ppm).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Metal Concentration', unit: 'ppm', min: 0, max: 10, step: 0.25, defaultValue: 4.0 },
    evaluate: (ppm) => {
      const abs = ppm * 0.085;
      return {
        outputValue: `A = ${abs.toFixed(3)}`,
        outputNumeric: Number(abs.toFixed(3)),
        outputUnit: 'AU',
        secondaryOutput: `Narrow HCL emission prevents spectral interference from co-existing matrix ions`,
        normalizedPrimary: normOf(ppm, 0, 10),
        observation: `Ground-state Copper atoms vaporized in flame absorb resonant HCL beam proportionally to ${abs.toFixed(3)} AU.`,
        curve: sweepCurve(0, 10, (x) => x * 0.085),
        xLabel: 'Sample ppm',
        xUnit: 'ppm',
        yLabel: 'Absorption A',
        yUnit: 'AU',
      };
    },
  },
  chromatography: {
    id: 'chromatography',
    title: 'Gas Chromatography Oven Temperature Elution',
    governingFormulaLatex: 't_R \\approx t_0 + k_0\\,\\exp\\!\\left(\\frac{\\Delta H_s}{R T_{\\text{oven}}}\\right)',
    assumptions: 'Educational capillary column retention & Gaussian peak separation model (100–280 °C oven).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Oven Temperature', unit: '°C', min: 80, max: 280, step: 5, defaultValue: 160 },
    evaluate: (t) => {
      const tr = 1.2 + 12 * Math.exp(-(t - 80) / 75);
      return {
        outputValue: `t_R = ${tr.toFixed(2)} min`,
        outputNumeric: Number(tr.toFixed(2)),
        outputUnit: 'min elution',
        secondaryOutput: `Raising oven temperature speeds heavy hydrocarbon volatilization & sharpens peaks`,
        normalizedPrimary: normOf(t, 80, 280),
        observation: `Higher column oven temperature accelerates analyte vapor pressure, cutting retention time to ${tr.toFixed(2)} min.`,
        curve: sweepCurve(80, 280, (tc) => 1.2 + 12 * Math.exp(-(tc - 80) / 75)),
        xLabel: 'Oven Temp',
        xUnit: '°C',
        yLabel: 'Retention tR',
        yUnit: 'min',
      };
    },
  },
  'hplc-ic': {
    id: 'hplc-ic',
    title: 'HPLC / Ion Chromatography Mobile-Phase Flow & ΔP',
    governingFormulaLatex: '\\Delta P \\propto \\frac{\\eta\\,L\\,F}{d_p^2}',
    assumptions: 'C18 4.6×150 mm microparticle column; Darcy pressure scales linearly with flow mL/min.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Mobile Flow Rate', unit: 'mL/min', min: 0.2, max: 3.0, step: 0.1, defaultValue: 1.2 },
    evaluate: (f) => {
      const bar = f * 125;
      const tr = 8.4 / f;
      return {
        outputValue: `${bar.toFixed(0)} bar`,
        outputNumeric: Number(bar.toFixed(0)),
        outputUnit: 'bar Backpressure',
        secondaryOutput: `Elution time t_R ≈ ${tr.toFixed(1)} min`,
        normalizedPrimary: normOf(f, 0.2, 3.0),
        observation: `Sub-5 μm packed silica bed requires ${bar.toFixed(0)} bar high-pressure dual-piston pumping.`,
        curve: sweepCurve(0.2, 3.0, (x) => x * 125),
        xLabel: 'Flow Rate',
        xUnit: 'mL/min',
        yLabel: 'Pressure',
        yUnit: 'bar',
      };
    },
  },
  'mass-spec': {
    id: 'mass-spec',
    title: 'Quadrupole Mass Spectrometer m/z Ion Filter',
    governingFormulaLatex: '\\frac{m}{z} \\propto \\frac{V_{\\text{RF}}}{\\omega^2\\,r_0^2}',
    assumptions: 'Educational EI spectrum scanning CO₂ (m/z 44), N₂ (28), O₂ (32) peaks across 10–60 Da.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Scanned m/z Ratio', unit: 'Da', min: 15, max: 60, step: 1, defaultValue: 44 },
    evaluate: (mz) => {
      const calcSig = (x: number) =>
        100 * Math.exp(-Math.pow((x - 28) / 1.5, 2)) +
        45 * Math.exp(-Math.pow((x - 32) / 1.5, 2)) +
        85 * Math.exp(-Math.pow((x - 44) / 1.5, 2));
      const sig = calcSig(mz);
      return {
        outputValue: `${sig.toFixed(0)} % Ion Signal`,
        outputNumeric: Number(sig.toFixed(1)),
        outputUnit: `at m/z = ${mz}`,
        secondaryOutput: `Quad peaks visible at m/z 28 (N₂), 32 (O₂), 44 (CO₂)`,
        normalizedPrimary: normOf(mz, 15, 60),
        observation: sig > 30 ? `Mathieu stability locks resonant ions at m/z = ${mz} onto EM collector!` : `Non-resonant ions collide off quadrupole rods inside high vacuum.`,
        curve: sweepCurve(15, 60, calcSig, 45),
        xLabel: 'Mass/Charge',
        xUnit: 'm/z',
        yLabel: 'Ion Intensity',
        yUnit: '%',
      };
    },
  },
  ph: {
    id: 'ph',
    title: 'Nernst Glass Electrode pH Potential & ATC',
    governingFormulaLatex: 'E = E_0 - \\frac{2.3026\\,R\\,T_K}{F}\\,(\\text{pH} - 7)',
    assumptions: 'Ideal pH 7.00 zero-asymmetry electrode; slope scales linearly with Kelvin temperature!',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Solution pH', unit: 'pH', min: 0, max: 14, step: 0.2, defaultValue: 4.5 },
    secondaryParam: { key: 'secondary', label: 'Sample Temp (ATC)', unit: '°C', min: 5, max: 85, step: 5, defaultValue: 25 },
    evaluate: (phVal, tc) => {
      const slope = 0.19842 * (tc + 273.15); // mV/pH
      const mv = -slope * (phVal - 7.0);
      return {
        outputValue: `${mv >= 0 ? '+' : ''}${mv.toFixed(1)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV DC',
        secondaryOutput: `Nernst slope @ ${tc}°C = ${slope.toFixed(2)} mV/pH (requires >10¹² Ω electrometer)`,
        normalizedPrimary: normOf(phVal, 0, 14),
        normalizedSecondary: normOf(tc, 5, 85),
        observation: `Acidic pH < 7 swings bulb boundary positive (+${slope.toFixed(1)} mV per pH unit below neutral).`,
        curve: sweepCurve(0, 14, (p) => -slope * (p - 7)),
        xLabel: 'Solution pH',
        xUnit: 'pH',
        yLabel: 'Cell EMF',
        yUnit: 'mV',
      };
    },
  },
  conductivity: {
    id: 'conductivity',
    title: 'Electrolytic & Toroidal Conductivity Measurement',
    governingFormulaLatex: '\\kappa = G \\cdot K_{\\text{cell}}, \\qquad I_{\\text{toroid}} \\propto \\kappa\\,V_{\\text{drive}}',
    assumptions: 'Inductive toroidal PEEK probe measuring fouling industrial brine 1–200 mS/cm.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Conductivity κ', unit: 'mS/cm', min: 1, max: 200, step: 5, defaultValue: 65 },
    evaluate: (k) => {
      const ma = 4 + (k / 200) * 16;
      return {
        outputValue: `${ma.toFixed(2)} mA`,
        outputNumeric: Number(ma.toFixed(2)),
        outputUnit: 'mA Loop (4-20)',
        secondaryOutput: `Induced fluid ring couples magnetic flux linearly without metal electrode polarization`,
        normalizedPrimary: normOf(k, 1, 200),
        observation: `Higher dissolved ion mobility links the drive and sense toroids inductively to output ${ma.toFixed(2)} mA.`,
        curve: sweepCurve(1, 200, (x) => 4 + (x / 200) * 16),
        xLabel: 'Conductivity',
        xUnit: 'mS/cm',
        yLabel: 'Transmitter mA',
        yUnit: 'mA',
      };
    },
  },
  'dissolved-oxygen': {
    id: 'dissolved-oxygen',
    title: 'Clark Polarographic Dissolved Oxygen Current',
    governingFormulaLatex: 'I_d = \\frac{4 F A\\,P_{\\text{O}_2}}{\\delta_{\\text{mem}}}\\,[\\text{DO}]',
    assumptions: 'Pt/Au cathode biased −0.7 V vs Ag/AgCl behind 25 μm PTFE membrane @ 20 °C.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Dissolved O₂', unit: 'mg/L', min: 0, max: 20, step: 0.5, defaultValue: 8.2 },
    evaluate: (doVal) => {
      const ua = doVal * 1.85;
      return {
        outputValue: `${ua.toFixed(1)} μA`,
        outputNumeric: Number(ua.toFixed(1)),
        outputUnit: 'μA Polarographic',
        secondaryOutput: `Requires minimum flow velocity across PTFE tip to avoid stagnant O₂ depletion`,
        normalizedPrimary: normOf(doVal, 0, 20),
        observation: `Oxygen diffusing through the PTFE cap undergoes 4-electron reduction, yielding ${ua.toFixed(1)} μA current.`,
        curve: sweepCurve(0, 20, (x) => x * 1.85),
        xLabel: 'Dissolved O2',
        xUnit: 'mg/L',
        yLabel: 'Reduction Current',
        yUnit: 'μA',
      };
    },
  },
  turbidity: {
    id: 'turbidity',
    title: '90° Nephelometric Light Scattering Turbidity',
    governingFormulaLatex: 'I_{90^\\circ} \\approx k\\cdot \\text{NTU}\\cdot e^{-\\mu\\cdot\\text{NTU}}',
    assumptions: 'ISO 7027 860 nm NIR LED nephelometer from 0–400 NTU (roll-off from multiple scatter above ~200 NTU).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Suspended NTU', unit: 'NTU', min: 0, max: 400, step: 10, defaultValue: 90 },
    evaluate: (ntu) => {
      const calcMv = (n: number) => 4.2 * n * Math.exp(-n / 650);
      const mv = calcMv(ntu);
      return {
        outputValue: `${mv.toFixed(0)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV (90° Scatter)',
        secondaryOutput: `Ratio mode compares 90° scattered signal against 0° transmitted beam`,
        normalizedPrimary: normOf(ntu, 0, 400),
        observation: `Particulates scatter 860 nm light orthogonally into 90° silicon photodiode (${mv.toFixed(0)} mV).`,
        curve: sweepCurve(0, 400, calcMv),
        xLabel: 'Turbidity',
        xUnit: 'NTU',
        yLabel: '90° Detector',
        yUnit: 'mV',
      };
    },
  },
  'oxygen-analyzers': {
    id: 'oxygen-analyzers',
    title: 'Paramagnetic Dumbbell Susceptibility O₂',
    governingFormulaLatex: '\\tau_{\\text{mag}} \\propto \\chi_{\\text{O}_2}\\,[\\text{O}_2] \\implies I_{\\text{restore}} = K\\cdot \\%\\text{O}_2',
    assumptions: 'Pauling torque-balance magnetodynamic cell, 0–25% O₂ ambient/flue span.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Oxygen Volume %', unit: '% O₂', min: 0, max: 25, step: 0.5, defaultValue: 20.9 },
    evaluate: (o2) => {
      const ma = 4 + (o2 / 25) * 16;
      return {
        outputValue: `${o2.toFixed(1)} % O₂ (${ma.toFixed(2)} mA)`,
        outputNumeric: Number(ma.toFixed(2)),
        outputUnit: 'mA Output',
        secondaryOutput: `O₂ is strongly paramagnetic (χ = +1.9×10⁻⁶); N₂ & CO₂ are diamagnetic`,
        normalizedPrimary: normOf(o2, 0, 25),
        observation: `Paramagnetic O₂ displaces N₂-filled glass spheres toward field gradient; coil restores optical null at ${ma.toFixed(2)} mA.`,
        curve: sweepCurve(0, 25, (x) => 4 + (x / 25) * 16),
        xLabel: 'Oxygen',
        xUnit: '% O2',
        yLabel: 'Loop Current',
        yUnit: 'mA',
      };
    },
  },
  'gas-analyzers': {
    id: 'gas-analyzers',
    title: 'NDIR Non-Dispersive IR CO₂/CH₄ Cell',
    governingFormulaLatex: '\\Delta I / I_0 = 1 - \\exp(-k_{\\text{CO}_2}\\,L\\,C)',
    assumptions: '4.26 μm CO₂ IR absorption band through gold-lined 100 mm cell (nonlinear saturation curve).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Flue Gas CO₂ %', unit: '%', min: 0, max: 20, step: 0.5, defaultValue: 12 },
    evaluate: (pct) => {
      const calcAbs = (c: number) => 100 * (1 - Math.exp(-0.14 * c));
      const abs = calcAbs(pct);
      return {
        outputValue: `${abs.toFixed(1)} % Absorbed`,
        outputNumeric: Number(abs.toFixed(1)),
        outputUnit: '% IR Mod',
        secondaryOutput: `Microcontroller applies 4th-order polynomial linearization cleanly`,
        normalizedPrimary: normOf(pct, 0, 20),
        observation: `Asymmetric CO₂ stretch vibrations at 4.26 μm absorb ${abs.toFixed(1)}% of chopped IR beam.`,
        curve: sweepCurve(0, 20, calcAbs),
        xLabel: 'Gas Conc',
        xUnit: '% CO2',
        yLabel: 'IR Absorption',
        yUnit: '%',
      };
    },
  },
  'polarimeter-refractometer': {
    id: 'polarimeter-refractometer',
    title: 'Biot Optical Polarization Rotation (Chiral Tube)',
    governingFormulaLatex: '\\alpha = [\\alpha]_{\\lambda}^{T}\\cdot l\\cdot c, \\qquad [\\alpha]_{\\text{sucrose}} = +66.5^\\circ',
    assumptions: '2.0 dm polarimeter tube containing aqueous sucrose at 20 °C, Sodium D 589 nm.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Sucrose Conc c', unit: 'g/mL', min: 0, max: 0.5, step: 0.02, defaultValue: 0.24 },
    evaluate: (c) => {
      const deg = 66.5 * 2.0 * c;
      return {
        outputValue: `+${deg.toFixed(1)}° Rotation`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg Optical',
        secondaryOutput: `Dextrorotatory solution twists plane polarization clockwise`,
        normalizedPrimary: normOf(c, 0, 0.5),
        observation: `Rotate analyzer vernier +${deg.toFixed(1)}° to recover dark optical extinction null.`,
        curve: sweepCurve(0, 0.5, (x) => 66.5 * 2.0 * x),
        xLabel: 'Concentration',
        xUnit: 'g/mL',
        yLabel: 'Rotation α',
        yUnit: '°',
      };
    },
  },
  'nmr-photoacoustic': {
    id: 'nmr-photoacoustic',
    title: 'Nuclear Spin Larmor Precession Frequency',
    governingFormulaLatex: '\\nu_0 = \\frac{\\gamma\\,B_0}{2\\pi}, \\qquad \\gamma_{^1\\text{H}} = 42.577\\,\\text{MHz/T}',
    assumptions: 'Proton ¹H vs Carbon ¹³C superconducting cryomagnet field sweep (1.5–14.1 T).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Magnetic Field B₀', unit: 'Tesla', min: 1.5, max: 14.1, step: 0.2, defaultValue: 9.4 },
    secondaryParam: { key: 'secondary', label: 'Nucleus (0=¹H, 1=¹³C)', unit: '', min: 0, max: 1, step: 1, defaultValue: 0 },
    evaluate: (b, isC13) => {
      const gamma = isC13 > 0.5 ? 10.705 : 42.577;
      const mhz = gamma * b;
      return {
        outputValue: `${mhz.toFixed(1)} MHz`,
        outputNumeric: Number(mhz.toFixed(1)),
        outputUnit: `MHz (${isC13 > 0.5 ? '¹³C' : '¹H'})`,
        secondaryOutput: `Gyromagnetic ratio γ/2π = ${gamma} MHz/T`,
        normalizedPrimary: normOf(b, 1.5, 14.1),
        normalizedSecondary: isC13,
        observation: `Superconducting B₀ = ${b.toFixed(1)} T splits nuclear spin levels, requiring ${mhz.toFixed(1)} MHz RF pulse excitation.`,
        curve: sweepCurve(1.5, 14.1, (t) => gamma * t),
        xLabel: 'Magnet B0',
        xUnit: 'Tesla',
        yLabel: 'Larmor ν0',
        yUnit: 'MHz',
      };
    },
  },

  // ======================= H. CONTROL & PROCESS =======================
  'control-valves': {
    id: 'control-valves',
    title: 'Equal-Percentage vs Linear Inherent Flow Characteristic',
    governingFormulaLatex: 'Q_{\\text{EQ}\\%} = R^{(L - 1)}, \\quad R = 50\\;(\\text{rangeability})',
    assumptions: 'Normalized constant-ΔP inherent characteristic comparing Equal-% (R=50) against Linear trim.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Valve Opening L', unit: '% Lift', min: 0, max: 100, step: 2, defaultValue: 60 },
    evaluate: (pct) => {
      const calcEq = (x: number) => (x === 0 ? 0 : 100 * Math.pow(50, x / 100 - 1));
      const qEq = calcEq(pct);
      return {
        outputValue: `${qEq.toFixed(1)} % Q (EQ%)`,
        outputNumeric: Number(qEq.toFixed(1)),
        outputUnit: '% Flow',
        secondaryOutput: `Linear trim gives ${pct.toFixed(1)} % Q at ${pct}% lift (high piping friction favors EQ%)`,
        normalizedPrimary: normOf(pct, 0, 100),
        observation: `At ${pct}% stem lift, Equal-Percentage trim passes ${qEq.toFixed(1)}% flow — compensating pipeline friction losses!`,
        curve: sweepCurve(0, 100, calcEq),
        idealCurve: sweepCurve(0, 100, (x) => x),
        xLabel: 'Stem Lift %',
        xUnit: '%',
        yLabel: 'Flow %',
        yUnit: '% Q',
      };
    },
  },
  actuators: {
    id: 'actuators',
    title: 'Pneumatic Rack-and-Pinion Quarter-Turn Rotation',
    governingFormulaLatex: '\\theta = \\frac{P_{\\text{sig}} - 3}{12} \\cdot 90^\\circ, \\qquad T_{\\text{out}} = P \\cdot A_p \\cdot R_{\\text{pinion}}',
    assumptions: '3–15 psig air command rotating spring-return 90° butterfly/ball stem.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Air Pressure P', unit: 'psig', min: 3, max: 15, step: 0.5, defaultValue: 9 },
    evaluate: (psi) => {
      const deg = ((psi - 3) / 12) * 90;
      return {
        outputValue: `${deg.toFixed(1)}°`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg Rotation',
        secondaryOutput: `Fail-safe springs return ball shaft cleanly back to 0° upon air loss`,
        normalizedPrimary: normOf(psi, 3, 15),
        observation: `Air pressure drives opposing toothed racks linearly, turning pinion shaft cleanly to ${deg.toFixed(1)}°.`,
        curve: sweepCurve(3, 15, (x) => ((x - 3) / 12) * 90),
        xLabel: 'Air Signal',
        xUnit: 'psig',
        yLabel: 'Shaft Angle',
        yUnit: '°',
      };
    },
  },
  positioners: {
    id: 'positioners',
    title: 'Smart Positioner Stem Tracking & Friction Rejection',
    governingFormulaLatex: 'x_{\\text{stem}} \\to \\frac{I_{\\text{cmd}} - 4}{16} \\cdot 100\\%',
    assumptions: 'Inner closed-loop piezo/Hall positioner driving pneumatic diaphragm against gland stiction.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'HART Command mA', unit: 'mA', min: 4, max: 20, step: 0.4, defaultValue: 12 },
    evaluate: (ma) => {
      const pct = ((ma - 4) / 16) * 100;
      return {
        outputValue: `${pct.toFixed(1)} % Travel`,
        outputNumeric: Number(pct.toFixed(1)),
        outputUnit: '% Stem Pos',
        secondaryOutput: `Auto-boosts air pressure up to supply max to break packing stiction deadband`,
        normalizedPrimary: normOf(ma, 4, 20),
        observation: `Cam Hall sensor verifies stem arrived accurately at ${pct.toFixed(1)}% within ±0.25% deadband.`,
        curve: sweepCurve(4, 20, (x) => ((x - 4) / 16) * 100),
        xLabel: 'Command',
        xUnit: 'mA',
        yLabel: 'Stem Travel',
        yUnit: '%',
      };
    },
  },
  'ip-converters': {
    id: 'ip-converters',
    title: 'Electro-Pneumatic Flapper-Nozzle 4–20 mA to 3–15 psig',
    governingFormulaLatex: 'P_{\\text{out}} = 3 + 0.75\\,(I_{\\text{in}} - 4)\\;(\\text{psig})',
    assumptions: 'Linear current-to-pneumatic force-balance relay with 20 psig air supply.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Loop Signal I_in', unit: 'mA', min: 4, max: 20, step: 0.4, defaultValue: 12 },
    evaluate: (ma) => {
      const psi = 3 + 0.75 * (ma - 4);
      const bar = psi * 0.0689476;
      return {
        outputValue: `${psi.toFixed(2)} psig`,
        outputNumeric: Number(psi.toFixed(2)),
        outputUnit: `(${bar.toFixed(2)} bar)`,
        secondaryOutput: `Slope = 0.750 psig/mA · Flapper gap changes ~0.05 mm full scale!`,
        normalizedPrimary: normOf(ma, 4, 20),
        observation: `Higher coil force pushes flapper closer to brass nozzle, throttling backpressure up to ${psi.toFixed(2)} psig.`,
        curve: sweepCurve(4, 20, (x) => 3 + 0.75 * (x - 4)),
        xLabel: 'Signal I',
        xUnit: 'mA',
        yLabel: 'Output P',
        yUnit: 'psig',
      };
    },
  },
  'solenoid-valves': {
    id: 'solenoid-valves',
    title: '3/2 NAMUR Solenoid Coil Switching Action',
    governingFormulaLatex: 'F_{\\text{mag}} = \\frac{(N I)^2\\mu_0 A}{2 g^2} > F_{\\text{spring}} \\implies \\text{ON}',
    assumptions: '24 VDC ESD pilot solenoid snapping at ≥ 16 VDC pull-in threshold.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Coil Voltage', unit: 'VDC', min: 0, max: 24, step: 2, defaultValue: 24 },
    evaluate: (v) => {
      const state = v >= 16 ? 'ENERGIZED (P→A Open)' : 'DE-ENERGIZED (A→R Exhaust)';
      return {
        outputValue: state,
        outputNumeric: v >= 16 ? 1 : 0,
        outputUnit: 'Port State',
        secondaryOutput: `Fail-safe spring dumps actuator air instantly upon ESD trip (0 VDC)`,
        normalizedPrimary: v >= 16 ? 1 : 0,
        observation: v >= 16 ? '24 VDC magnetizes plunger upward against return spring, porting air to actuator.' : 'Loss of voltage releases spring to vent actuator immediately to Safe State.',
        curve: sweepCurve(0, 24, (x) => (x >= 16 ? 1 : 0)),
        xLabel: 'Coil Volts',
        xUnit: 'VDC',
        yLabel: 'Valve State',
        yUnit: '0/1',
      };
    },
  },
  'spool-valve': {
    id: 'spool-valve',
    title: 'Proportional 4/3 Hydraulic Spool Metering',
    governingFormulaLatex: 'Q_{\\text{load}} = C_q\\,w\\,x_v\\sqrt{\\frac{P_s - P_L}{\\rho}}',
    assumptions: 'Symmetric critical-center sliding spool (−100% retract to +100% extend).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Spool Command %', unit: '%', min: -100, max: 100, step: 5, defaultValue: 40 },
    evaluate: (pct) => {
      const lpm = (pct / 100) * 60;
      const route = pct > 5 ? 'P→A · B→T' : pct < -5 ? 'P→B · A→T' : 'Center Blocked';
      return {
        outputValue: `${lpm.toFixed(1)} L/min`,
        outputNumeric: Number(lpm.toFixed(1)),
        outputUnit: `(${route})`,
        secondaryOutput: `Spool displacement = ${((pct / 100) * 4.5).toFixed(2)} mm`,
        normalizedPrimary: normOf(pct, -100, 100),
        observation: `Sliding spool opens proportional annular lands (${route}) at ${Math.abs(lpm).toFixed(1)} L/min.`,
        curve: sweepCurve(-100, 100, (x) => (x / 100) * 60),
        xLabel: 'Spool Cmd',
        xUnit: '%',
        yLabel: 'Hydraulic Flow',
        yUnit: 'L/min',
      };
    },
  },
  'stepper-motor': {
    id: 'stepper-motor',
    title: 'Hybrid Stepper Discrete Angular Indexing',
    governingFormulaLatex: '\\theta = n_{\\text{steps}} \\cdot \\frac{1.8^\\circ}{\\text{microstep}}',
    assumptions: '200 full-steps/rev (1.8°/step) discrete open-loop indexing without encoder.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Commanded Pulses', unit: 'steps', min: 0, max: 200, step: 5, defaultValue: 50 },
    evaluate: (steps) => {
      const deg = steps * 1.8;
      return {
        outputValue: `${deg.toFixed(1)}°`,
        outputNumeric: Number(deg.toFixed(1)),
        outputUnit: 'deg Shaft',
        secondaryOutput: `${steps} discrete pulses @ 1.8°/step (full revolution = 360° at 200 pulses)`,
        normalizedPrimary: normOf(steps, 0, 200),
        observation: `Sequential phase excitation locks toothed PM rotor cleanly at ${deg.toFixed(1)}°.`,
        curve: sweepCurve(0, 200, (x) => x * 1.8),
        xLabel: 'Pulse Count',
        xUnit: 'steps',
        yLabel: 'Shaft Angle',
        yUnit: '°',
      };
    },
  },
  servomotor: {
    id: 'servomotor',
    title: 'Armature-Controlled DC / BLDC Servomotor Speed-Voltage',
    governingFormulaLatex: '\\omega_{ss} = \\frac{V_a - I_a R_a}{K_e}',
    assumptions: '24 VDC servo rated 3000 RPM no-load, Ra = 0.8 Ω with load torque droop.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Armature V_a', unit: 'V', min: 0, max: 24, step: 0.5, defaultValue: 16 },
    secondaryParam: { key: 'secondary', label: 'Load Torque', unit: 'N·m', min: 0, max: 2.0, step: 0.1, defaultValue: 0.4 },
    evaluate: (va, tau) => {
      const calcRpm = (v: number) => Math.max(0, v * 125 - tau * 140);
      const rpm = calcRpm(va);
      return {
        outputValue: `${rpm.toFixed(0)} RPM`,
        outputNumeric: Number(rpm.toFixed(0)),
        outputUnit: 'RPM Shaft',
        secondaryOutput: `Back-EMF = ${(rpm / 125).toFixed(2)} V · Rear optical encoder closes loop`,
        normalizedPrimary: normOf(va, 0, 24),
        normalizedSecondary: normOf(tau, 0, 2.0),
        observation: `Increased torque draws higher armature current Ia, introducing minor IR speed droop unless closed-loop PID compensates.`,
        curve: sweepCurve(0, 24, calcRpm),
        xLabel: 'Voltage Va',
        xUnit: 'V',
        yLabel: 'Speed',
        yUnit: 'RPM',
      };
    },
  },
  'process-controller': {
    id: 'process-controller',
    title: 'Proportional + Manual Reset DIN Loop Controller',
    governingFormulaLatex: 'u(\\%) = K_c\\,(SP - PV) + u_{\\text{bias}}, \\quad SP = 150^\\circ\\text{C}',
    assumptions: 'Reverse-acting heating controller K_c = 1.4 %/°C, SP = 150 °C, bias 50%.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Process Variable PV', unit: '°C', min: 50, max: 200, step: 2, defaultValue: 130 },
    evaluate: (pv) => {
      const calcU = (p: number) => Math.min(100, Math.max(0, 50 + 1.4 * (150 - p)));
      const u = calcU(pv);
      return {
        outputValue: `${u.toFixed(1)} % Out`,
        outputNumeric: Number(u.toFixed(1)),
        outputUnit: '% Command',
        secondaryOutput: `Error = ${(150 - pv).toFixed(0)} °C (Integral action needed to remove steady offset!)`,
        normalizedPrimary: normOf(pv, 50, 200),
        observation: `As PV rises past SP (150 °C), reverse-acting proportional output clamps toward 0% heater power.`,
        curve: sweepCurve(50, 200, calcU),
        xLabel: 'Process PV',
        xUnit: '°C',
        yLabel: 'Output %',
        yUnit: '%',
      };
    },
  },

  // ======================= I. SPECIAL & CONDITIONING =======================
  'hall-effect': {
    id: 'hall-effect',
    title: 'Transverse Hall-Effect Magnetic Flux Voltage',
    governingFormulaLatex: 'V_H = \\frac{R_H\\,I_c\\,B}{t} = K_H\\,B',
    assumptions: 'Bias current I_c = 10 mA in GaAs wafer moving toward permanent magnet (B up to 500 mT).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Magnetic Flux B', unit: 'mT', min: 0, max: 500, step: 10, defaultValue: 220 },
    evaluate: (b) => {
      const mv = b * 0.45;
      return {
        outputValue: `${mv.toFixed(1)} mV`,
        outputNumeric: Number(mv.toFixed(1)),
        outputUnit: 'mV Hall V_H',
        secondaryOutput: `Lorentz force deflects carriers sideways orthogonally to BOTH I_c and B`,
        normalizedPrimary: normOf(b, 0, 500),
        observation: `Approaching magnet concentrates flux lines, linearly rising Hall output to ${mv.toFixed(1)} mV.`,
        curve: sweepCurve(0, 500, (x) => x * 0.45),
        xLabel: 'Flux Density B',
        xUnit: 'mT',
        yLabel: 'Hall V_H',
        yUnit: 'mV',
      };
    },
  },
  magnetostrictive: {
    id: 'magnetostrictive',
    title: 'Magnetostrictive Wiedemann Torsional Wave TOF',
    governingFormulaLatex: 'x = \\frac{v_{\\text{sonic}} \\cdot \\Delta t}{2\\text{-path}} = 2850\\,\\text{m/s} \\cdot t',
    assumptions: 'Non-contact float collar sliding down 2.0 m Ni-Fe alloy waveguide (~0.35 μs/mm return).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Collar Position x', unit: 'mm', min: 50, max: 2000, step: 25, defaultValue: 900 },
    evaluate: (x) => {
      const us = (x / 2.85);
      return {
        outputValue: `${us.toFixed(1)} μs`,
        outputNumeric: Number(us.toFixed(1)),
        outputUnit: 'μs Sonic TOF',
        secondaryOutput: `Linear repeatability ±0.05 mm with zero physical contact wear`,
        normalizedPrimary: normOf(x, 50, 2000),
        observation: `Current pulse meets collar field at ${x} mm, twisting waveguide & sending strain wave back in ${us.toFixed(1)} μs.`,
        curve: sweepCurve(50, 2000, (p) => p / 2.85),
        xLabel: 'Position x',
        xUnit: 'mm',
        yLabel: 'Strain Wave TOF',
        yUnit: 'μs',
      };
    },
  },
  'optical-fiber': {
    id: 'optical-fiber',
    title: 'Fiber Bragg Grating (FBG) Strain Wavelength Shift',
    governingFormulaLatex: '\\Delta\\lambda_B = \\lambda_{B0}\\,(1 - p_e)\\,\\varepsilon, \\qquad \\lambda_{B0} = 1550.0\\,\\text{nm}',
    assumptions: 'Silica photoelastic constant p_e = 0.22 (sensitivity ≈ 1.21 pm / με); EMI-immune.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Axial Fiber Strain ε', unit: 'με', min: 0, max: 2500, step: 50, defaultValue: 1000 },
    evaluate: (eps) => {
      const dNm = 1550 * (1 - 0.22) * eps * 1e-6;
      const lam = 1550 + dNm;
      return {
        outputValue: `${lam.toFixed(3)} nm`,
        outputNumeric: Number(dNm.toFixed(3)),
        outputUnit: `(+${dNm.toFixed(3)} nm shift)`,
        secondaryOutput: `Sensitivity ≈ 1.21 pm/με · Zero electrical sparking risk inside Ex Zone 0!`,
        normalizedPrimary: normOf(eps, 0, 2500),
        observation: `Axial tension widens Bragg refractive grating spacing, shifting reflected narrow peak cleanly to ${lam.toFixed(3)} nm.`,
        curve: sweepCurve(0, 2500, (e) => 1550 * 0.78 * e * 1e-6),
        xLabel: 'Microstrain',
        xUnit: 'με',
        yLabel: 'Bragg Shift Δλ',
        yUnit: 'nm',
      };
    },
  },
  'photo-detectors': {
    id: 'photo-detectors',
    title: 'Photomultiplier (PMT) Gain vs CdS LDR Resistance',
    governingFormulaLatex: 'G_{\\text{PMT}} = \\delta^n, \\qquad R_{\\text{LDR}} \\approx R_0\\,\\left(\\frac{E}{10}\\right)^{-0.75}',
    assumptions: 'Compares 8-stage PMT dynode avalanche output gain against slow nonlinear CdS photoresistor.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Light Flux', unit: 'Lux', min: 1, max: 500, step: 10, defaultValue: 80 },
    evaluate: (lux) => {
      const ldrK = 15 * Math.pow(lux / 10, -0.75);
      return {
        outputValue: `${ldrK >= 1 ? `${ldrK.toFixed(2)} kΩ` : `${(ldrK * 1000).toFixed(0)} Ω`} (LDR)`,
        outputNumeric: Number(ldrK.toFixed(2)),
        outputUnit: 'kΩ',
        secondaryOutput: `Parallel PMT @ 800V gives ~10⁶ electron multiplication in nanoseconds!`,
        normalizedPrimary: normOf(lux, 1, 500),
        observation: `Higher photon irradiance frees electron-hole pairs in CdS, plunging resistance nonlinearly to ${ldrK.toFixed(2)} kΩ.`,
        curve: sweepCurve(1, 500, (l) => 15 * Math.pow(l / 10, -0.75)),
        xLabel: 'Illuminance',
        xUnit: 'Lux',
        yLabel: 'LDR Resistance',
        yUnit: 'kΩ',
      };
    },
  },
  'ina-opamp': {
    id: 'ina-opamp',
    title: 'Three-Op-Amp Instrumentation Amplifier Gain',
    governingFormulaLatex: 'G = 1 + \\frac{2\\,R_1}{R_G}, \\qquad V_{\\text{out}} = G\\,(V_+ - V_-)',
    assumptions: 'Internal matched resistors R₁ = 24.7 kΩ; adjust gain-setting resistor R_G.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Diff Input ΔV', unit: 'mV', min: 0, max: 50, step: 1, defaultValue: 15 },
    secondaryParam: { key: 'secondary', label: 'Gain Resistor R_G', unit: 'Ω', min: 50, max: 5000, step: 50, defaultValue: 500 },
    evaluate: (mv, rg) => {
      const gain = 1 + (2 * 24700) / rg;
      const vOut = (mv * 1e-3) * gain;
      return {
        outputValue: `${vOut.toFixed(2)} V`,
        outputNumeric: Number(vOut.toFixed(2)),
        outputUnit: `(Gain ${gain.toFixed(1)}×)`,
        secondaryOutput: `Only ONE resistor R_G tunes differential gain cleanly without hurting CMRR!`,
        normalizedPrimary: normOf(mv, 0, 50),
        normalizedSecondary: normOf(rg, 50, 5000),
        observation: `With R_G = ${rg} Ω (Gain ${gain.toFixed(1)}×), ${mv} mV bridge voltage amplifies cleanly to ${vOut.toFixed(2)} V.`,
        curve: sweepCurve(0, 50, (x) => (x * 1e-3) * gain),
        xLabel: 'Diff Input',
        xUnit: 'mV',
        yLabel: 'Output V',
        yUnit: 'V',
      };
    },
  },
  'active-filter': {
    id: 'active-filter',
    title: '2nd-Order Butterworth Sallen-Key Low-Pass',
    governingFormulaLatex: '|H(j\\omega)|_{\\text{dB}} = -10\\log_{10}\\!\\left[1 + \\left(\\frac{f}{f_c}\\right)^4\\right], \\quad f_c = 50\\,\\text{Hz}',
    assumptions: 'Flat maximally damped anti-aliasing filter (Q = 0.707, −40 dB/decade roll-off).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Signal Frequency f', unit: 'Hz', min: 5, max: 250, step: 5, defaultValue: 50 },
    evaluate: (f) => {
      const calcDb = (freq: number) => -10 * Math.log10(1 + Math.pow(freq / 50, 4));
      const db = calcDb(f);
      return {
        outputValue: `${db.toFixed(1)} dB`,
        outputNumeric: Number(db.toFixed(1)),
        outputUnit: 'dB Magnitude',
        secondaryOutput: `At f = f_c = 50 Hz gain sits cleanly at −3.01 dB`,
        normalizedPrimary: normOf(f, 5, 250),
        observation: `Noise well above 50 Hz rolls off at −40 dB/decade, preventing ADC aliasing.`,
        curve: sweepCurve(5, 250, calcDb),
        xLabel: 'Frequency',
        xUnit: 'Hz',
        yLabel: 'Gain',
        yUnit: 'dB',
      };
    },
  },
  'isolator-barrier': {
    id: 'isolator-barrier',
    title: 'Galvanic 1:1 Loop Isolator & Ex-ia Zener Clamp',
    governingFormulaLatex: 'V_{\\text{clamp}} \\le V_{z,\\max} = 28.0\\,\\text{VDC}, \\quad I_{\\text{out}} = I_{\\text{in}}',
    assumptions: 'Intrinsic safety barrier clips hazardous fault surges cleanly at 28 V.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Safe-Side Fault V', unit: 'V', min: 5, max: 60, step: 1, defaultValue: 24 },
    evaluate: (v) => {
      const clamped = Math.min(28, v);
      return {
        outputValue: `${clamped.toFixed(1)} V Field`,
        outputNumeric: clamped,
        outputUnit: 'V Clamped',
        secondaryOutput: v > 28 ? 'Zener diode conducting to ground bus — Hazard Zone protected!' : 'Normal transparent 4–20 mA signal pass-through',
        normalizedPrimary: normOf(v, 5, 60),
        observation: v > 28 ? `Control-room fault ${v} V safely clamped to 28.0 V so Zone 0 sparks cannot ignite!` : `Normal 24 VDC operation passes 4–20 mA cleanly across transformer core.`,
        curve: sweepCurve(5, 60, (x) => Math.min(28, x)),
        xLabel: 'Fault Volts',
        xUnit: 'V',
        yLabel: 'Field Volts',
        yUnit: 'V',
      };
    },
  },
  'adc-dac-board': {
    id: 'adc-dac-board',
    title: '8-Bit SAR ADC Quantization & R-2R Ladder Code',
    governingFormulaLatex: '\\text{LSB} = \\frac{V_{\\text{ref}}}{2^N}, \\quad \\text{Code} = \\text{round}\\!\\left(\\frac{V_{\\text{in}}}{\\text{LSB}}\\right)',
    assumptions: 'V_ref = 5.00 V, N = 8-bit SAR converter (256 levels, 19.53 mV/LSB).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Analog Input V_in', unit: 'V', min: 0, max: 5, step: 0.05, defaultValue: 2.5 },
    evaluate: (vin) => {
      const lsb = 5 / 256;
      const code = Math.min(255, Math.round(vin / lsb));
      const bin = code.toString(2).padStart(8, '0');
      return {
        outputValue: `0b${bin} (${code})`,
        outputNumeric: code,
        outputUnit: 'Digital Code',
        secondaryOutput: `Quantized V_q = ${(code * lsb).toFixed(3)} V · Step LSB = ${(lsb * 1000).toFixed(2)} mV`,
        normalizedPrimary: normOf(vin, 0, 5),
        observation: `Successive Approximation Register binary-searches R-2R DAC to digital code ${code} (${bin}).`,
        curve: sweepCurve(0, 5, (v) => Math.min(255, Math.round(v / lsb))),
        xLabel: 'Analog Vin',
        xUnit: 'V',
        yLabel: '8-Bit Code',
        yUnit: 'Counts',
      };
    },
  },
  'monochromator-optics': {
    id: 'monochromator-optics',
    title: 'Diffraction Grating Monochromator & Dispersion',
    governingFormulaLatex: 'd(\\sin\\alpha + \\sin\\beta) = m\\lambda, \\quad D = \\frac{m}{d\\cos\\beta}',
    assumptions: 'Czerny-Turner 1200 lines/mm grating (d = 833.3 nm), fixed α = 15°, first diffraction order m = 1.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Target Wavelength λ', unit: 'nm', min: 250, max: 800, step: 10, defaultValue: 540 },
    evaluate: (lamNm) => {
      const dNm = 833.33;
      const sinAlpha = Math.sin((15 * Math.PI) / 180);
      const calcBetaDeg = (l: number) => {
        const arg = Math.min(0.98, Math.max(-0.98, l / dNm - sinAlpha));
        return (Math.asin(arg) * 180) / Math.PI;
      };
      const betaDeg = calcBetaDeg(lamNm);
      return {
        outputValue: `${betaDeg.toFixed(1)}°`,
        outputNumeric: Number(betaDeg.toFixed(2)),
        outputUnit: 'Exit Angle β',
        secondaryOutput: `Grating spacing d = 833.3 nm · Linear dispersion ~ 1.6 nm/mm at slit`,
        normalizedPrimary: normOf(lamNm, 250, 800),
        observation: `Tilting the grating positions λ = ${lamNm} nm cleanly at diffraction exit angle ${betaDeg.toFixed(1)}°.`,
        curve: sweepCurve(250, 800, calcBetaDeg),
        xLabel: 'Wavelength',
        xUnit: 'nm',
        yLabel: 'Diffraction Angle β',
        yUnit: 'deg',
      };
    },
  },
  'electrochemical-gas-sensor': {
    id: 'electrochemical-gas-sensor',
    title: 'Electrochemical Toxic Gas Cell (3-Electrode Current)',
    governingFormulaLatex: 'I_{\\text{lim}} = \\frac{n F A D\\,C_{\\text{gas}}}{\\delta}',
    assumptions: 'CO electrochemical cell sensitivity 70 nA/ppm under diffusion-limited capillary entry.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Gas Concentration CO', unit: 'ppm', min: 0, max: 500, step: 10, defaultValue: 50 },
    evaluate: (ppm) => {
      const currentUa = ppm * 0.07;
      return {
        outputValue: `${currentUa.toFixed(2)} μA`,
        outputNumeric: Number(currentUa.toFixed(2)),
        outputUnit: 'Cell Current',
        secondaryOutput: ppm >= 200 ? 'IDLH / High-gas alarm threshold exceeded!' : ppm >= 35 ? 'OSHA TWA alarm threshold active' : 'Safe ambient breathing zone level',
        normalizedPrimary: normOf(ppm, 0, 500),
        observation: `Diffusion through the hydrophobic PTFE barrier drives ${currentUa.toFixed(2)} μA directly linear to ${ppm} ppm CO.`,
        curve: sweepCurve(0, 500, (c) => c * 0.07),
        xLabel: 'CO Gas',
        xUnit: 'ppm',
        yLabel: 'Current',
        yUnit: 'μA',
      };
    },
  },
  'intel-8085': {
    id: 'intel-8085',
    title: 'Intel 8085 Crystal Clock & Machine-Cycle Timing',
    governingFormulaLatex: 'T_{\\text{state}} = \\frac{2}{f_{\\text{crystal}}}, \\quad t_{\\text{M1}} = 4\\,T_{\\text{state}}',
    assumptions: 'Internal ÷2 clock prescaler; standard 4-T opcode fetch + 3-T memory read.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Crystal Frequency', unit: 'MHz', min: 2, max: 10, step: 0.5, defaultValue: 6 },
    evaluate: (xtal) => {
      const fclk = xtal / 2;
      const tNs = 1000 / fclk;
      const addTimeUs = (4 * tNs) / 1000;
      const staTimeUs = (13 * tNs) / 1000;
      return {
        outputValue: `${fclk.toFixed(2)} MHz · ${tNs.toFixed(1)} ns/T`,
        outputNumeric: Number(tNs.toFixed(1)),
        outputUnit: 'ns / T-state',
        secondaryOutput: `Opcode Fetch (4T) = ${addTimeUs.toFixed(2)} μs · STA addr (13T) = ${staTimeUs.toFixed(2)} μs`,
        normalizedPrimary: normOf(xtal, 2, 10),
        observation: `A ${xtal.toFixed(1)} MHz quartz crystal divides internally by 2 to run the 8085 bus at ${fclk.toFixed(2)} MHz.`,
        curve: sweepCurve(2, 10, (x) => 1000 / (x / 2)),
        xLabel: 'Crystal Freq',
        xUnit: 'MHz',
        yLabel: 'T-State Period',
        yUnit: 'ns',
      };
    },
  },
  'intel-8086': {
    id: 'intel-8086',
    title: 'Intel 8086 Physical Address & Clock Rate Calculator',
    governingFormulaLatex: '\\text{PA}_{20\\text{-bit}} = (\\text{Segment}_{16} \\times 16) + \\text{Offset}_{16}',
    assumptions: '20-bit BIU physical address adder combining 16-bit CS segment and 16-bit IP offset.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Segment CS (dec/hex)', unit: '0x1000+', min: 0, max: 65535, step: 256, defaultValue: 8192 },
    secondaryParam: { key: 'secondary', label: 'Offset IP', unit: 'bytes', min: 0, max: 65535, step: 16, defaultValue: 512 },
    evaluate: (seg, off) => {
      const pa = ((seg << 4) + off) & 0xfffff;
      const segHex = seg.toString(16).toUpperCase().padStart(4, '0');
      const offHex = off.toString(16).toUpperCase().padStart(4, '0');
      const paHex = pa.toString(16).toUpperCase().padStart(5, '0');
      return {
        outputValue: `${paHex}H`,
        outputNumeric: pa,
        outputUnit: '20-bit Addr',
        secondaryOutput: `${segHex}H : ${offHex}H -> (${segHex}0H + ${offHex}H) = ${paHex}H`,
        normalizedPrimary: normOf(seg, 0, 65535),
        normalizedSecondary: normOf(off, 0, 65535),
        observation: `Shifting segment ${segHex}H left by 4 bits and adding offset ${offHex}H addresses byte ${paHex}H inside 1 MB RAM.`,
        curve: sweepCurve(0, 65535, (s) => ((s << 4) + off) & 0xfffff),
        xLabel: 'Segment',
        xUnit: 'CS',
        yLabel: 'Physical Byte',
        yUnit: 'Addr',
      };
    },
  },
  'intel-8051': {
    id: 'intel-8051',
    title: '8051 Machine Cycle & Timer Reload Calculator',
    governingFormulaLatex: 'f_{\\text{cycle}} = \\frac{f_{\\text{osc}}}{12}, \\quad \\text{Delay} = (65536 - \\text{Count})\\cdot T_{\\text{cycle}}',
    assumptions: 'Classic 8051 12-clock machine cycle with 16-bit Timer-0 in Mode 1.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Timer Count (16-bit)', unit: 'ticks', min: 100, max: 50000, step: 100, defaultValue: 10000 },
    evaluate: (ticks) => {
      const fosc = 11.0592;
      const tCycleUs = 12 / fosc;
      const delayMs = (ticks * tCycleUs) / 1000;
      const reloadHex = (65536 - Math.round(ticks)).toString(16).toUpperCase().padStart(4, '0');
      return {
        outputValue: `${delayMs.toFixed(2)} ms`,
        outputNumeric: Number(delayMs.toFixed(3)),
        outputUnit: 'Timer Delay',
        secondaryOutput: `11.0592 MHz XTAL (T_MC = ${tCycleUs.toFixed(3)} μs) · Load TH0:TL0 = ${reloadHex}H`,
        normalizedPrimary: normOf(ticks, 100, 50000),
        observation: `Counting ${ticks} machine cycles before TF0 overflow takes ${delayMs.toFixed(2)} ms at 11.0592 MHz.`,
        curve: sweepCurve(100, 50000, (n) => (n * tCycleUs) / 1000),
        xLabel: 'Ticks',
        xUnit: 'cycles',
        yLabel: 'Delay',
        yUnit: 'ms',
      };
    },
  },
  'ic-8253': {
    id: 'ic-8253',
    title: '8253/8254 PIT Divider & Square-Wave Output',
    governingFormulaLatex: 'f_{\\text{out}} = \\frac{f_{\\text{clk}}}{N_{\\text{divisor}}}',
    assumptions: 'Mode 3 symmetric square-wave generator driven by f_clk = 2.00 MHz.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: '16-Bit Divisor N', unit: 'counts', min: 10, max: 5000, step: 10, defaultValue: 200 },
    evaluate: (n) => {
      const foutKhz = 2000 / n;
      return {
        outputValue: `${foutKhz.toFixed(2)} kHz`,
        outputNumeric: Number(foutKhz.toFixed(2)),
        outputUnit: 'OUT Frequency',
        secondaryOutput: `Period = ${(1000 / foutKhz).toFixed(1)} μs · Load control word 36H for Mode 3 square wave`,
        normalizedPrimary: normOf(n, 10, 5000),
        observation: `Dividing a 2 MHz clock by N = ${n} yields a clean 50% duty-cycle ${foutKhz.toFixed(2)} kHz timing wave.`,
        curve: sweepCurve(10, 5000, (d) => 2000 / d),
        xLabel: 'Divisor N',
        xUnit: 'cnt',
        yLabel: 'Output Freq',
        yUnit: 'kHz',
      };
    },
  },
  'ic-8251': {
    id: 'ic-8251',
    title: '8251A USART Asynchronous Baud Divider',
    governingFormulaLatex: '\\text{Baud} = \\frac{f_{\\text{TxC/RxC}}}{k_{\\text{prescale}}}, \\quad T_{\\text{bit}} = \\frac{1}{\\text{Baud}}',
    assumptions: '×16 oversampling mode with 1 start, 8 data, 1 stop bit (10 bits/frame).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Baud Clock f_TxC', unit: 'kHz', min: 19.2, max: 1843.2, step: 19.2, defaultValue: 153.6 },
    evaluate: (fkhz) => {
      const baud = (fkhz * 1000) / 16;
      const charsPerSec = baud / 10;
      return {
        outputValue: `${Math.round(baud)} bps`,
        outputNumeric: Math.round(baud),
        outputUnit: 'Baud Rate',
        secondaryOutput: `Throughput ≈ ${charsPerSec.toFixed(0)} bytes/sec (8N1 serial framing)`,
        normalizedPrimary: normOf(fkhz, 19.2, 1843.2),
        observation: `With ×16 internal UART clock sampling, ${fkhz.toFixed(1)} kHz produces standard ${Math.round(baud)} baud serial frames.`,
        curve: sweepCurve(19.2, 1843.2, (f) => (f * 1000) / 16),
        xLabel: 'TxC Clock',
        xUnit: 'kHz',
        yLabel: 'Serial Rate',
        yUnit: 'bps',
      };
    },
  },
  'ic-8255': {
    id: 'ic-8255',
    title: '8255A PPI Port Configuration & Output Drive',
    governingFormulaLatex: 'I_{\\text{total}} = N_{\\text{active}} \\cdot I_{\\text{pin}}',
    assumptions: 'Mode 0 simple I/O driving active LED/optocoupler loads (4 mA/pin max) across 24 bits.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Active Output Bits', unit: 'pins', min: 0, max: 24, step: 1, defaultValue: 8 },
    evaluate: (pins) => {
      const mA = pins * 2.5;
      return {
        outputValue: `${pins} / 24 pins High`,
        outputNumeric: pins,
        outputUnit: 'GPIO Active',
        secondaryOutput: `Control Word 80H (All Ports Mode 0 Out) · Sink current ≈ ${mA.toFixed(1)} mA`,
        normalizedPrimary: normOf(pins, 0, 24),
        observation: `Programming 80H into Control Register sets PA, PB, PC (upper/lower) as latched 24-bit outputs.`,
        curve: sweepCurve(0, 24, (p) => p * 2.5),
        xLabel: 'Active Pins',
        xUnit: 'bits',
        yLabel: 'Current',
        yUnit: 'mA',
      };
    },
  },
  'ic-8279': {
    id: 'ic-8279',
    title: '8279 Keyboard Debounce & Scan Timing',
    governingFormulaLatex: 'f_{\\text{scan}} = \\frac{f_{\\text{clk}}}{PP}, \\quad t_{\\text{debounce}} \\approx 10\\,\\text{ms}',
    assumptions: 'Prescaler PP divides 2 MHz bus clock to 100 kHz scan clock with 8-byte key FIFO.',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Clock Prescaler PP', unit: 'div', min: 2, max: 31, step: 1, defaultValue: 20 },
    evaluate: (pp) => {
      const scanKhz = 2000 / pp;
      const frameMs = (5.12 * 100) / scanKhz;
      return {
        outputValue: `${scanKhz.toFixed(1)} kHz`,
        outputNumeric: Number(scanKhz.toFixed(1)),
        outputUnit: 'Scan Clock',
        secondaryOutput: `Full 64-key debounce scan ≈ ${(frameMs * 2).toFixed(2)} ms · Offloads CPU polling`,
        normalizedPrimary: normOf(pp, 2, 31),
        observation: `Setting PP = ${pp} scans the 8×8 keypad matrix automatically without CPU intervention.`,
        curve: sweepCurve(2, 31, (p) => 2000 / p),
        xLabel: 'Prescaler PP',
        xUnit: 'div',
        yLabel: 'Scan Clk',
        yUnit: 'kHz',
      };
    },
  },
  'arduino-uno': {
    id: 'arduino-uno',
    title: 'Arduino UNO 10-Bit ADC & analogWrite PWM',
    governingFormulaLatex: '\\text{ADC} = \\text{round}\\!\\left(\\frac{V_{\\text{in}}}{5.0}\\cdot 1023\\right), \\quad \\text{Duty} = \\frac{\\text{PWM}}{255}',
    assumptions: 'ATmega328P at 5.00 V AVCC reference, 10-bit ADC (4.88 mV/step) mapped to 8-bit Timer PWM.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Sensor Voltage A0', unit: 'V', min: 0, max: 5, step: 0.05, defaultValue: 2.5 },
    evaluate: (vin) => {
      const adc = Math.min(1023, Math.round((vin / 5) * 1023));
      const pwm = Math.round(adc / 4);
      const dutyPct = (pwm / 255) * 100;
      return {
        outputValue: `ADC ${adc} · PWM ${pwm}`,
        outputNumeric: adc,
        outputUnit: '10-bit Raw',
        secondaryOutput: `Step = 4.88 mV/count · Mapped analogWrite duty = ${dutyPct.toFixed(1)}%`,
        normalizedPrimary: normOf(vin, 0, 5),
        observation: `analogRead(A0) returns ${adc} (0–1023), driving ~${dutyPct.toFixed(1)}% PWM brightness/motor speed.`,
        curve: sweepCurve(0, 5, (v) => Math.round((v / 5) * 1023)),
        xLabel: 'Pin Voltage',
        xUnit: 'V',
        yLabel: 'ADC Count',
        yUnit: 'counts',
      };
    },
  },
  'raspberry-pi': {
    id: 'raspberry-pi',
    title: 'Raspberry Pi GPIO Current & CPU Clock Scaling',
    governingFormulaLatex: 'I_{\\text{gpio}} = \\frac{3.3\\,\\text{V} - V_{\\text{LED}}}{R_{\\text{series}}}, \\quad I_{\\text{pin}} \\le 16\\,\\text{mA}',
    assumptions: '3.3 V unbuffered BCM GPIO driving a 2.0 V green LED through series resistor R.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Series Resistor R', unit: 'Ω', min: 68, max: 1000, step: 22, defaultValue: 220 },
    evaluate: (r) => {
      const mA = ((3.3 - 2.0) / r) * 1000;
      const safe = mA <= 16;
      return {
        outputValue: `${mA.toFixed(2)} mA`,
        outputNumeric: Number(mA.toFixed(2)),
        outputUnit: 'GPIO Current',
        secondaryOutput: safe ? 'Within 16 mA BCM pin safety limit' : 'WARNING: exceeds 16 mA CMOS pin rating!',
        normalizedPrimary: normOf(r, 68, 1000),
        observation: `At 3.3 V logic, a ${r} Ω resistor limits GPIO output current to ${mA.toFixed(2)} mA.`,
        curve: sweepCurve(68, 1000, (rv) => ((3.3 - 2.0) / rv) * 1000),
        xLabel: 'Series R',
        xUnit: 'Ω',
        yLabel: 'Pin Current',
        yUnit: 'mA',
      };
    },
  },
  'lcd-16x2': {
    id: 'lcd-16x2',
    title: '16×2 HD44780 Contrast & Backlight Loop',
    governingFormulaLatex: 'V_{\\text{contrast}} = 5.0\\,\\text{V} - V_0, \\quad \\text{Data Pins} = \\text{4-bit or 8-bit}',
    assumptions: 'Optimal twisted-nematic contrast requires V_0 ≈ 0.4–1.0 V (V_DD − V_0 ≈ 4.0–4.6 V).',
    isEducationalApproximation: true,
    primaryParam: { key: 'primary', label: 'Trim Potentiometer V_0', unit: 'V', min: 0, max: 3.5, step: 0.1, defaultValue: 0.7 },
    evaluate: (v0) => {
      const drive = 5 - v0;
      const visPct = Math.max(0, Math.min(100, 100 - Math.abs(v0 - 0.7) * 55));
      return {
        outputValue: `${visPct.toFixed(0)}% Contrast`,
        outputNumeric: Number(visPct.toFixed(0)),
        outputUnit: 'Clarity',
        secondaryOutput: `LC Drive V_DD−V_0 = ${drive.toFixed(1)} V · 6 GPIO pins needed in 4-bit mode (RS,E,D4-D7)`,
        normalizedPrimary: normOf(v0, 0, 3.5),
        observation: v0 > 1.8 ? 'V_0 too high — pixels appear blank white!' : 'Contrast near optimal ~4.3 V LC bias for crisp ASCII blocks.',
        curve: sweepCurve(0, 3.5, (v) => Math.max(0, Math.min(100, 100 - Math.abs(v - 0.7) * 55))),
        xLabel: 'Pin V0 Voltage',
        xUnit: 'V',
        yLabel: 'Readability',
        yUnit: '%',
      };
    },
  },
  'seven-seg': {
    id: 'seven-seg',
    title: '7-Segment LED Multiplexing & Segment Current',
    governingFormulaLatex: 'I_{\\text{seg}} = \\frac{V_{\\text{CC}} - V_f}{R_{\\text{lim}}}, \\quad f_{\\text{mux}} \\ge 100\\,\\text{Hz}',
    assumptions: 'Red GaAsP LED (V_f = 1.9 V) driven at 5 V TTL logic with 330 Ω limiting resistors.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Resistor per Segment', unit: 'Ω', min: 150, max: 1000, step: 30, defaultValue: 330 },
    evaluate: (r) => {
      const iSegMa = ((5.0 - 1.9) / r) * 1000;
      const total8Ma = iSegMa * 7;
      return {
        outputValue: `${iSegMa.toFixed(1)} mA / seg`,
        outputNumeric: Number(iSegMa.toFixed(1)),
        outputUnit: 'Segment I',
        secondaryOutput: `Digit "8" common return peak ≈ ${total8Ma.toFixed(1)} mA (needs transistor driver)`,
        normalizedPrimary: normOf(r, 150, 1000),
        observation: `Each segment draws ${iSegMa.toFixed(1)} mA; displaying "8" sinks ${total8Ma.toFixed(1)} mA through the common pin.`,
        curve: sweepCurve(150, 1000, (rv) => ((5.0 - 1.9) / rv) * 1000),
        xLabel: 'Limiting R',
        xUnit: 'Ω',
        yLabel: 'Segment I',
        yUnit: 'mA',
      };
    },
  },
  'dsp-processor': {
    id: 'dsp-processor',
    title: 'DSP Single-Cycle MAC & FIR Throughput',
    governingFormulaLatex: 'N_{\\max,\\text{taps}} = \\left\\lfloor \\frac{f_{\\text{DSP}}}{f_s} \\right\\rfloor',
    assumptions: 'Modified Harvard DSP core executing 1 Multiply-Accumulate + zero-overhead loop per clock.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'DSP Core Clock', unit: 'MHz', min: 20, max: 200, step: 10, defaultValue: 100 },
    secondaryParam: { key: 'secondary', label: 'Sample Rate f_s', unit: 'kHz', min: 8, max: 192, step: 8, defaultValue: 48 },
    evaluate: (clkMhz, fsKhz) => {
      const budgetTaps = Math.floor((clkMhz * 1000) / fsKhz);
      return {
        outputValue: `${budgetTaps} Taps / Sample`,
        outputNumeric: budgetTaps,
        outputUnit: 'Max FIR Order',
        secondaryOutput: `${clkMhz} MMAC/s sustained · Sample window = ${(1000 / fsKhz).toFixed(1)} μs`,
        normalizedPrimary: normOf(clkMhz, 20, 200),
        normalizedSecondary: normOf(fsKhz, 8, 192),
        observation: `A ${clkMhz} MHz MAC core executes up to ${budgetTaps} FIR taps per sample cleanly before next ADC interrupt.`,
        curve: sweepCurve(20, 200, (c) => Math.floor((c * 1000) / fsKhz)),
        xLabel: 'DSP Clock',
        xUnit: 'MHz',
        yLabel: 'FIR Tap Budget',
        yUnit: 'taps',
      };
    },
  },
  'sampling-quantizer': {
    id: 'sampling-quantizer',
    title: 'Nyquist Sampling Ratio & Quantization SQNR',
    governingFormulaLatex: '\\text{SQNR}_{\\text{dB}} \\approx 6.02\\,N + 1.76, \\quad f_s > 2 f_{\\max}',
    assumptions: 'Uniform N-bit mid-tread quantizer excited by full-scale sinusoid at f_max.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Quantizer Wordlength N', unit: 'bits', min: 4, max: 24, step: 1, defaultValue: 12 },
    evaluate: (bits) => {
      const sqnr = 6.02 * bits + 1.76;
      return {
        outputValue: `${sqnr.toFixed(1)} dB`,
        outputNumeric: Number(sqnr.toFixed(1)),
        outputUnit: 'SQNR',
        secondaryOutput: `Levels 2^N = ${Math.pow(2, Math.round(bits)).toLocaleString()} · ~6.02 dB gained per extra bit`,
        normalizedPrimary: normOf(bits, 4, 24),
        observation: `Each added ADC bit doubles voltage resolution and increases theoretical full-scale SQNR by 6.02 dB.`,
        curve: sweepCurve(4, 24, (n) => 6.02 * n + 1.76),
        xLabel: 'Resolution N',
        xUnit: 'bits',
        yLabel: 'SQNR',
        yUnit: 'dB',
      };
    },
  },
  'dft-fft-analyzer': {
    id: 'dft-fft-analyzer',
    title: 'Radix-2 FFT Speedup vs Direct DFT',
    governingFormulaLatex: '\\text{DFT} = N^2, \\quad \\text{FFT} = \\frac{N}{2}\\log_2 N, \\quad \\Delta f = \\frac{f_s}{N}',
    assumptions: 'Complex multiply count comparison across power-of-two block lengths N = 2^k.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Log2 Block Size k (N=2^k)', unit: 'stage', min: 3, max: 12, step: 1, defaultValue: 8 },
    evaluate: (k) => {
      const n = Math.pow(2, Math.round(k));
      const direct = n * n;
      const fft = (n / 2) * Math.round(k);
      const speedup = direct / fft;
      return {
        outputValue: `${speedup.toFixed(1)}× faster`,
        outputNumeric: Number(speedup.toFixed(1)),
        outputUnit: 'FFT Speedup',
        secondaryOutput: `N = ${n}: Direct DFT = ${direct.toLocaleString()} mults vs Radix-2 FFT = ${fft.toLocaleString()}`,
        normalizedPrimary: normOf(k, 3, 12),
        observation: `At N = ${n}, Radix-2 butterfly symmetry slashes complex multiplications from ${direct.toLocaleString()} to ${fft.toLocaleString()}.`,
        curve: sweepCurve(3, 12, (kv) => {
          const nv = Math.pow(2, Math.round(kv));
          return (nv * nv) / ((nv / 2) * Math.round(kv));
        }),
        xLabel: 'Stage k (N=2^k)',
        xUnit: 'k',
        yLabel: 'Speedup',
        yUnit: '×',
      };
    },
  },
  'fir-iir-filter': {
    id: 'fir-iir-filter',
    title: 'Digital Butterworth IIR Order & Magnitude Roll-Off',
    governingFormulaLatex: '|H(j\\omega)| = \\frac{1}{\\sqrt{1 + (\\omega / \\omega_c)^{2N}}}',
    assumptions: 'Low-pass digital filter mapped cleanly via Bilinear Transform from N-th order Butterworth.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Filter Order N', unit: 'poles', min: 1, max: 8, step: 1, defaultValue: 4 },
    evaluate: (order) => {
      const calcDb = (freqRatio: number) => -10 * Math.log10(1 + Math.pow(freqRatio, 2 * order));
      const attenAt2fc = calcDb(2.0);
      return {
        outputValue: `${attenAt2fc.toFixed(1)} dB @ 2f_c`,
        outputNumeric: Number(attenAt2fc.toFixed(1)),
        outputUnit: 'dB Atten',
        secondaryOutput: `Stopband slope = −${Math.round(order * 20)} dB/decade · All poles inside |z| < 1`,
        normalizedPrimary: normOf(order, 1, 8),
        observation: `A ${Math.round(order)}th-order IIR filter attenuates signals at twice cutoff frequency by ${attenAt2fc.toFixed(1)} dB.`,
        curve: sweepCurve(0.2, 4.0, calcDb),
        xLabel: 'f / fc Ratio',
        xUnit: '×fc',
        yLabel: 'Magnitude',
        yUnit: 'dB',
      };
    },
  },
  'state-space-feedback': {
    id: 'state-space-feedback',
    title: '2nd-Order State-Feedback Pole Placement (A − BK)',
    governingFormulaLatex: '\\dot{x} = (A - BK)x, \\quad \\omega_n = \\sqrt{k_1}, \\quad \\zeta = \\frac{k_2}{2\\sqrt{k_1}}',
    assumptions: 'Double-integrator plant ẍ = u stabilized cleanly via state feedback u = −k₁x₁ − k₂x₂ (k₁ = 16).',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'Velocity Gain k₂', unit: 'gain', min: 1, max: 14, step: 0.5, defaultValue: 5.6 },
    evaluate: (k2) => {
      const wn = 4.0;
      const zeta = k2 / (2 * wn);
      const mp = zeta < 1 ? Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta)) * 100 : 0;
      return {
        outputValue: `ζ = ${zeta.toFixed(2)} · %Mp = ${mp.toFixed(1)}%`,
        outputNumeric: Number(zeta.toFixed(2)),
        outputUnit: 'Damping ζ',
        secondaryOutput: `Closed-loop eigenvalues: ${zeta < 1 ? `−${(zeta * wn).toFixed(2)} ± j${(wn * Math.sqrt(1 - zeta * zeta)).toFixed(2)}` : 'Overdamped Real LHP'}`,
        normalizedPrimary: normOf(k2, 1, 14),
        observation: `Tuning k₂ = ${k2.toFixed(1)} places damping ratio ζ = ${zeta.toFixed(2)}, yielding ${mp.toFixed(1)}% overshoot.`,
        curve: sweepCurve(1, 14, (v) => {
          const z = v / 8;
          return z < 1 ? Math.exp((-z * Math.PI) / Math.sqrt(1 - z * z)) * 100 : 0;
        }),
        xLabel: 'Gain k₂',
        xUnit: 'N·s/m',
        yLabel: 'Overshoot',
        yUnit: '%',
      };
    },
  },
  'lqr-optimal-regulator': {
    id: 'lqr-optimal-regulator',
    title: 'LQR Riccati Tradeoff: State Weight Q vs Effort R',
    governingFormulaLatex: 'J = \\int_0^\\infty (q\\,x^2 + R\\,u^2)\\,dt, \\quad K^* = \\sqrt{q/R}',
    assumptions: 'Scalar integrator plant ẋ = u solved exactly via continuous Algebraic Riccati Equation.',
    isEducationalApproximation: false,
    primaryParam: { key: 'primary', label: 'State Weight Q', unit: 'q', min: 1, max: 100, step: 1, defaultValue: 16 },
    secondaryParam: { key: 'secondary', label: 'Control Weight R', unit: 'r', min: 0.25, max: 10, step: 0.25, defaultValue: 1 },
    evaluate: (q, r) => {
      const k = Math.sqrt(q / Math.max(0.1, r));
      const ts = 4 / k;
      return {
        outputValue: `K* = ${k.toFixed(2)}`,
        outputNumeric: Number(k.toFixed(2)),
        outputUnit: 'Optimal Gain',
        secondaryOutput: `2% Settling time ≈ ${ts.toFixed(2)} s · Guaranteed Phase Margin ≥ 60°`,
        normalizedPrimary: normOf(q, 1, 100),
        normalizedSecondary: normOf(r, 0.25, 10),
        observation: `Penalizing error at Q = ${q} vs effort R = ${r} gives optimal Riccati feedback K* = ${k.toFixed(2)}.`,
        curve: sweepCurve(1, 100, (qv) => Math.sqrt(qv / Math.max(0.1, r))),
        xLabel: 'Weight Q',
        xUnit: 'q',
        yLabel: 'Gain K*',
        yUnit: 'gain',
      };
    },
  },
};

