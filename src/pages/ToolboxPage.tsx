import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MathBlock } from '@/components/MathBlock';
import { useApp } from '@/context/AppContext';

type ToolId =
  | 'rtd-resistance'
  | 'temp-conversion'
  | 'thermocouple-emf'
  | 'pressure-units'
  | 'flow-rate'
  | 'level-dp'
  | 'loop-scaling'
  | 'adc-resolution'
  | 'wheatstone-bridge'
  | 'measurement-error'
  | 'pid-tuning';

const TOOLS: { id: ToolId; short: string; title: string; formula: string }[] = [
  { id: 'rtd-resistance', short: 'RTD CVD', title: 'RTD Resistance & Callendar-Van Dusen (IEC 60751)', formula: 'R(t) = R_0(1 + At + Bt^2 + C(t-100)t^3)' },
  { id: 'temp-conversion', short: 'Temp Units', title: 'Temperature Scale & Thermal Span Converter', formula: 'T_{\\text{K}} = T_{\\text{C}} + 273.15, \\quad T_{\\text{F}} = 1.8\\,T_{\\text{C}} + 32' },
  { id: 'thermocouple-emf', short: 'TC + CJC', title: 'Thermocouple ITS-90 Reference & Cold-Junction Compensation', formula: 'E(T_m, 0^\\circ\\text{C}) = E_{\\text{meas}} + E(T_{cj}, 0^\\circ\\text{C})' },
  { id: 'pressure-units', short: 'Pressure', title: 'Pressure Unit & Hydrostatic Head Converter', formula: 'P = \\rho \\cdot g \\cdot h' },
  { id: 'flow-rate', short: 'Orifice Flow', title: 'ISO 5167 Differential Pressure / Orifice Flow Calculator', formula: 'Q = C_d \\cdot \\frac{\\pi d^2}{4\\sqrt{1-\\beta^4}} \\sqrt{\\frac{2\\Delta P}{\\rho}}' },
  { id: 'level-dp', short: 'DP Level', title: 'Hydrostatic Tank Level (Open / Dry Leg / Wet Leg)', formula: '\\text{LRV} = \\rho_{\\text{proc}} g h_0 - \\rho_{\\text{seal}} g H_{\\text{wet}}' },
  { id: 'loop-scaling', short: '4–20 mA', title: '4–20 mA Loop Scaling, NAMUR NE43 & Load Budget', formula: 'I = 4 + 16\\left(\\frac{\\text{PV}-\\text{LRV}}{\\text{URV}-\\text{LRV}}\\right), \\quad R_{\\max} = \\frac{V_s - V_{\\min}}{0.0215}' },
  { id: 'adc-resolution', short: 'ADC / ENOB', title: 'ADC Quantization Resolution, Counts & ENOB', formula: '\\text{LSB} = \\frac{V_{\\text{FS}}}{2^N}, \\quad \\text{SNR} = 6.02N + 1.76\\text{ dB}' },
  { id: 'wheatstone-bridge', short: 'Bridge', title: 'Wheatstone Bridge Unbalanced Voltage & Strain Sensitivity', formula: 'V_{\\text{out}} = V_{\\text{exc}}\\left(\\frac{R_3}{R_3+R_4} - \\frac{R_2}{R_1+R_2}\\right)' },
  { id: 'measurement-error', short: 'Error / TUR', title: 'Measurement Error, RSS Uncertainty & Test Uncertainty Ratio', formula: 'U_{\\text{RSS}} = \\sqrt{\\sum u_i^2}, \\quad \\text{TUR} = \\frac{\\text{UUT Tol}}{\\text{Ref Tol}}' },
  { id: 'pid-tuning', short: 'PID + Step', title: 'PID Tuning Rules (ZN / IMC) & Closed-Loop Step Simulator', formula: 'G_p(s) = \\frac{K e^{-\\theta s}}{\\tau s + 1}, \\quad G_c(s) = K_c\\left(1 + \\frac{1}{T_i s} + T_d s\\right)' },
];

// IEC 60584 / NIST ITS-90 lookup tables (t in °C, mV wrt 0 °C) for clean piecewise cubic/linear accuracy
const TC_TABLES: Record<'K' | 'J' | 'T' | 'E' | 'N' | 'S', { range: [number, number]; pts: [number, number][] }> = {
  K: {
    range: [-200, 1300],
    pts: [
      [-200, -5.891], [-100, -3.554], [0, 0], [25, 1.000], [50, 2.023], [100, 4.096],
      [200, 8.138], [300, 12.209], [400, 16.397], [500, 20.644], [600, 24.905],
      [700, 29.129], [800, 33.275], [900, 37.326], [1000, 41.276], [1100, 45.119], [1200, 48.838], [1300, 52.410],
    ],
  },
  J: {
    range: [-200, 760],
    pts: [
      [-200, -7.890], [-100, -4.633], [0, 0], [25, 1.277], [50, 2.585], [100, 5.269],
      [200, 10.779], [300, 16.327], [400, 21.848], [500, 27.393], [600, 33.102], [700, 39.132], [760, 42.919],
    ],
  },
  T: {
    range: [-200, 400],
    pts: [
      [-200, -5.603], [-100, -3.379], [0, 0], [25, 0.992], [50, 2.036], [100, 4.279],
      [150, 6.704], [200, 9.288], [250, 12.013], [300, 14.862], [350, 17.819], [400, 20.872],
    ],
  },
  E: {
    range: [-200, 900],
    pts: [
      [-200, -8.825], [-100, -5.237], [0, 0], [25, 1.495], [50, 3.048], [100, 6.319],
      [200, 13.421], [300, 21.036], [400, 28.946], [500, 37.005], [600, 45.093], [700, 53.112], [800, 61.017], [900, 68.787],
    ],
  },
  N: {
    range: [-200, 1300],
    pts: [
      [-200, -3.990], [-100, -2.407], [0, 0], [25, 0.659], [50, 1.340], [100, 2.774],
      [200, 5.913], [400, 12.974], [600, 20.613], [800, 28.455], [1000, 36.256], [1200, 43.846], [1300, 47.513],
    ],
  },
  S: {
    range: [0, 1700],
    pts: [
      [0, 0], [25, 0.143], [50, 0.299], [100, 0.646], [200, 1.441], [400, 3.259],
      [600, 5.239], [800, 7.345], [1000, 9.587], [1200, 11.951], [1400, 14.373], [1600, 16.777], [1700, 17.947],
    ],
  },
};

function tcTempToMv(type: keyof typeof TC_TABLES, tempC: number): number {
  const pts = TC_TABLES[type].pts;
  if (tempC <= pts[0][0]) return pts[0][1];
  if (tempC >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (tempC >= t0 && tempC <= t1) {
      return v0 + ((tempC - t0) / (t1 - t0)) * (v1 - v0);
    }
  }
  return 0;
}

function tcMvToTemp(type: keyof typeof TC_TABLES, mv: number): number {
  const pts = TC_TABLES[type].pts;
  if (mv <= pts[0][1]) return pts[0][0];
  if (mv >= pts[pts.length - 1][1]) return pts[pts.length - 1][0];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (mv >= v0 && mv <= v1) {
      return t0 + ((mv - v0) / (v1 - v0)) * (t1 - t0);
    }
  }
  return 0;
}

// Callendar-Van Dusen IEC 60751 Pt solver
const CVD_A = 3.9083e-3;
const CVD_B = -5.775e-7;
const CVD_C = -4.183e-12;

function cvdTempToRes(r0: number, t: number): number {
  if (t >= 0) return r0 * (1 + CVD_A * t + CVD_B * t * t);
  return r0 * (1 + CVD_A * t + CVD_B * t * t + CVD_C * (t - 100) * t * t * t);
}

function cvdResToTemp(r0: number, r: number): number {
  if (r >= r0) {
    const disc = CVD_A * CVD_A - 4 * CVD_B * (1 - r / r0);
    if (disc < 0) return NaN;
    return (-CVD_A + Math.sqrt(disc)) / (2 * CVD_B);
  }
  // Bisection below 0 °C (−200 to 0 °C)
  let lo = -200;
  let hi = 0;
  for (let i = 0; i < 40; i++) {
    const mid = 0.5 * (lo + hi);
    if (cvdTempToRes(r0, mid) < r) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const PRESSURE_FACTORS_PA: Record<string, number> = {
  Pa: 1,
  kPa: 1000,
  MPa: 1e6,
  bar: 1e5,
  mbar: 100,
  psi: 6894.757,
  atm: 101325,
  mmHg: 133.322,
  mmH2O: 9.80665,
  inH2O: 249.089,
};

export function ToolboxPage() {
  const { toolId } = useParams<{ toolId?: string }>();
  const navigate = useNavigate();
  const { theme } = useApp();

  const activeId: ToolId = TOOLS.find((t) => t.id === toolId)?.id ?? 'rtd-resistance';
  const activeTool = TOOLS.find((t) => t.id === activeId) ?? TOOLS[0];

  // 1. RTD State
  const [rtdMode, setRtdMode] = useState<'t2r' | 'r2t'>('t2r');
  const [rtdR0, setRtdR0] = useState<100 | 500 | 1000>(100);
  const [rtdTemp, setRtdTemp] = useState(200);
  const [rtdResInput, setRtdResInput] = useState(175.86);
  const [leadResOhms, setLeadResOhms] = useState(2.0);

  // 2. Temp Units State
  const [tempVal, setTempVal] = useState(100);
  const [tempUnit, setTempUnit] = useState<'C' | 'F' | 'K' | 'R'>('C');

  // 3. Thermocouple State
  const [tcType, setTcType] = useState<keyof typeof TC_TABLES>('K');
  const [tcMode, setTcMode] = useState<'t2mv' | 'mv2t'>('t2mv');
  const [tcHotTemp, setTcHotTemp] = useState(400);
  const [tcCjcTemp, setTcCjcTemp] = useState(25);
  const [tcMeasMv, setTcMeasMv] = useState(15.397);

  // 4. Pressure State
  const [pressVal, setPressVal] = useState(10);
  const [pressUnit, setPressUnit] = useState('bar');
  const [headRho, setHeadRho] = useState(1000);
  const [headHeight, setHeadHeight] = useState(5.0);

  // 5. Flow State
  const [pipeD, setPipeD] = useState(100); // mm
  const [boreD, setBoreD] = useState(55); // mm
  const [cdVal, setCdVal] = useState(0.608);
  const [flowRho, setFlowRho] = useState(998);
  const [flowDpKpa, setFlowDpKpa] = useState(25);

  // 6. Level DP State
  const [levelConfig, setLevelConfig] = useState<'open' | 'dry' | 'wet'>('wet');
  const [lvlSpanM, setLvlSpanM] = useState(2.0);
  const [lvlZeroOffsetM, setLvlZeroOffsetM] = useState(0.5);
  const [lvlSgProc, setLvlSgProc] = useState(0.85);
  const [lvlWetM, setLvlWetM] = useState(3.2);
  const [lvlSgSeal, setLvlSgSeal] = useState(1.05);

  // 7. 4-20 mA State
  const [loopLrv, setLoopLrv] = useState(0);
  const [loopUrv, setLoopUrv] = useState(250);
  const [loopUnit, setLoopUnit] = useState('°C');
  const [loopPv, setLoopPv] = useState(150);
  const [loopMaInput, setLoopMaInput] = useState(13.6);
  const [loopDir, setLoopDir] = useState<'pv2ma' | 'ma2pv'>('pv2ma');
  const [loopSupply, setLoopSupply] = useState(24);
  const [loopTxMinV, setLoopTxMinV] = useState(12);
  const [loopLoadOhms, setLoopLoadOhms] = useState(290);

  // 8. ADC State
  const [adcBits, setAdcBits] = useState(16);
  const [adcVfs, setAdcVfs] = useState(5.0);
  const [adcVin, setAdcVin] = useState(2.5);
  const [adcSinad, setAdcSinad] = useState(86.0);

  // 9. Wheatstone Bridge State
  const [wbTopo, setWbTopo] = useState<'quarter' | 'half' | 'full'>('quarter');
  const [wbVexc, setWbVexc] = useState(5.0);
  const [wbRnom, setWbRnom] = useState(350);
  const [wbDeltaR, setWbDeltaR] = useState(1.4);

  // 10. Measurement Error & TUR State
  const [errMeasured, setErrMeasured] = useState(100.4);
  const [errTrue, setErrTrue] = useState(100.0);
  const [errSpan, setErrSpan] = useState(200.0);
  const [errUutTol, setErrUutTol] = useState(0.5);
  const [errRefTol, setErrRefTol] = useState(0.1);

  // 11. PID Tuning & Closed-Loop Step Simulation State
  const [pidK, setPidK] = useState(1.5);
  const [pidTau, setPidTau] = useState(12);
  const [pidTheta, setPidTheta] = useState(3);
  const [pidRule, setPidRule] = useState<'zn' | 'imc'>('imc');

  // Computed outputs for active tools
  const rtdCalc = useMemo(() => {
    const tClamped = Math.max(-200, Math.min(850, rtdTemp));
    const rExact = cvdTempToRes(rtdR0, tClamped);
    const tInv = cvdResToTemp(rtdR0, rtdResInput);
    const refTemp = rtdMode === 't2r' ? tClamped : tInv;
    const classATol = 0.15 + 0.002 * Math.abs(refTemp);
    const classBTol = 0.30 + 0.005 * Math.abs(refTemp);
    const twoWireErr = leadResOhms / (0.00385 * rtdR0);
    return { rExact, tInv, classATol, classBTol, twoWireErr };
  }, [rtdMode, rtdR0, rtdTemp, rtdResInput, leadResOhms]);

  const tempCalc = useMemo(() => {
    let c = tempVal;
    if (tempUnit === 'F') c = (tempVal - 32) / 1.8;
    else if (tempUnit === 'K') c = tempVal - 273.15;
    else if (tempUnit === 'R') c = (tempVal - 491.67) / 1.8;
    return {
      C: c,
      F: c * 1.8 + 32,
      K: c + 273.15,
      R: (c + 273.15) * 1.8,
      valid: c >= -273.15,
    };
  }, [tempVal, tempUnit]);

  const tcCalc = useMemo(() => {
    const eCjc = tcTempToMv(tcType, tcCjcTemp);
    if (tcMode === 't2mv') {
      const eHot0 = tcTempToMv(tcType, tcHotTemp);
      const eNet = eHot0 - eCjc;
      return { eHot0, eCjc, eNet, hotTemp: tcHotTemp };
    }
    const eHot0 = tcMeasMv + eCjc;
    const hotTemp = tcMvToTemp(tcType, eHot0);
    return { eHot0, eCjc, eNet: tcMeasMv, hotTemp };
  }, [tcType, tcMode, tcHotTemp, tcCjcTemp, tcMeasMv]);

  const flowCalc = useMemo(() => {
    const valid = pipeD > 0 && boreD > 0 && boreD < pipeD && flowRho > 0 && flowDpKpa >= 0;
    if (!valid) return { valid: false, beta: 0, qM3h: 0, mKgh: 0, permLossKpa: 0, velMps: 0 };
    const beta = boreD / pipeD;
    const dM = boreD / 1000;
    const areaOrf = (Math.PI * dM * dM) / 4;
    const dpPa = flowDpKpa * 1000;
    const qM3s = (cdVal * areaOrf / Math.sqrt(1 - Math.pow(beta, 4))) * Math.sqrt((2 * dpPa) / flowRho);
    const qM3h = qM3s * 3600;
    const mKgh = qM3s * flowRho * 3600;
    const permLossKpa = flowDpKpa * (1 - Math.pow(beta, 1.9));
    const pipeArea = (Math.PI * Math.pow(pipeD / 1000, 2)) / 4;
    const velMps = qM3s / pipeArea;
    return { valid: true, beta, qM3h, mKgh, permLossKpa, velMps };
  }, [pipeD, boreD, cdVal, flowRho, flowDpKpa]);

  const levelCalc = useMemo(() => {
    const g = 9.81;
    const spanKpa = lvlSgProc * 1000 * g * lvlSpanM / 1000;
    let lrvKpa = 0;
    if (levelConfig === 'open' || levelConfig === 'dry') {
      lrvKpa = lvlSgProc * 1000 * g * lvlZeroOffsetM / 1000;
    } else {
      const highAtZero = lvlSgProc * 1000 * g * lvlZeroOffsetM / 1000;
      const wetHead = lvlSgSeal * 1000 * g * lvlWetM / 1000;
      lrvKpa = highAtZero - wetHead;
    }
    const urvKpa = lrvKpa + spanKpa;
    return {
      lrvKpa,
      urvKpa,
      spanKpa,
      lrvMmH2O: lrvKpa * 101.972,
      urvMmH2O: urvKpa * 101.972,
      modeNote: lrvKpa < 0 ? 'Zero Elevation (LRV < 0)' : lrvKpa > 0 ? 'Zero Suppression (LRV > 0)' : 'Exact Zero',
    };
  }, [levelConfig, lvlSpanM, lvlZeroOffsetM, lvlSgProc, lvlWetM, lvlSgSeal]);

  const loopCalc = useMemo(() => {
    const span = loopUrv - loopLrv;
    const valid = span !== 0;
    let ma = loopMaInput;
    let pv = loopPv;
    if (valid) {
      if (loopDir === 'pv2ma') {
        ma = 4 + 16 * ((loopPv - loopLrv) / span);
      } else {
        pv = loopLrv + ((loopMaInput - 4) / 16) * span;
      }
    }
    const pct = valid ? ((pv - loopLrv) / span) * 100 : 0;
    const namur =
      ma <= 3.6
        ? 'Downscale Fault Alarm (≤ 3.6 mA)'
        : ma >= 21.0
        ? 'Upscale Fault Alarm (≥ 21.0 mA)'
        : ma >= 3.8 && ma <= 20.5
        ? 'Valid Live Band (NAMUR NE43)'
        : 'Out-of-Band Warning';
    const rMax = Math.max(0, (loopSupply - loopTxMinV) / 0.0215);
    const txVoltageAt215 = loopSupply - 0.0215 * loopLoadOhms;
    return { valid, ma, pv, pct, namur, rMax, txVoltageAt215 };
  }, [loopLrv, loopUrv, loopPv, loopMaInput, loopDir, loopSupply, loopTxMinV, loopLoadOhms]);

  const pidCalc = useMemo(() => {
    const tau = Math.max(0.5, pidTau);
    const theta = Math.max(0.2, pidTheta);
    const K = Math.max(0.1, pidK);

    // Tuning gains
    let kc = 1;
    let ti = 10;
    let td = 0;
    if (pidRule === 'zn') {
      // Ziegler-Nichols open-loop reaction curve
      kc = (1.2 * tau) / (K * theta);
      ti = 2.0 * theta;
      td = 0.5 * theta;
    } else {
      // Skogestad / IMC lambda tuning: lambda = max(theta, 0.5*tau)
      const lambda = Math.max(theta, 0.35 * tau);
      kc = tau / (K * (lambda + theta));
      ti = Math.min(tau, 4 * (lambda + theta));
      td = 0;
    }

    // Closed-loop FOPDT discrete time-step response simulation (SP step 0 -> 1.0)
    const dt = 0.25;
    const totalT = Math.min(120, Math.max(30, (tau + theta) * 4));
    const steps = Math.floor(totalT / dt);
    const delaySteps = Math.max(1, Math.round(theta / dt));
    const uHist = new Array(steps + delaySteps + 5).fill(0);
    let y = 0;
    let integral = 0;
    let prevY = 0;
    const series: { t: number; pv: number; sp: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = Number((i * dt).toFixed(2));
      const sp = t >= 1.0 ? 1.0 : 0.0;
      const e = sp - y;
      integral += (e * dt) / Math.max(0.1, ti);
      const deriv = -(y - prevY) / dt; // Derivative on PV
      let u = kc * (e + integral + td * deriv);
      u = Math.max(-2, Math.min(3, u));
      uHist[i + delaySteps] = u;
      const uDelayed = uHist[i];
      prevY = y;
      y = y + (dt / tau) * (K * uDelayed - y);
      if (i % 2 === 0) {
        series.push({ t, pv: Number(y.toFixed(3)), sp });
      }
    }

    return { kc, ti, td, series };
  }, [pidK, pidTau, pidTheta, pidRule]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header>
        <p className="eyebrow text-[var(--st-cyan)]">ENGINEERING TOOLBOX · 11 VALIDATED SOLVERS</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)]">
          Instrumentation &amp; Control Engineering Calculators
        </h1>
        <p className="muted mt-1 text-sm">
          Real physical equations with SI/plant unit validation, NAMUR NE43 diagnostics, and closed-loop PID step visualization.
        </p>
      </header>

      {/* Calculator Selector Bar */}
      <div className="seg" role="tablist" aria-label="Select calculator">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeId === t.id}
            onClick={() => navigate(`/toolbox/${t.id}`)}
            className={activeId === t.id ? 'on' : ''}
          >
            {t.short}
          </button>
        ))}
      </div>

      {/* Active Calculator Workspace */}
      <section className="glass space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--st-line)] pb-4">
          <div>
            <span className="eyebrow text-[var(--st-cyan)]">ACTIVE ENGINEERING CALCULATOR</span>
            <h2 className="mt-1 text-xl font-semibold text-[var(--st-on)]">{activeTool.title}</h2>
          </div>
          <div className="rounded-2xl bg-[var(--st-void)] px-4 py-2">
            <MathBlock latex={activeTool.formula} displayMode={false} />
          </div>
        </div>

        {/* 1. RTD Callendar-Van Dusen */}
        {activeId === 'rtd-resistance' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-4 p-5">
              <div className="seg">
                <button type="button" onClick={() => setRtdMode('t2r')} className={rtdMode === 't2r' ? 'on' : ''}>
                  Temp (°C) → Resistance (Ω)
                </button>
                <button type="button" onClick={() => setRtdMode('r2t')} className={rtdMode === 'r2t' ? 'on' : ''}>
                  Resistance (Ω) → Temp (°C)
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="label">Element R₀ (0 °C)</span>
                  <select
                    value={rtdR0}
                    onChange={(e) => setRtdR0(Number(e.target.value) as 100 | 500 | 1000)}
                    className="field-rect"
                  >
                    <option value={100}>Pt100 (100 Ω)</option>
                    <option value={500}>Pt500 (500 Ω)</option>
                    <option value={1000}>Pt1000 (1000 Ω)</option>
                  </select>
                </label>
                {rtdMode === 't2r' ? (
                  <label className="space-y-1">
                    <span className="label">Temperature (−200 to 850 °C)</span>
                    <input
                      type="number"
                      step="any"
                      value={rtdTemp}
                      onChange={(e) => setRtdTemp(Number(e.target.value))}
                      className="field-rect"
                    />
                  </label>
                ) : (
                  <label className="space-y-1">
                    <span className="label">Measured Element Resistance (Ω)</span>
                    <input
                      type="number"
                      step="any"
                      value={rtdResInput}
                      onChange={(e) => setRtdResInput(Number(e.target.value))}
                      className="field-rect"
                    />
                  </label>
                )}
              </div>
              <label className="block space-y-1">
                <span className="label">2-Wire Cable Loop Resistance (Ω)</span>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={leadResOhms}
                  onChange={(e) => setLeadResOhms(Math.max(0, Number(e.target.value)))}
                  className="field-rect"
                />
              </label>
            </div>

            <div className="sub space-y-2 p-5">
              <p className="eyebrow text-[var(--st-cyan)]">IEC 60751 CALCULATED RESULTS</p>
              <div className="kv">
                <span>{rtdMode === 't2r' ? 'Platinum Resistance R(t)' : 'Computed Temperature t'}</span>
                <span className="text-base font-bold text-[var(--st-cyan)]">
                  {rtdMode === 't2r'
                    ? `${rtdCalc.rExact.toFixed(3)} Ω`
                    : `${Number.isNaN(rtdCalc.tInv) ? 'Out of Range' : rtdCalc.tInv.toFixed(2)} °C`}
                </span>
              </div>
              <div className="kv">
                <span>Class A Tolerance Band</span>
                <span>±{rtdCalc.classATol.toFixed(3)} °C</span>
              </div>
              <div className="kv">
                <span>Class B Tolerance Band</span>
                <span>±{rtdCalc.classBTol.toFixed(3)} °C</span>
              </div>
              <div className="kv">
                <span>Uncompensated 2-Wire Cable Offset</span>
                <span className="text-[var(--st-amber)]">+{rtdCalc.twoWireErr.toFixed(2)} °C</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Temperature Unit Converter */}
        {activeId === 'temp-conversion' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub grid gap-3 p-5 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="label">Input Temperature</span>
                <input
                  type="number"
                  step="any"
                  value={tempVal}
                  onChange={(e) => setTempVal(Number(e.target.value))}
                  className="field-rect"
                />
              </label>
              <label className="space-y-1">
                <span className="label">Input Unit</span>
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value as 'C' | 'F' | 'K' | 'R')}
                  className="field-rect"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                  <option value="R">Rankine (°R)</option>
                </select>
              </label>
            </div>
            <div className="sub space-y-2 p-5">
              {!tempCalc.valid ? (
                <p className="text-xs text-[var(--st-crimson)]">Invalid temperature: below Absolute Zero (0 K / −273.15 °C).</p>
              ) : (
                <>
                  <div className="kv"><span>Celsius</span><span className="text-[var(--st-cyan)]">{tempCalc.C.toFixed(3)} °C</span></div>
                  <div className="kv"><span>Fahrenheit</span><span>{tempCalc.F.toFixed(3)} °F</span></div>
                  <div className="kv"><span>Kelvin (Absolute)</span><span>{tempCalc.K.toFixed(3)} K</span></div>
                  <div className="kv"><span>Rankine (Absolute)</span><span>{tempCalc.R.toFixed(3)} °R</span></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. Thermocouple + CJC */}
        {activeId === 'thermocouple-emf' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <div className="seg">
                  <button type="button" onClick={() => setTcMode('t2mv')} className={tcMode === 't2mv' ? 'on' : ''}>
                    Temp → Terminal mV
                  </button>
                  <button type="button" onClick={() => setTcMode('mv2t')} className={tcMode === 'mv2t' ? 'on' : ''}>
                    Terminal mV → Hot Temp
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1">
                  <span className="label">IEC Type</span>
                  <select
                    value={tcType}
                    onChange={(e) => setTcType(e.target.value as keyof typeof TC_TABLES)}
                    className="field-rect"
                  >
                    <option value="K">Type K (Chromel/Alumel)</option>
                    <option value="J">Type J (Iron/Constantan)</option>
                    <option value="T">Type T (Copper/Constantan)</option>
                    <option value="E">Type E (Chromel/Constantan)</option>
                    <option value="N">Type N (Nicrosil/Nisil)</option>
                    <option value="S">Type S (Pt10Rh/Pt)</option>
                  </select>
                </label>
                {tcMode === 't2mv' ? (
                  <label className="space-y-1">
                    <span className="label">Hot Junction T_m (°C)</span>
                    <input type="number" step="any" value={tcHotTemp} onChange={(e) => setTcHotTemp(Number(e.target.value))} className="field-rect" />
                  </label>
                ) : (
                  <label className="space-y-1">
                    <span className="label">Measured Terminal mV</span>
                    <input type="number" step="0.001" value={tcMeasMv} onChange={(e) => setTcMeasMv(Number(e.target.value))} className="field-rect" />
                  </label>
                )}
                <label className="space-y-1">
                  <span className="label">Cold Junction T_cj (°C)</span>
                  <input type="number" step="any" value={tcCjcTemp} onChange={(e) => setTcCjcTemp(Number(e.target.value))} className="field-rect" />
                </label>
              </div>
            </div>

            <div className="sub space-y-2 p-5">
              <p className="eyebrow text-[var(--st-cyan)]">ITS-90 COLD-JUNCTION COMPENSATED OUTPUT</p>
              <div className="kv"><span>Table EMF E(T_cj, 0 °C)</span><span>{tcCalc.eCjc.toFixed(3)} mV</span></div>
              <div className="kv"><span>Measured Terminal Net EMF</span><span>{tcCalc.eNet.toFixed(3)} mV</span></div>
              <div className="kv"><span>0 °C Referenced EMF E(T_m, 0 °C)</span><span>{tcCalc.eHot0.toFixed(3)} mV</span></div>
              <div className="kv">
                <span>Process Hot Junction Temperature</span>
                <span className="text-base font-bold text-[var(--st-cyan)]">{tcCalc.hotTemp.toFixed(2)} °C</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Pressure Units & Head */}
        {activeId === 'pressure-units' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-3 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="label">Pressure Value</span>
                  <input type="number" step="any" value={pressVal} onChange={(e) => setPressVal(Number(e.target.value))} className="field-rect" />
                </label>
                <label className="space-y-1">
                  <span className="label">Input Unit</span>
                  <select value={pressUnit} onChange={(e) => setPressUnit(e.target.value)} className="field-rect">
                    {Object.keys(PRESSURE_FACTORS_PA).map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 border-t border-[var(--st-line)] pt-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="label">Liquid Density ρ (kg/m³)</span>
                  <input type="number" min={1} value={headRho} onChange={(e) => setHeadRho(Math.max(1, Number(e.target.value)))} className="field-rect" />
                </label>
                <label className="space-y-1">
                  <span className="label">Column Height h (m)</span>
                  <input type="number" step="0.1" value={headHeight} onChange={(e) => setHeadHeight(Number(e.target.value))} className="field-rect" />
                </label>
              </div>
            </div>
            <div className="sub space-y-1.5 p-5">
              {(() => {
                const pa = pressVal * (PRESSURE_FACTORS_PA[pressUnit] ?? 1);
                const headKpa = (headRho * 9.81 * headHeight) / 1000;
                return (
                  <>
                    <div className="kv"><span>kPa</span><span className="text-[var(--st-cyan)]">{(pa / 1000).toFixed(4)} kPa</span></div>
                    <div className="kv"><span>bar</span><span>{(pa / 1e5).toFixed(5)} bar</span></div>
                    <div className="kv"><span>psi</span><span>{(pa / 6894.757).toFixed(4)} psi</span></div>
                    <div className="kv"><span>mmH₂O</span><span>{(pa / 9.80665).toFixed(2)} mmH₂O</span></div>
                    <div className="kv"><span>mmHg (Torr)</span><span>{(pa / 133.322).toFixed(2)} mmHg</span></div>
                    <div className="kv"><span>Hydrostatic ρgh ({headHeight} m)</span><span className="text-[var(--st-phosphor)]">{headKpa.toFixed(3)} kPa</span></div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* 5. Orifice Flow Calculator */}
        {activeId === 'flow-rate' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub grid gap-3 p-5 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="label">Pipe Internal ID D (mm)</span>
                <input type="number" min={5} value={pipeD} onChange={(e) => setPipeD(Number(e.target.value))} className="field-rect" />
              </label>
              <label className="space-y-1">
                <span className="label">Orifice Bore d (mm)</span>
                <input type="number" min={1} value={boreD} onChange={(e) => setBoreD(Number(e.target.value))} className="field-rect" />
              </label>
              <label className="space-y-1">
                <span className="label">Discharge Coeff Cd</span>
                <input type="number" step="0.005" value={cdVal} onChange={(e) => setCdVal(Number(e.target.value))} className="field-rect" />
              </label>
              <label className="space-y-1">
                <span className="label">Fluid Density ρ (kg/m³)</span>
                <input type="number" min={0.1} step="1" value={flowRho} onChange={(e) => setFlowRho(Number(e.target.value))} className="field-rect" />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="label">Measured Differential Pressure ΔP (kPa)</span>
                <input type="number" min={0} step="0.5" value={flowDpKpa} onChange={(e) => setFlowDpKpa(Number(e.target.value))} className="field-rect" />
              </label>
            </div>
            <div className="sub space-y-2 p-5">
              {!flowCalc.valid ? (
                <p className="text-xs text-[var(--st-crimson)]">Invalid geometry: ensure 0 &lt; bore d &lt; pipe D and ρ &gt; 0.</p>
              ) : (
                <>
                  <div className="kv"><span>Beta Ratio (β = d/D)</span><span>{flowCalc.beta.toFixed(3)} {flowCalc.beta < 0.2 || flowCalc.beta > 0.75 ? '(Out of ISO 0.2–0.75)' : '(ISO OK)'}</span></div>
                  <div className="kv"><span>Volumetric Flow Q</span><span className="text-base font-bold text-[var(--st-cyan)]">{flowCalc.qM3h.toFixed(2)} m³/h</span></div>
                  <div className="kv"><span>Mass Flow ṁ</span><span>{flowCalc.mKgh.toFixed(1)} kg/h</span></div>
                  <div className="kv"><span>Upstream Pipe Velocity</span><span>{flowCalc.velMps.toFixed(2)} m/s</span></div>
                  <div className="kv"><span>Permanent Unrecovered Loss</span><span className="text-[var(--st-amber)]">{flowCalc.permLossKpa.toFixed(2)} kPa</span></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 6. DP Level (Open / Dry / Wet Leg) */}
        {activeId === 'level-dp' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-3 p-5">
              <div className="seg">
                <button type="button" onClick={() => setLevelConfig('open')} className={levelConfig === 'open' ? 'on' : ''}>Open Tank</button>
                <button type="button" onClick={() => setLevelConfig('dry')} className={levelConfig === 'dry' ? 'on' : ''}>Closed Dry Leg</button>
                <button type="button" onClick={() => setLevelConfig('wet')} className={levelConfig === 'wet' ? 'on' : ''}>Closed Wet Leg</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1"><span className="label">Level Span H (m)</span><input type="number" step="0.1" value={lvlSpanM} onChange={(e) => setLvlSpanM(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Process Liquid SG</span><input type="number" step="0.01" value={lvlSgProc} onChange={(e) => setLvlSgProc(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">0% Height Above Tx (m)</span><input type="number" step="0.1" value={lvlZeroOffsetM} onChange={(e) => setLvlZeroOffsetM(Number(e.target.value))} className="field-rect" /></label>
                {levelConfig === 'wet' && (
                  <>
                    <label className="space-y-1"><span className="label">Wet Leg Height (m)</span><input type="number" step="0.1" value={lvlWetM} onChange={(e) => setLvlWetM(Number(e.target.value))} className="field-rect" /></label>
                    <label className="space-y-1"><span className="label">Seal Fluid SG</span><input type="number" step="0.01" value={lvlSgSeal} onChange={(e) => setLvlSgSeal(Number(e.target.value))} className="field-rect" /></label>
                  </>
                )}
              </div>
            </div>
            <div className="sub space-y-2 p-5">
              <p className="eyebrow text-[var(--st-cyan)]">DP TRANSMITTER CALIBRATION RANGE</p>
              <div className="kv"><span>Configuration Mode</span><span className="text-[var(--st-amber)]">{levelCalc.modeNote}</span></div>
              <div className="kv"><span>LRV (4 mA · 0%)</span><span className="text-[var(--st-cyan)]">{levelCalc.lrvKpa.toFixed(3)} kPa ({levelCalc.lrvMmH2O.toFixed(0)} mmH₂O)</span></div>
              <div className="kv"><span>URV (20 mA · 100%)</span><span className="text-[var(--st-cyan)]">{levelCalc.urvKpa.toFixed(3)} kPa ({levelCalc.urvMmH2O.toFixed(0)} mmH₂O)</span></div>
              <div className="kv"><span>Calibrated Span</span><span>{levelCalc.spanKpa.toFixed(3)} kPa</span></div>
            </div>
          </div>
        )}

        {/* 7. 4-20 mA Loop Scaling */}
        {activeId === 'loop-scaling' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-3 p-5">
              <div className="seg">
                <button type="button" onClick={() => setLoopDir('pv2ma')} className={loopDir === 'pv2ma' ? 'on' : ''}>PV → mA</button>
                <button type="button" onClick={() => setLoopDir('ma2pv')} className={loopDir === 'ma2pv' ? 'on' : ''}>mA → PV</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1"><span className="label">LRV (4 mA)</span><input type="number" step="any" value={loopLrv} onChange={(e) => setLoopLrv(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">URV (20 mA)</span><input type="number" step="any" value={loopUrv} onChange={(e) => setLoopUrv(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Eng Unit</span><input value={loopUnit} onChange={(e) => setLoopUnit(e.target.value)} className="field-rect" /></label>
              </div>
              {loopDir === 'pv2ma' ? (
                <label className="block space-y-1"><span className="label">Process Value ({loopUnit})</span><input type="number" step="any" value={loopPv} onChange={(e) => setLoopPv(Number(e.target.value))} className="field-rect" /></label>
              ) : (
                <label className="block space-y-1"><span className="label">Loop Current (mA)</span><input type="number" step="0.01" value={loopMaInput} onChange={(e) => setLoopMaInput(Number(e.target.value))} className="field-rect" /></label>
              )}
              <div className="grid gap-3 border-t border-[var(--st-line)] pt-3 sm:grid-cols-3">
                <label className="space-y-1"><span className="label">PSU (VDC)</span><input type="number" value={loopSupply} onChange={(e) => setLoopSupply(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Tx Min (VDC)</span><input type="number" value={loopTxMinV} onChange={(e) => setLoopTxMinV(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Loop Load (Ω)</span><input type="number" value={loopLoadOhms} onChange={(e) => setLoopLoadOhms(Number(e.target.value))} className="field-rect" /></label>
              </div>
            </div>
            <div className="sub space-y-2 p-5">
              <div className="kv"><span>Loop Current</span><span className="text-base font-bold text-[var(--st-cyan)]">{loopCalc.ma.toFixed(3)} mA</span></div>
              <div className="kv"><span>Process Variable</span><span>{loopCalc.pv.toFixed(2)} {loopUnit} ({loopCalc.pct.toFixed(1)}%)</span></div>
              <div className="kv"><span>NAMUR NE43 Diagnostics</span><span>{loopCalc.namur}</span></div>
              <div className="kv"><span>Max Allowed Loop Load (@21.5 mA)</span><span>{loopCalc.rMax.toFixed(1)} Ω</span></div>
              <div className="kv"><span>Terminal Voltage @ 21.5 mA</span><span className={loopCalc.txVoltageAt215 < loopTxMinV ? 'text-[var(--st-crimson)]' : 'text-[var(--st-phosphor)]'}>{loopCalc.txVoltageAt215.toFixed(2)} V {loopLoadOhms < 250 ? '(Needs ≥250 Ω for HART!)' : ''}</span></div>
            </div>
          </div>
        )}

        {/* 8. ADC Resolution & ENOB */}
        {activeId === 'adc-resolution' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub grid gap-3 p-5 sm:grid-cols-2">
              <label className="space-y-1"><span className="label">Bit Resolution N</span><input type="number" min={4} max={24} value={adcBits} onChange={(e) => setAdcBits(Math.max(4, Math.min(24, Number(e.target.value) || 12)))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">Full-Scale Reference V_FS (V)</span><input type="number" step="0.1" value={adcVfs} onChange={(e) => setAdcVfs(Number(e.target.value))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">Analog Input Voltage V_in (V)</span><input type="number" step="0.01" value={adcVin} onChange={(e) => setAdcVin(Number(e.target.value))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">Measured SINAD (dB)</span><input type="number" step="0.5" value={adcSinad} onChange={(e) => setAdcSinad(Number(e.target.value))} className="field-rect" /></label>
            </div>
            <div className="sub space-y-2 p-5">
              {(() => {
                const levels = Math.pow(2, adcBits);
                const lsb = adcVfs / levels;
                const code = Math.max(0, Math.min(levels - 1, Math.round((adcVin / adcVfs) * levels)));
                const idealSnr = 6.02 * adcBits + 1.76;
                const enob = (adcSinad - 1.76) / 6.02;
                return (
                  <>
                    <div className="kv"><span>Total Quantization Levels</span><span>{levels.toLocaleString()}</span></div>
                    <div className="kv"><span>1 LSB Step Size</span><span className="text-[var(--st-cyan)]">{(lsb * 1e6).toFixed(2)} µV ({(lsb * 1e3).toFixed(4)} mV)</span></div>
                    <div className="kv"><span>Digital Output Code</span><span>{code} (0x{code.toString(16).toUpperCase()})</span></div>
                    <div className="kv"><span>Ideal Quantization SNR</span><span>{idealSnr.toFixed(2)} dB</span></div>
                    <div className="kv"><span>Effective Number of Bits (ENOB)</span><span className="text-[var(--st-phosphor)]">{enob.toFixed(2)} bits</span></div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* 9. Wheatstone Bridge */}
        {activeId === 'wheatstone-bridge' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub space-y-3 p-5">
              <div className="seg">
                <button type="button" onClick={() => setWbTopo('quarter')} className={wbTopo === 'quarter' ? 'on' : ''}>Quarter Bridge (1 Active)</button>
                <button type="button" onClick={() => setWbTopo('half')} className={wbTopo === 'half' ? 'on' : ''}>Half Bridge (2 Active)</button>
                <button type="button" onClick={() => setWbTopo('full')} className={wbTopo === 'full' ? 'on' : ''}>Full Bridge (4 Active)</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1"><span className="label">Excitation V_exc (V)</span><input type="number" step="0.1" value={wbVexc} onChange={(e) => setWbVexc(Number(e.target.value))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Nominal Arm R (Ω)</span><input type="number" step="1" value={wbRnom} onChange={(e) => setWbRnom(Math.max(1, Number(e.target.value)))} className="field-rect" /></label>
                <label className="space-y-1"><span className="label">Active Shift ΔR (Ω)</span><input type="number" step="0.1" value={wbDeltaR} onChange={(e) => setWbDeltaR(Number(e.target.value))} className="field-rect" /></label>
              </div>
            </div>
            <div className="sub space-y-2 p-5">
              {(() => {
                const r = wbRnom;
                const dr = wbDeltaR;
                const exactV =
                  wbTopo === 'quarter'
                    ? wbVexc * ((r + dr) / (2 * r + dr) - 0.5)
                    : wbTopo === 'half'
                    ? wbVexc * ((r + dr) / (2 * r) - 0.5)
                    : wbVexc * (dr / r);
                const approxV =
                  wbTopo === 'quarter'
                    ? wbVexc * (dr / (4 * r))
                    : wbTopo === 'half'
                    ? wbVexc * (dr / (2 * r))
                    : wbVexc * (dr / r);
                return (
                  <>
                    <div className="kv"><span>Exact Output Voltage</span><span className="text-base font-bold text-[var(--st-cyan)]">{(exactV * 1000).toFixed(3)} mV</span></div>
                    <div className="kv"><span>Linearized Approximation</span><span>{(approxV * 1000).toFixed(3)} mV</span></div>
                    <div className="kv"><span>Fractional ΔR/R</span><span>{((dr / r) * 100).toFixed(3)}%</span></div>
                    <div className="kv"><span>Bridge Common-Mode DC</span><span>{(wbVexc / 2).toFixed(2)} V</span></div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* 10. Measurement Error & TUR */}
        {activeId === 'measurement-error' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="sub grid gap-3 p-5 sm:grid-cols-2">
              <label className="space-y-1"><span className="label">Measured Reading</span><input type="number" step="0.01" value={errMeasured} onChange={(e) => setErrMeasured(Number(e.target.value))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">True Reference Value</span><input type="number" step="0.01" value={errTrue} onChange={(e) => setErrTrue(Number(e.target.value))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">Instrument Span</span><input type="number" step="1" value={errSpan} onChange={(e) => setErrSpan(Math.max(0.01, Number(e.target.value)))} className="field-rect" /></label>
              <label className="space-y-1"><span className="label">UUT Spec Tolerance (±)</span><input type="number" step="0.05" value={errUutTol} onChange={(e) => setErrUutTol(Math.max(0.001, Number(e.target.value)))} className="field-rect" /></label>
              <label className="space-y-1 sm:col-span-2"><span className="label">Calibrator Reference Tolerance (±)</span><input type="number" step="0.01" value={errRefTol} onChange={(e) => setErrRefTol(Math.max(0.001, Number(e.target.value)))} className="field-rect" /></label>
            </div>
            <div className="sub space-y-2 p-5">
              {(() => {
                const absErr = errMeasured - errTrue;
                const pctRdg = errTrue !== 0 ? (absErr / errTrue) * 100 : 0;
                const pctSpan = (absErr / errSpan) * 100;
                const tur = errUutTol / errRefTol;
                const rssCombined = Math.hypot(errUutTol, errRefTol);
                return (
                  <>
                    <div className="kv"><span>Absolute Error</span><span className="text-[var(--st-cyan)]">{absErr >= 0 ? `+${absErr.toFixed(4)}` : absErr.toFixed(4)}</span></div>
                    <div className="kv"><span>Relative % of Reading</span><span>{pctRdg.toFixed(3)}%</span></div>
                    <div className="kv"><span>% of Full Span Error</span><span>{pctSpan.toFixed(3)}% FS</span></div>
                    <div className="kv"><span>RSS Combined Uncertainty</span><span>±{rssCombined.toFixed(4)}</span></div>
                    <div className="kv"><span>Test Uncertainty Ratio (TUR)</span><span className={tur >= 4 ? 'text-[var(--st-phosphor)]' : 'text-[var(--st-amber)]'}>{tur.toFixed(2)}:1 {tur >= 4 ? '(Meets ≥4:1 ISO 17025)' : '(Below 4:1 target!)'}</span></div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* 11. PID Tuning & Closed-Loop Step Simulator */}
        {activeId === 'pid-tuning' && (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="sub space-y-3 p-5">
              <div className="seg">
                <button type="button" onClick={() => setPidRule('imc')} className={pidRule === 'imc' ? 'on' : ''}>IMC / Lambda</button>
                <button type="button" onClick={() => setPidRule('zn')} className={pidRule === 'zn' ? 'on' : ''}>Ziegler-Nichols</button>
              </div>
              <label className="block space-y-1"><span className="label">Process Gain K</span><input type="number" step="0.1" min={0.1} value={pidK} onChange={(e) => setPidK(Number(e.target.value))} className="field-rect" /></label>
              <label className="block space-y-1"><span className="label">Time Constant τ (s)</span><input type="number" step="0.5" min={0.5} value={pidTau} onChange={(e) => setPidTau(Number(e.target.value))} className="field-rect" /></label>
              <label className="block space-y-1"><span className="label">Dead Time θ (s)</span><input type="number" step="0.2" min={0.2} value={pidTheta} onChange={(e) => setPidTheta(Number(e.target.value))} className="field-rect" /></label>

              <div className="border-t border-[var(--st-line)] pt-2">
                <div className="kv"><span>Proportional Gain Kc</span><span className="text-[var(--st-cyan)]">{pidCalc.kc.toFixed(3)}</span></div>
                <div className="kv"><span>Integral Time Ti</span><span>{pidCalc.ti.toFixed(2)} s</span></div>
                <div className="kv"><span>Derivative Time Td</span><span>{pidCalc.td.toFixed(2)} s</span></div>
              </div>
            </div>

            <div className="sub p-4">
              <p className="eyebrow mb-2">SIMULATED CLOSED-LOOP STEP RESPONSE (SP: 0 → 1.0)</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pidCalc.series} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                    <CartesianGrid stroke={theme === 'light' ? 'rgba(20,20,20,0.09)' : 'rgba(255,255,255,0.08)'} strokeDasharray="3 3" />
                    <XAxis dataKey="t" tick={{ fill: theme === 'light' ? '#525252' : '#a6a6a6', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                    <YAxis domain={[0, 1.5]} tick={{ fill: theme === 'light' ? '#525252' : '#a6a6a6', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a',
                        borderRadius: '12px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                      }}
                    />
                    <ReferenceLine y={1.0} stroke="#a6a6a6" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="sp" name="Setpoint (SP)" stroke="#cdbdff" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="pv" name="Process Variable (PV)" stroke={theme === 'light' ? '#4a7300' : '#c5f467'} strokeWidth={2.4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

