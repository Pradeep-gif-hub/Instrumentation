import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const NITJ_SIGNAL_PROCESSING: CurriculumSubjectDetail = {
  id: 'nitj-sem4-sp',
  semester: 4,
  displaySemesterLabel: 'Semester IV',
  code: 'ICDC0204',
  name: 'Signal Processing',
  shortName: 'Signal Processing',
  credits: 4,
  category: 'Electronics',
  syllabusStatus: 'official-core',
  syllabusBadge: 'NITJ Core · Rev. June 2025',
  overview:
    'Official Semester IV core (ICDC0204 · CO1–CO4): Continuous and discrete-time signals/systems, convolution & correlation, CTFT/DTFT/DFT/FFT frequency representations, Z-transform ROC & pole-zero stability analysis, linear-phase FIR windowing & IIR Butterworth/Chebyshev filter synthesis, finite-word-length effects, and Digital Signal Processor hardware architecture.',
  units: [
    // =========================================================================
    // SECTION 1 — Introduction to Signals, Systems and Signal Processing
    // =========================================================================
    {
      unitNumber: 1,
      title: 'Introduction to Signals, Systems and Signal Processing',
      hours: 8,
      summary:
        'Signal classification, time operations (shift/scale/reversal), periodic/aperiodic, energy vs power, even/odd decomposition (CT & DT), system properties, continuous/discrete convolution & correlation, sampling, quantization, and Nyquist theorem enrichment.',
      topics: [
        {
          id: 'sp-u1-signals-ops',
          title: 'Classification of Signals, Operations & Even/Odd Decomposition',
          summary:
            'CT vs DT signals, time shifting x(t−t₀), time scaling x(at), time reversal x(−t), periodic vs aperiodic, energy vs power signals, and even/odd decomposition in continuous & discrete time.',
          explanation:
            'Any physical transducer output (temperature, pressure, vibration, ECG voltage) is a signal conveying information over time. Signals are classified cleanly as Continuous-Time x(t) vs Discrete-Time x[n], Deterministic vs Random, Periodic (x(t + T₀) = x(t) or rational f₀/f_s = m/N in discrete time!) vs Aperiodic, and mutually exclusive Energy Signals (0 < E < ∞, P = 0, such as decaying transducer impulses) vs Power Signals (0 < P < ∞, E = ∞, such as steady periodic sinusoids and random noise). Any signal x(t) or x[n] decomposes uniquely into symmetric Even x_e(t) = ½[x(t)+x(−t)] and antisymmetric Odd x_o(t) = ½[x(t)−x(−t)] components.',
          workingPrinciple:
            'Elementary time transformations follow strict precedence: Time Shift (left/right by t₀), Time Reversal (mirror around t = 0), and Time Scaling (compression a > 1 or expansion 0 < a < 1).',
          inputOutput: { input: 'Raw Sensor Waveform x(t)', output: 'Decomposed & Transformed Sequence x[n]' },
          equations: [
            { label: 'Signal Energy & Average Power (CT / DT)', latex: 'E = \\int_{-\\infty}^{\\infty} |x(t)|^2 dt = \\sum_{n=-\\infty}^{\\infty} |x[n]|^2, \\qquad P = \\lim_{N\\to\\infty}\\frac{1}{2N+1}\\sum_{n=-N}^{N}|x[n]|^2' },
            { label: 'Unique Even-Odd Decomposition', latex: 'x_e[n] = \\frac{x[n] + x[-n]}{2}, \\qquad x_o[n] = \\frac{x[n] - x[-n]}{2}' },
          ],
          numericals: [
            {
              title: 'Discrete Sinusoid Periodicity & Energy-Power Check',
              problem: 'Determine whether discrete signal x[n] = 4 cos(0.3π n) is periodic (find fundamental period N) and classify it as energy or power.',
              steps: [
                'Normalize angular frequency Ω₀ = 0.3π rad/sample ⇒ rational ratio Ω₀/(2π) = 0.3π / (2π) = 3 / 20.',
                'Since k / N = 3 / 20 is rational (gcd(3,20) = 1), x[n] IS periodic with fundamental period N = 20 samples.',
                'Average power P = A² / 2 = 4² / 2 = 8.0 W (finite nonzero), while total energy E = ∞ ⇒ Power signal.',
              ],
              result: 'Periodic with N = 20 samples; classified as a Power signal (P = 8).',
            },
          ],
          realWorldApplications: {
            summary: 'Conditioning periodic AC grid telemetry, pulsing ultrasonic echoes (energy signals), and parity extraction inside industrial instrumentation.',
            industries: ['Vibration Monitoring', 'Power Quality', 'Ultrasonic NDT'],
            examples: ['Isolating pulsed ultrasonic TOF burst energy against continuous fan background noise power', 'Time-aligning multi-channel process historians'],
          },
          crossLinks: [
            { label: 'Transducers & Signal Conditioning (Sem III)', targetSubjectId: 'nitj-sem3-tsc', note: 'Static/dynamic sensor outputs generate the analog signals categorized here.' },
          ],
        },
        {
          id: 'sp-u1-systems-conv-corr',
          title: 'CT/DT Systems, Properties, Convolution & Correlation',
          summary:
            'Linearity, time-invariance, causality, stability, invertibility; Continuous/Discrete convolution y[n] = x[n]*h[n]; cross-correlation & auto-correlation.',
          explanation:
            'A Continuous-Time (CT) or Discrete-Time (DT) system transforms input x into output y and is classified by Memory (memoryless vs dynamic), Invertibility, Causality (output depends strictly on present/past inputs n ≤ k), BIBO Stability (∑|h[k]| < ∞), Time-Invariance (shifted input produces identically shifted output), and Linearity (superposition). Any Linear Time-Invariant (LTI) system is completely determined by its unit impulse response h(t) or h[n] via Convolution! In contrast, Cross-Correlation R_xy[l] = ∑ x[n]y[n−l] omits time-folding on y and slides signals to measure time-of-flight delay and similarity against heavy ambient noise.',
          workingPrinciple:
            'Convolution folds h[−k], shifts by n, multiplies element-wise, and sums to track LTI system memory response; Correlation slides without folding to detect delayed echo peaks.',
          equations: [
            { label: 'CT & DT Convolution Integrals/Sums', latex: 'y(t) = \\int_{-\\infty}^{\\infty} x(\\tau)h(t-\\tau)\\,d\\tau, \\qquad y[n] = \\sum_{k=-\\infty}^{\\infty} x[k]\\,h[n-k]' },
            { label: 'Discrete Cross-Correlation & Auto-Correlation', latex: 'R_{xy}[l] = \\sum_{n=-\\infty}^{\\infty} x[n]\\,y[n-l], \\qquad R_{xx}[0] = E_x \\ge |R_{xx}[l]|' },
          ],
          algorithm: {
            pseudocode: [
              '1. Initialize output array y[0 .. Lx + Lh - 2] = 0',
              '2. Reverse h[k] around zero and shift by n',
              '3. For n = 0 to Lx + Lh - 2: y[n] = sum_k x[k] * h[n - k]',
              '4. Check BIBO stability: sum(|h[k]|) < Infinity',
            ],
            convergenceAndError: 'Exact finite-support sum computes without truncation error when both x and h have finite length L_x and L_h (result length L_x + L_h − 1).',
          },
          numericals: [
            {
              title: 'Step-by-Step Discrete Linear Convolution',
              problem: 'Compute y[n] = x[n] * h[n] for x[n] = {1, 2, 3} (at n=0,1,2) and h[n] = {1, −1, 2} (at n=0,1,2).',
              steps: [
                'Output length = 3 + 3 − 1 = 5 samples (n = 0..4).',
                'y[0] = 1×1 = 1; y[1] = 1(−1) + 2(1) = 1; y[2] = 1(2) + 2(−1) + 3(1) = 3;',
                'y[3] = 2(2) + 3(−1) = 1; y[4] = 3(2) = 6.',
              ],
              result: 'y[n] = {1, 1, 3, 1, 6} (check sum: Σx·Σh = 6×2 = 12 = 1+1+3+1+6!).',
            },
          ],
          realWorldApplications: {
            summary: 'Ultrasonic cross-correlation flowmeters measure Doppler/transit lag cleanly amidst pipeline noise; convolution defines every digital sensor calibration filter.',
            industries: ['Oil & Gas Flowmeters', 'Radar Level', 'Structural Vibration'],
            examples: ['Cross-correlating upstream vs downstream acoustic pulses inside transit-time flowmeters', 'Matched-filter autocorrelation picking faint radar tank echoes out of foam noise'],
          },
        },
        {
          id: 'sp-u1-sampling-quantization',
          title: 'Sampling, Quantization & Nyquist Theorem [Enrichment]',
          summary:
            'Uniform impulse sampling T_s, amplitude quantization Q(x), SQNR = 6.02N + 1.76 dB, aliasing overlap, and Nyquist Sampling Theorem (isExtension: true enrichment).',
          isExtension: true,
          verificationFlag: 'Covers official Section 1 Sampling & Quantization plus expanded Nyquist Sampling Theorem derivation (enrichment).',
          explanation:
            'To process real-world analog transducer voltages numerically on a DSP or PLC, two stages convert continuous x(t) to digital code: (1) Sampling freezes continuous time into discrete snapshots x[n] = x(nT_s) at rate f_s = 1/T_s, repeating the spectrum every multiple of f_s; (2) Quantization rounds infinite real amplitudes onto 2^N finite digital levels separated by Δ = V_FS / 2^N, introducing irreducible ±Δ/2 quantization noise. By the supporting Nyquist-Shannon Sampling Theorem, exact reconstruction without spectral aliasing overlap strictly requires f_s > 2 f_max — always place an analog anti-aliasing low-pass filter before the sampler!',
          workingPrinciple:
            'When f_s < 2 f_max, high-frequency noise replicas fold backwards across f_s/2 directly into low-frequency process bands as false aliases.',
          equations: [
            { label: 'Nyquist Rate & Uniform Quantization SQNR', latex: 'f_s > 2f_{\\max}, \\qquad \\Delta = \\frac{V_{\\text{FS}}}{2^N}, \\qquad \\text{SQNR}_{\\text{dB}} = 6.02\\,N + 1.76' },
          ],
          realWorldApplications: {
            summary: 'Determines PLC/DAS card scan intervals, anti-aliasing analog corner filters, and 16/24-bit ADC ENOB resolution inside smart transmitters.',
            industries: ['Industrial DAQ', 'Smart Transmitters', 'Condition Monitoring'],
            examples: ['Sampling 4 kHz bearing vibration cleanly at ≥ 12.8 kS/s with 5 kHz Sallen-Key LPF', 'Achieving 24-bit Sigma-Delta pressure accuracy'],
          },
          crossLinks: [
            { label: 'Analog & Digital Electronics (Sem III)', targetSubjectId: 'nitj-sem3-ade', note: 'Hardware SAR/Flash/Sigma-Delta ADC converters implement quantization physically.' },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Fourier Representation of Signals
    // =========================================================================
    {
      unitNumber: 2,
      title: 'Fourier Representation of Signals (CTFS, DTFS, CTFT, DTFT, DFT & FFT)',
      hours: 10,
      summary:
        'CT/DT periodic & aperiodic Fourier representations, CTFT & DTFT properties, ideal vs practical filters, ESD/PSD, DFT linear transform matrix, linear vs circular convolution, Overlap-Add/Save long filtering, DIT-FFT & DIF-FFT butterflies.',
      topics: [
        {
          id: 'sp-u2-ctfs-dtft',
          title: 'CTFS, DTFS, CTFT, DTFT, Properties & ESD / PSD',
          summary:
            'Continuous & discrete Fourier series, CTFT X(jω) & DTFT X(e^jω) pairs & duality, Parseval energy/power theorems, ESD/PSD, and ideal vs practical filters.',
          explanation:
            'Fourier analysis projects signals onto complex exponential eigenfunctions. Periodic continuous signals expand as discrete harmonics via CTFS (line spectrum), while periodic discrete sequences use finite N-periodic DTFS. Aperiodic signals yield continuous spectra via Continuous-Time Fourier Transform X(jΩ) or periodic 2π-repeated Discrete-Time Fourier Transform X(e^jω). Essential transform properties—Linearity, Time Shifting (linear phase shift e^(−jωn₀)), Frequency Shifting (modulation), Time-Domain Convolution ↔ Frequency Multiplication, and Parseval’s Theorem—simplify filter and modulation design. Ideal brick-wall filters are non-causal (sinc impulse extending to −∞); practical causal Butterworth/Chebyshev filters trade finite transition width for realizability. Energy Spectral Density |X(f)|² distributes finite pulse energy, while Power Spectral Density S_xx(f) tracks power density per Hz.',
          workingPrinciple:
            'Sampling in one domain always forces periodicity in the dual domain: discrete samples x[n] create a 2π-periodic DTFT spectrum X(e^jω).',
          equations: [
            { label: 'DTFT Analysis & Synthesis Pair', latex: 'X(e^{j\\omega}) = \\sum_{n=-\\infty}^{\\infty} x[n]e^{-j\\omega n}, \\qquad x[n] = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi} X(e^{j\\omega})e^{j\\omega n}\\,d\\omega' },
            { label: 'Parseval Theorem & Energy Spectral Density', latex: '\\sum_{n=-\\infty}^{\\infty}|x[n]|^2 = \\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}|X(e^{j\\omega})|^2\\,d\\omega, \\qquad \\Psi_{xx}(\\omega) = |X(e^{j\\omega})|^2' },
          ],
          realWorldApplications: {
            summary: 'Vibrations spectrum diagnostics (ESD/PSD peaks isolate gear mesh & bearing outer-race faults) and HART FSK spectrum analysis.',
            industries: ['Predictive Maintenance', 'Telemetry Communications', 'Optics FTIR'],
            examples: ['Integrating PSD across 10–1000 Hz to compute ISO RMS velocity mm/s alarm', 'Checking HART 1200/2200 Hz harmonic sidebands'],
          },
        },
        {
          id: 'sp-u2-dft-convolution',
          title: 'DFT Matrix Representation, Properties & Linear vs Circular Convolution',
          summary:
            'N-point DFT as Vandermonde unitary matrix W_N, circular shift/symmetry properties, circular vs linear convolution, and Overlap-Add / Overlap-Save long-sequence filtering.',
          explanation:
            'Computers cannot evaluate continuous frequency ω over DTFT; sampling X(e^jω) uniformly at ω_k = 2πk/N yields the invertible N-point Discrete Fourier Transform X = W_N x using unitary-scaled twiddle factor matrix [W_N]_(k,n) = W_N^(kn) where W_N = e^(−j2π/N). Multiplying two N-point DFTs computes CIRCULAR Convolution y[n] = x[n] ⊛_N h[n] (periodic wrap-around modulation modulo N), whereas physical LTI filters perform LINEAR Convolution! To make circular DFT multiplication match linear convolution identically, zero-pad both inputs cleanly to length L ≥ L_x + L_h − 1! For arbitrarily long continuous streaming sensor data (say 10⁶ samples against a 64-tap FIR filter), block methods—Overlap-Add (zero-pad blocks and add tails) and Overlap-Save (prepend L_h−1 prior samples and discard aliased edge outputs)—slice the stream into fast fixed-size FFT blocks.',
          workingPrinciple:
            'Zero-padding to N ≥ N₁ + N₂ − 1 absorbs tail wrap-around cleanly so circular DFT product equals true linear convolution without distortion.',
          equations: [
            { label: 'N-Point DFT & IDFT Transformation', latex: 'X[k] = \\sum_{n=0}^{N-1} x[n]W_N^{kn}, \\quad x[n] = \\frac{1}{N}\\sum_{k=0}^{N-1} X[k]W_N^{-kn} \\quad \\left(W_N = e^{-j2\\pi/N}\\right)' },
            { label: 'Circular vs Zero-Padded Linear Length', latex: 'X[k]\\,H[k] \\xleftrightarrow{\\text{IDFT}_N} x[n]\\circledast_N h[n]; \\qquad N \\ge L_x + L_h - 1 \\implies \\text{Linear}' },
          ],
          numericals: [
            {
              title: '4-Point DFT Matrix Computation',
              problem: 'Compute the 4-point DFT X[k] of sequence x[n] = {1, 2, 0, 1}.',
              steps: [
                'For N = 4, twiddle W₄ = e^(−jπ/2) = −j; matrix rows are [1, 1, 1, 1], [1, −j, −1, j], [1, −1, 1, −1], [1, j, −1, −j].',
                'X[0] = 1+2+0+1 = 4; X[1] = 1 + 2(−j) + 0(−1) + 1(j) = 1 − j;',
                'X[2] = 1 − 2 + 0 − 1 = −2; X[3] = 1 + 2(j) + 0(−1) + 1(−j) = 1 + j.',
              ],
              result: 'X[k] = {4, 1−j, −2, 1+j}.',
            },
          ],
          realWorldApplications: {
            summary: 'Real-time streaming Overlap-Save FFT convolution inside noise-canceling industrial headsets and seismic imaging.',
            industries: ['Acoustics & Sonar', 'Smart Flow / Radar DSP', 'Power Analyzers'],
            examples: ['Streaming Overlap-Save block FFT filtering on 100 kS/s acoustic emission pipe leak monitors'],
          },
        },
        {
          id: 'sp-u2-fft-butterflies',
          title: 'Fast Fourier Transform: DIT-FFT & DIF-FFT Butterflies',
          summary:
            'Cooley-Tukey divide-and-conquer symmetry (W_N^(k+N/2) = −W_N^k), Decimation-in-Time (bit-reversed input), Decimation-in-Frequency (bit-reversed output), and O(N log₂ N) cost.',
          explanation:
            'Evaluating an N-point DFT directly costs N² complex multiplications and N(N−1) additions—prohibitive for real-time 1024/4096-point spectra. Using periodicity and symmetry of twiddle factors (W_N^(k + N/2) = −W_N^k), the Radix-2 Fast Fourier Transform (FFT) splits the transform recursively into log₂ N stages of simple 2-point Butterfly diagrams costing strictly (N/2)log₂ N complex multiplications (over 200× faster at N = 1024!). Two symmetric layouts exist: (1) Decimation-in-Time (DIT-FFT) divides time indices into even/odd halves first—requiring bit-reversed input ordering and natural-order output X[k], multiplying bottom branch BEFORE sum/diff; (2) Decimation-in-Frequency (DIF-FFT) splits frequency bins into even/odd indices—accepting natural-order input x[n] and producing bit-reversed output X[k], multiplying twiddle AFTER subtraction.',
          workingPrinciple:
            'Exploiting W_N^(k+N/2) = −W_N^k shares every twiddle product symmetrically across upper and lower butterfly branches in place.',
          equations: [
            { label: 'DIT-FFT vs DIF-FFT Butterfly Pair', latex: '\\text{DIT: } A\' = A + W_N^r B,\\; B\' = A - W_N^r B \\qquad \\text{DIF: } A\' = A + B,\\; B\' = (A - B)W_N^r' },
            { label: 'Complex Multiplications Comparison', latex: '\\text{Direct DFT} = N^2 \\quad \\text{vs} \\quad \\text{Radix-2 FFT} = \\frac{N}{2}\\log_2 N' },
          ],
          mermaidDiagram: `flowchart LR
  IN["x[0], x[4], x[2], x[6], ... (Bit-Reversed Input)"] --> ST1["Stage 1: 2-pt Butterflies (W_N^0)"]
  ST1 --> ST2["Stage 2: 4-pt Butterflies (W_4^0, W_4^1)"]
  ST2 --> ST3["Stage log2N: Full-Band Butterflies"]
  ST3 --> OUT["Natural-Order Spectrum X[0..N-1]"]`,
          realWorldApplications: {
            summary: 'Powers FTIR infrared interferogram inversion, rotating machinery waterfall PSDs, and FMCW radar range-FFT beat extraction.',
            industries: ['Spectroscopy (FTIR)', '80 GHz Radar Level', 'Turbine Vibration'],
            examples: ['2048-point Radix-2 FFT extracting liquid surface distance beat peak inside FMCW tank radar'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Analysis of Discrete-Time Signals and Systems (Z-Transform)
    // =========================================================================
    {
      unitNumber: 3,
      title: 'Analysis of Discrete-Time Signals and Systems (Z-Transform)',
      hours: 8,
      summary:
        'Bilateral & Unilateral Z-transform, Region of Convergence (ROC) properties, Z-transform theorems, block diagrams, solving difference equations, transfer function H(z), pole-zero Z-plane plots, causality, and stability.',
      topics: [
        {
          id: 'sp-u3-ztransform-roc',
          title: 'Z-Transform, Region of Convergence (ROC) & Inverse Z-Transform',
          summary:
            'Mapping discrete sequences into complex Z-plane, right-sided/left-sided/two-sided ROC rings, Z-transform properties (linearity, shift, scaling, differentiation, initial/final value), and partial-fraction/long-division inversion.',
          explanation:
            'Just as Laplace generalizes Fourier for continuous differential equations, the Z-transform X(z) = ∑ x[n]z^(−n) converts linear constant-coefficient difference equations into algebraic polynomials in complex variable z = r·e^(jω). Because distinct time sequences (such as causal a^n u[n] vs anti-causal −a^n u[−n−1]) produce identical rational expressions, X(z) is only uniquely defined paired with its Region of Convergence (ROC)—the annular ring in the Z-plane where ∑|x[n]r^(−n)| < ∞. Key ROC laws: (1) ROC never contains poles; (2) For right-sided sequences, ROC extends outward |z| > |p_max|; (3) For left-sided, inward |z| < |p_min|; (4) If ROC includes the unit circle |z| = 1, the DTFT converges and exists identically!',
          workingPrinciple:
            'Multiplying by z^(−1) corresponds to a single unit sample delay D = T_s, while right-sided causal signals place their ROC outside the outermost pole radius.',
          equations: [
            { label: 'Z-Transform & Unit Time-Shift Theorem', latex: 'X(z) = \\sum_{n=-\\infty}^{\\infty} x[n]z^{-n}, \\qquad x[n-k] \\xleftrightarrow{\\mathcal{Z}^+} z^{-k}X(z) + \\text{Initial Cond.}' },
            { label: 'Causal Exponential Pair & ROC', latex: 'a^n u[n] \\xleftrightarrow{\\mathcal{Z}} \\frac{1}{1 - az^{-1}} = \\frac{z}{z - a}, \\qquad \\text{ROC: } |z| > |a|' },
          ],
          realWorldApplications: {
            summary: 'Digital PID controller discretization, Kalman discrete prediction updates, and digital compensator synthesis.',
            industries: ['Digital Control', 'PLC Signal Smoothing', 'Audio/Radar'],
            examples: ['Transforming trapezoidal integrator difference equation u[n]=u[n−1]+(K_i T_s/2)(e[n]+e[n−1]) cleanly via Z-transform'],
          },
        },
        {
          id: 'sp-u3-zplane-stability',
          title: 'Difference Equations, Transfer Function H(z), Pole-Zero Z-Plane, Causality & Stability',
          summary:
            'Solving zero-input/zero-state difference equations via unilateral Z-transform, Direct-Form block diagrams, pole-zero plots, ROC conditions for causality & BIBO stability (all poles |z_p| < 1).',
          explanation:
            'An LTI discrete system described by ∑ a_k y[n−k] = ∑ b_m x[n−m] transforms via unilateral Z-transform (incorporating y[−1], y[−2] initial memory!) into Total Response = Zero-Input Response + Zero-State Response, with Transfer Function H(z) = Y(z)/X(z) = B(z)/A(z). Plotting zeros (B(z) = 0, circles) and poles (A(z) = 0, crosses) in the complex Z-plane reveals system stability and frequency response visually: (1) A causal LTI system has right-sided ROC |z| > |p_max| including z = ∞ (numerator degree ≤ denominator degree); (2) A system is BIBO stable iff the unit circle |z| = 1 lies inside its ROC. Combining both: a CAUSAL discrete system is BIBO stable if and only if EVERY pole lies strictly inside the open unit circle (|p_k| < 1)! Frequency magnitude |H(e^jω)| surges near poles close to z = e^(jω) and dips near unit-circle zeros.',
          workingPrinciple:
            'Evaluating H(z) geometrically around the unit circle z = e^(jω) expresses gain as the product of zero-vector lengths divided by pole-vector lengths.',
          equations: [
            { label: 'Rational Transfer Function & Stability Criterion', latex: 'H(z) = \\frac{\\sum_{m=0}^{M} b_m z^{-m}}{1 + \\sum_{k=1}^{N} a_k z^{-k}}; \\qquad \\text{Causal + BIBO Stable} \\iff |p_k| < 1\\;\\forall k' },
          ],
          numericals: [
            {
              title: 'Difference Equation Solution & Stability Check',
              problem: 'Solve y[n] − 0.5 y[n−1] = 2(0.25)^n u[n] with y[−1] = 4 and verify BIBO stability.',
              steps: [
                'Unilateral Z-transform: Y(z) − 0.5(z⁻¹Y(z) + y[−1]) = 2 / (1 − 0.25z⁻¹) ⇒ (1 − 0.5z⁻¹)Y(z) = 2 + 2/(1 − 0.25z⁻¹).',
                'Note single pole of H(z) at p₁ = +0.5; since |p₁| = 0.5 < 1, causal system IS BIBO stable!',
                'Partial fractions yield Y(z) = 2/(1−0.5z⁻¹) + [4/(1−0.5z⁻¹) − 2/(1−0.25z⁻¹)] = 6/(1−0.5z⁻¹) − 2/(1−0.25z⁻¹).',
              ],
              result: 'y[n] = [6(0.5)^n − 2(0.25)^n] u[n]; causally BIBO stable since |0.5| < 1.',
            },
          ],
          realWorldApplications: {
            summary: 'Designing recursive notch filters to cancel 50/60 Hz mains hum by placing zeros squarely on the unit circle at e^(±j2π·50/f_s).',
            industries: ['Biomedical ECG', 'Smart Weight Load Cells', 'PLC PID Loops'],
            examples: ['Placing conjugate zeros at 50 Hz unit-circle angle for weighbridge load-cell noise rejection', 'Checking quantized IIR poles stay safely inside r = 1'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Design of Filters
    // =========================================================================
    {
      unitNumber: 4,
      title: 'Design of Filters (FIR Linear-Phase, Windowing, IIR Butterworth & Chebyshev)',
      hours: 10,
      summary:
        'Frequency response, phase & group delay, linear-phase FIR filters, Moving Average / AR / ARMA models, FIR/IIR structures, Fourier series & Windowing (Rect/Hanning/Hamming/Blackman) FIR design, Analog-to-IIR (Impulse-Invariant, Matched-Z, Bilinear), Butterworth & Chebyshev responses.',
      topics: [
        {
          id: 'sp-u4-fir-structures-design',
          title: 'Filter Responses, Moving Average/AR/ARMA, Linear-Phase FIR & Window Design',
          summary:
            'Phase delay τ_p & constant Group Delay τ_g, Moving Average (MA), Autoregressive (AR), ARMA models, Direct/Linear-Phase FIR structures, Fourier series & Windowing (Rectangular, Hanning, Hamming, Blackman).',
          explanation:
            'Practical filters are classified cleanly via discrete difference forms: Moving Average (MA / all-zero FIR: y[n] = ∑ b_k x[n−k]), Autoregressive (AR / all-pole IIR: y[n] = x[n] − ∑ a_k y[n−k]), and general Autoregressive Moving Average (ARMA / pole-zero IIR). Whenever preserving waveform peak timing matters (ECG QRS shape, flow batch totalization), nonlinear Phase Delay τ_p(ω) = −θ(ω)/ω or uneven Group Delay τ_g(ω) = −dθ(ω)/dω smears sharp edges! Symmetrical (h[n] = ±h[N−1−n]) FIR filters achieve EXACT Linear Phase (constant τ_g = (N−1)/2 samples!) while exploiting symmetry inside folded linear-phase structures to halve multipliers. Linear-phase FIR design starts by truncating the infinite ideal sinc impulse h_d[n] over −M..M (Fourier series method) and tapering abruptly via Window Functions w[n] (Hanning, Hamming −53 dB stopband, Blackman −74 dB, or Kaiser) to trade wider transition width smoothly against Gibbs sidelobe suppression!',
          workingPrinciple:
            'Mirror-symmetric FIR impulse coefficients guarantee purely linear phase delay θ(ω) = −ω(N−1)/2 so every frequency inside the passband arrives with identical delay.',
          equations: [
            { label: 'Phase Delay & Group Delay', latex: '\\tau_p(\\omega) = -\\frac{\\theta(\\omega)}{\\omega}, \\qquad \\tau_g(\\omega) = -\\frac{d\\theta(\\omega)}{d\\omega}' },
            { label: 'Windowed Linear-Phase FIR Impulse (Causal N=2M+1)', latex: 'h[n] = h_d[n - M]\\cdot w[n], \\qquad h_d[k] = \\frac{\\sin(\\omega_c k)}{\\pi k}' },
          ],
          mermaidDiagram: `flowchart LR
  XN["x[n]"] --> D1["z^-1"] --> D2["z^-1"] --> DN["z^-(N-1)"]
  XN -->|"h[0]"| SUM["+ Σ"]
  D1 -->|"h[1]"| SUM
  D2 -->|"h[2]"| SUM
  DN -->|"h[N-1]"| SUM
  SUM --> YN["Linear-Phase y[n]"]`,
          realWorldApplications: {
            summary: 'Wave-shape-preserving ECG smoothing, PLC moving-average tank level damping, and spectral-analyzer anti-aliasing decimation filters.',
            industries: ['Biomedical Instrumentation', 'Process DCS Historians', 'Acoustic Test'],
            examples: ['Symmetrical Hamming-windowed 41-tap FIR low-pass preserving sharp chromatographic GC peaks', 'Simple 8-point Moving Average smoothing noisy DP tank transmitter variance'],
          },
        },
        {
          id: 'sp-u4-iir-analog-design',
          title: 'IIR Filter Structures, Analog Butterworth/Chebyshev & Bilinear Design',
          summary:
            'Direct Form I/II, Cascade/Parallel biquads, Pole-zero placement, Impulse-Invariant vs Matched-Z vs Bilinear Transformation (with ω prewarping), Butterworth vs Chebyshev Type I/II.',
          explanation:
            'When sharp cutoff slopes must run at minimal CPU/MAC cost and nonlinear phase near cutoff is tolerable, Infinite Impulse Response (IIR) filters use recursive output feedback implemented reliably in Cascade 2nd-Order Biquads (minimizing coefficient-quantization pole sensitivity!) or Direct Form I/II structures. Direct digital pole-zero placement works well for narrow notch/resonator filters, while standard frequency-selective filters map proven continuous analog prototypes—maximally flat passband Analog Butterworth |H(jΩ)|² = 1/(1+(Ω/Ω_c)^(2N)) vs steeper-rolloff equiripple Analog Chebyshev Type I/II—into discrete H(z) via: (1) Impulse-Invariant Mapping (preserves h(nT), z_k = e^(s_k T), but aliases high-pass/band-stop responses!); (2) Matched Z-Transform (maps every s-plane pole and zero z = e^(sT)); and (3) Bilinear Transformation s = (2/T)(1−z⁻¹)/(1+z⁻¹), mapping the entire jΩ axis bijectively onto the unit circle WITHOUT aliasing, after prewarping analog design edge Ω_a = (2/T)tan(ω_d/2)!',
          workingPrinciple:
            'Bilinear frequency warping compresses (−∞, +∞) analog frequencies monotonically into (−π, π) digital radians so high-order IIR filters never alias back across f_s/2.',
          equations: [
            { label: 'Bilinear Substitution & Analog Frequency Prewarping', latex: 's = \\frac{2}{T}\\frac{1 - z^{-1}}{1 + z^{-1}}, \\qquad \\Omega_a = \\frac{2}{T}\\tan\\!\\left(\\frac{\\omega_d}{2}\\right)' },
            { label: 'Butterworth Order & Attenuation Law', latex: 'N \\ge \\frac{\\log_{10}\\!\\left[(10^{0.1 A_s} - 1)/(10^{0.1 A_p} - 1)\\right]}{2\\log_{10}(\\Omega_s / \\Omega_p)}' },
          ],
          numericals: [
            {
              title: '1st-Order Bilinear IIR Low-Pass Filter Synthesis',
              problem: 'Convert normalized analog 1st-order Butterworth H(s) = 1 / (s + 1) to digital H(z) with cutoff ω_d = π/2 rad/sample (take T = 2 for algebra clarity).',
              steps: [
                'Prewarp desired cutoff: Ω_c = (2/T) tan(ω_d/2) = (2/2) tan(π/4) = 1.0 rad/s.',
                'Scaled analog prototype: H_a(s) = Ω_c / (s + Ω_c) = 1 / (s + 1).',
                'Apply Bilinear s = (2/T)(1 − z⁻¹)/(1 + z⁻¹) = (1 − z⁻¹)/(1 + z⁻¹): H(z) = (1 + z⁻¹) / [(1 − z⁻¹) + (1 + z⁻¹)] = 0.5(1 + z⁻¹).',
              ],
              result: 'H(z) = 0.5(1 + z⁻¹) ⇒ y[n] = 0.5(x[n] + x[n−1]) (verify at ω=π/2: |H(e^(jπ/2))| = 0.5|1−j| = 1/√2 = −3 dB!).',
            },
          ],
          realWorldApplications: {
            summary: 'Compact 4th-order IIR biquad antialiasing/filtering inside PLC analog input modules and closed-loop sensor damping.',
            industries: ['Smart Transmitters', 'Motion Drives', 'Telemetry Modems'],
            examples: ['Cascade of two fixed-point Butterworth biquads removing 50 Hz mains pickup cleanly inside smart weigh-cell firmware'],
          },
          crossLinks: [
            { label: 'Electronics Filter Lab (Sem III ADE)', targetSubjectId: 'nitj-sem3-ade', note: 'Continuous Sallen-Key active filter topologies are the analog prototypes mapped digitally here.' },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Digital Signal Processors (DSP)
    // =========================================================================
    {
      unitNumber: 5,
      title: 'Digital Signal Processors & Finite-Word-Length Effects',
      hours: 6,
      summary:
        'Finite-word-length quantization/truncation/overflow/limit-cycles, evolution of DSPs, Modified Harvard architecture, MAC/barrel-shifter/DAG hardware units, DSP vs general CPU, circular & bit-reversed addressing modes.',
      topics: [
        {
          id: 'sp-u5-dsp-arch-fwl',
          title: 'Finite-Word-Length Effects, DSP Architecture, Hardware Units & Addressing',
          summary:
            'ADC/coefficient/product quantization errors, limit cycles, Modified Harvard DSP buses, single-cycle MAC, Barrel Shifter, DAGs, zero-overhead loops, circular & bit-reversed addressing, functional modes.',
          explanation:
            'Implementing filters on real embedded silicon introduces Finite-Word-Length (FWL) effects: fixed-point Q15/Q31 rounding shifts delicate high-order IIR poles (occasionally pushing |p| ≥ 1 into instability unless factored into Cascade 2nd-order Biquads!), arithmetic truncation creates low-level zero-input Limit-Cycle oscillations, and 2’s-complement overflow wraps large spikes catastrophically unless guarded by Saturation Arithmetic. Dedicated Digital Signal Processors evolved specifically to defeat general-purpose von Neumann CPU bottlenecks: (1) Modified Harvard Architecture uses separate buses/caches to fetch instruction opcode, sample x[n−k], and coefficient h[k] simultaneously; (2) Dedicated Hardware Units—a Single-Cycle Hardware Multiplier-Accumulator (MAC) with 40-bit guard bits, Hardware Barrel Shifter, Dual Data Address Generators (DAGs), and Zero-Overhead Hardware Loops—run FIR/FFT loops in 1 clock per tap; (3) Specialized Addressing Formats include Modulo Circular Addressing (sliding delay-line ring buffers without manual index resets) and Bit-Reversed Addressing (in-place Radix-2 FFT permutation) alongside idle/DMA/host functional modes.',
          workingPrinciple:
            'Simultaneous bus fetches paired with single-cycle MAC execution plus modulo circular DAGs achieve strict deterministic sample-by-sample latency unlike cached general-purpose CPUs.',
          inputOutput: { input: 'Q15/Float Sample Bus + Filter Tap Stream', output: 'Single-Cycle MAC Saturated Sum' },
          equations: [
            { label: 'Quantized Coefficient Sensitivity Rationale', latex: 'H(z) = \\prod_{k=1}^{M} \\frac{b_{0k} + b_{1k}z^{-1} + b_{2k}z^{-2}}{1 + a_{1k}z^{-1} + a_{2k}z^{-2}} \\quad (\\text{Cascade Biquads reduce pole drift!})' },
          ],
          mermaidDiagram: `flowchart TB
  PM["Program Memory Bus"] --> DEC["Decode & Zero-Overhead Loop Ctrl"]
  DM1["Data Mem 1 (Samples x[n])"] --> DAG1["Circular/Bit-Rev DAG1"]
  DM2["Data Mem 2 (Coeffs h[k])"] --> DAG2["Modulo DAG2"]
  DAG1 --> MAC["Hardware Multiplier + 40-Bit Guard MAC + Barrel Shifter"]
  DAG2 --> MAC
  MAC --> OUT["Saturated Q31 Output Bus"]`,
          realWorldApplications: {
            summary: 'Runs phase-sensitive Coriolis flow DSPs, active noise/vibration cancellers, and multi-channel radar FFT pipelines deterministically.',
            industries: ['Coriolis Mass Flow', 'Vibration Analyzers', 'Autonomous Radar/Sonar'],
            examples: ['TI C2000/SHARC DSP calculating zero-crossing phase delay between Coriolis sensor pickup coils in real time'],
          },
          crossLinks: [
            { label: 'Microprocessors & Embedded Systems (Sem V)', targetSubjectId: 'nitj-sem5-mpes', note: 'Contrasts general Von Neumann/Harvard CISC/RISC MCUs (8085/8086/8051) against specialized single-cycle MAC DSPs.' },
          ],
        },
      ],
    },
  ],

  comparisons: [
    {
      title: 'FIR vs IIR Digital Filters',
      leftName: 'FIR (Finite Impulse Response)',
      rightName: 'IIR (Infinite Impulse Response)',
      rows: [
        { criterion: 'Stability', leftValue: 'Unconditionally BIBO stable (all poles at origin z = 0)', rightValue: 'Conditional: every feedback pole must stay strictly inside |z| < 1' },
        { criterion: 'Phase Linearity', leftValue: 'Exact linear phase (constant group delay) via symmetric coefficients', rightValue: 'Nonlinear phase near passband edge (phase distortion)' },
        { criterion: 'Order & MAC Cost', leftValue: 'Higher order N needed for sharp cutoff transitions', rightValue: 'Low compact order mimicking analog Butterworth/Chebyshev prototypes' },
      ],
    },
    {
      title: 'Digital Signal Processor (DSP) vs General-Purpose Microprocessor',
      leftName: 'Dedicated DSP Core (TI C5000/SHARC)',
      rightName: 'General-Purpose CPU (x86 / 8086)',
      rows: [
        { criterion: 'Bus Architecture', leftValue: 'Modified Harvard multi-bus fetching data + coeffs + opcode together', rightValue: 'Shared unified cache/bus optimizing branching & OS multitasking' },
        { criterion: 'Math & Addressing Hardware', leftValue: 'Single-cycle MAC + guard bits + circular/bit-reversed DAGs + zero-overhead loop', rightValue: 'Multi-cycle general ALU/FPU optimized around complex branches' },
      ],
    },
  ],

  simulatorQuestions: [
    {
      id: 'sim-sp-1',
      level: 'Beginner',
      topic: 'Nyquist Sampling & Anti-Aliasing',
      question: 'An instrumentation engineer samples a clean 600 Hz vibration tone contaminated by 1800 Hz gear whine at sampling rate f_s = 2000 Hz WITHOUT using any analog low-pass filter before the ADC. What false frequency appears inside the FFT spectrum?',
      options: [
        'An aliased spike at 200 Hz right next to true low-frequency balance peaks!',
        'Exact 1800 Hz appears unchanged',
        'The 1800 Hz whine disappears automatically',
      ],
      correctIndex: 0,
      answer: 'A phantom alias at |2000 − 1800| = 200 Hz! Once sampled past Nyquist f_s/2 = 1000 Hz, no digital filter can separate it from genuine 200 Hz motion.',
      principle: 'Aliased frequency f_alias = |f_in − k·f_s| folds inside [0, f_s/2]; analog anti-aliasing MUST sit ahead of the ADC sampler.',
      followUpIfCorrect: 'Where should the analog Butterworth/Sallen-Key anti-aliasing filter cutoff f_c be positioned for f_s = 2000 Hz?',
      followUpIfReview: 'Compare 1800 Hz against f_s = 2000 Hz and fold around multiples of f_s.',
      followUpAnswer: 'Set f_c comfortably below Nyquist (e.g., 650–800 Hz at 4th-order −80 dB/dec) so energy above f_s/2 = 1000 Hz is heavily attenuated prior to sampling!',
    },
    {
      id: 'sim-sp-2',
      level: 'Intermediate',
      topic: 'Linear-Phase FIR vs Bilinear IIR',
      question: 'You are designing a digital bandpass/lowpass filter inside a fixed-point DSP where distortion of ECG QRS pulse shape must be zero across frequencies. Which filter family & method should you pick?',
      options: [
        'Symmetric Hamming/Kaiser Windowed FIR filter (exact linear phase + always stable)',
        'High-order single Direct-Form IIR Chebyshev filter via Impulse Invariance',
        'Unwindowed rectangular truncated FIR',
      ],
      correctIndex: 0,
      answer: 'Symmetric Windowed FIR filter — symmetry forces constant Group Delay across all passband components while guaranteeing unconditional stability!',
      principle: 'Symmetric FIR impulse h[n] = h[N−1−n] ensures constant group delay τ_g = (N−1)/2 with zero pole-quantization risk.',
      followUpIfCorrect: 'What happens to transition sharpness vs stopband ripple if you swap from a Rectangular window to a Blackman window at fixed filter length N?',
      followUpIfReview: 'Remember IIR Chebyshev introduces strong group delay dispersion near cutoff.',
      followUpAnswer: 'Stopband sidelobe ripple improves dramatically (from −13 dB down to −74 dB), while main-lobe transition bandwidth widens ~3× (requiring larger N to sharpen)!',
    },
  ],
};

