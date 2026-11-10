import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const NITJ_MICROPROCESSORS_EMBEDDED: CurriculumSubjectDetail = {
  id: 'nitj-sem5-mpes',
  semester: 5,
  displaySemesterLabel: 'Semester V',
  code: 'ICDC0301',
  name: 'Microprocessors and Embedded Systems',
  shortName: 'Microprocessors & Embedded',
  credits: 4,
  category: 'Electronics',
  syllabusStatus: 'official-core',
  syllabusBadge: 'NITJ Core · Rev. June 2025',
  overview:
    'Official Semester V core (ICDC0301 · CO1–CO5): Computer architecture & organization (Von Neumann, Harvard, RISC, CISC, 8/16/32/64-bit); Intel 8085 pinout, architecture, instructions, timing diagrams, assembly programming, stack & interrupts; 8085 Memory & I/O interfacing (8251 USART, 8253/8254 PIT, 8255 PPI, 8279 Kbd/Disp); Intel 8086 segmented 16-bit architecture & operating modes; 8051 microcontroller architecture, programming, timers, serial & LCD/7-segment/ADC/DAC interfacing; Embedded Systems & HW/SW co-design; Open-source Arduino & Raspberry Pi platforms.',
  units: [
    // =========================================================================
    // SECTION 1 — Introduction
    // =========================================================================
    {
      unitNumber: 1,
      title: 'Introduction to Computer Architecture, Organization, RISC/CISC & Word Width',
      hours: 5,
      summary:
        'Computer architecture vs computer organization, Von Neumann vs Harvard architectures, RISC vs CISC processors, and 8-bit, 16-bit, 32-bit, and 64-bit processor scaling.',
      topics: [
        {
          id: 'mpes-u1-arch-org',
          title: 'Architecture vs Organization, Von Neumann vs Harvard & RISC/CISC/Word Size',
          summary:
            'ISA visibility vs datapath hardware; unified Von Neumann vs split-bus Harvard; CISC variable multi-cycle vs RISC load/store pipelining; 8/16/32/64-bit buses.',
          explanation:
            'Computer Architecture covers programmer-visible instruction sets, registers, addressing modes, and memory models (WHAT the processor does), whereas Computer Organization covers internal ALU datapaths, control signals, bus widths, and cache hardware (HOW it implements them physically). Two foundational memory topologies divide processors: (1) Von Neumann Architecture shares ONE unified memory and single data/instruction bus cleanly simplifying RAM allocation at the cost of the "Von Neumann Bottleneck" (impossible to fetch opcode + data operand simultaneously); (2) Harvard Architecture physically isolates Program Memory and Data Memory onto separate buses (allowing 1-clock fetch+execute inside 8051/AVR MCUs & DSPs). Instruction sets split between CISC (complex variable-length multi-clock instructions reducing code RAM size—8085/8086) and RISC (fixed 32-bit Load/Store single-cycle pipelined instructions with large register files—ARM Cortex/AVR). Scaling CPU word width cleanly from 8-bit → 16-bit → 32-bit → 64-bit expands native integer dynamic range (255 → 65,535 → 4.29B → 1.84×10¹⁹) and directly enlarges directly addressable RAM.',
          workingPrinciple:
            'Physical separation of instruction and data buses lets Harvard microcontrollers fetch tomorrow’s opcode simultaneously while writing today’s sensor output.',
          inputOutput: { input: 'Stored Machine Code & Sensor Bus', output: 'Sequenced Bus Reads/Writes & ALU Flags' },
          equations: [
            { label: 'Direct Addressable Byte Space from Width n', latex: 'M_{\\max} = 2^{n_{\\text{addr}}}\\text{ bytes} \\quad (16\\text{-bit}=64\\text{ KB},\\; 20\\text{-bit}=1\\text{ MB},\\; 32\\text{-bit}=4\\text{ GB})' },
          ],
          realWorldApplications: {
            summary: 'Guides microprocessor/MCU selection across smart field transmitters (8/32-bit Harvard MCUs) vs SCADA plant servers (64-bit modified-Harvard x86/ARM).',
            industries: ['Smart Transmitters', 'Industrial PLCs', 'Edge IIoT'],
            examples: ['Choosing ultra-low-power 16/32-bit RISC MCU over 8-bit CISC for solar HART RTU telemetry'],
          },
          crossLinks: [
            { label: 'Digital Logic (Sem III ECDC0213)', targetSubjectId: 'nitj-sem3-ade', note: 'Combinational decoders, ALUs, flip-flops & registers form the building blocks here.' },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Introduction to 8-bit Microprocessor (Intel 8085)
    // =========================================================================
    {
      unitNumber: 2,
      title: '8-Bit Microprocessor: Intel 8085 Architecture, Pinout, Timing & Programming',
      hours: 9,
      summary:
        'Intel 8085 pin configuration, internal architecture (ALU, registers, flags, PC, SP), instruction format/types/set, addressing modes, machine cycles & timing diagrams, assembly programming, stack & interrupts.',
      topics: [
        {
          id: 'mpes-u2-8085-arch-pins',
          title: 'Intel 8085 Architecture, Pin Configuration, Register Set & Flags',
          summary:
            '40-pin DIP (AD0–AD7 + A8–A15, ALE, IO/M̄, RD̄, WR̄, SID/SOD, HOLD/HLDA); Accumulator A, B/C/D/E/H/L pairs, 16-bit PC & SP, and 5 Condition Flags (S, Z, AC, P, CY).',
          explanation:
            'The Intel 8085AH (40-pin DIP, +5 V supply, 3–5 MHz internal f_xtal/2 clock) exposes an 8-bit Data Bus multiplexed time-wise over pins AD0–AD7 with the lower 8 Address bits! During clock T1 of every machine cycle, ALE (Address Latch Enable) pulses HIGH so an external 74LS373 transparent latch freezes A0–A7; during T2–T3, AD0–AD7 switches dynamically into bidirectional data D0–D7 while A8–A15 hold upper address bits. Internally, the programmer sees the 8-bit Accumulator (A), six general 8-bit registers B, C, D, E, H, L (combinable cleanly as 16-bit BC, DE, HL pointer pairs), 16-bit Program Counter (PC holding next opcode address), 16-bit Stack Pointer (SP pointing to top-of-stack RAM), and the 5-bit Flag Register (Sign S, Zero Z, Auxiliary Carry AC for BCD DAA, Even Parity P, Carry CY) paired alongside ALU & Instruction Decoder.',
          workingPrinciple:
            'ALE captures lower address byte A0–A7 at the end of T1, freeing the same 8 DIP pins AD0–AD7 cleanly for bidirectional data transfers throughout T2–T3.',
          inputOutput: { input: '6 MHz Crystal (f_clk = 3 MHz) + Opcodes', output: '20 ns–333 ns T-State Controlled Bus' },
          equations: [
            { label: '8085 T-State & Program Flag Byte Bits', latex: 'T_{\\text{state}} = \\frac{2}{f_{\\text{xtal}}}, \\qquad \\text{PSW Flags} = [\\text{S}\\;\\text{Z}\\;\\times\\;\\text{AC}\\;\\times\\;\\text{P}\\;\\times\\;\\text{CY}]' },
          ],
          mermaidDiagram: `flowchart TB
  AD["Multiplexed AD0–AD7"] -->|"ALE=1 -> Latch A0–A7"| LATCH["74LS373 Low Addr Latch"]
  AD <-->|"T2–T3 Data Bus"| ALU["ALU + Accumulator (A) + Flags (S,Z,AC,P,CY)"]
  REGS["General Regs B,C,D,E,H,L + PC(16) + SP(16)"] <--> ALU
  TIM["Timing & Control (IO/M̄, RD̄, WR̄, S0, S1)"] --> AD`,
          realWorldApplications: {
            summary: 'Teaches synchronous bus arbitration (HOLD/HLDA DMA) and control-pin decoding found across modern embedded peripheral controllers.',
            industries: ['Technical Foundations', 'Legacy Process Instrumentation'],
            examples: ['Latching AD0–AD7 cleanly into external EPROM/RAM memory chips via ALE + IO/M̄'],
          },
        },
        {
          id: 'mpes-u2-8085-instr-timing-stack-int',
          title: '8085 Instructions, Addressing Modes, Timing Diagrams, Stack & Interrupts',
          summary:
            '1/2/3-byte formats & 5 instruction groups; 5 addressing modes; Opcode Fetch (4T/6T), Memory R/W (3T) & I/O R/W timing waveforms; LIFO Stack (PUSH/POP/CALL/RET) & 5 Interrupts (TRAP..INTR).',
          explanation:
            '8085 instructions span 1-byte (MOV A,B), 2-byte (MVI A, 25H), and 3-byte (LDA 2050H) lengths across 5 addressing modes: Immediate (MVI/LXI), Register (MOV/ADD), Direct (LDA/STA), Register Indirect (MOV A,M using HL), and Implied (CMA/HLT). Every instruction decomposes into Machine Cycles—Opcode Fetch (4T–6T with S1=1, S0=1, IO/M̄=0), Memory Read/Write (3T), and I/O Read/Write (3T, IO/M̄=1)—visible directly on timing diagrams! The LIFO Stack grows downward in RAM (PUSH/CALL pre-decrements SP by 2; POP/RET pops & increments SP by 2) to preserve return PC cleanly across subroutines and interrupts. Five hardware interrupts rank strictly by priority: TRAP (Pin 6, RST 4.5 = 0024H, Non-Maskable edge+level!), RST 7.5 (003CH, edge-triggered), RST 6.5 (0034H), RST 5.5 (002CH), and maskable non-vectored INTR (needs external 8259 INTĀ).',
          workingPrinciple:
            'Before jumping automatically to vector 0024H–003CH upon an interrupt, the CPU pushes current PC onto Stack Pointer SP so RET resumes exact interrupted execution.',
          equations: [
            { label: 'Vectored Interrupt Memory Jump Addresses', latex: '\\text{TRAP}=0024\\text{H},\\; \\text{RST5.5}=002\\text{CH},\\; \\text{RST6.5}=0034\\text{H},\\; \\text{RST7.5}=003\\text{CH}' },
          ],
          numericals: [
            {
              title: 'Total Execution Time of 8085 Instruction Sequence',
              problem: 'At crystal f_xtal = 6.144 MHz, compute total execution time for: MVI A, 35H (7T) followed by STA 2050H (13T).',
              steps: [
                'Internal clock f_clk = 6.144 / 2 = 3.072 MHz ⇒ 1 T-state = 1 / 3.072 MHz = 0.3255 μs.',
                'Total T-states = 7T + 13T = 20 T-states.',
                'Total elapsed time = 20 × 0.3255 μs = 6.51 μs.',
              ],
              result: 'Total execution time = 6.51 μs (f_clk = 3.072 MHz).',
            },
          ],
          realWorldApplications: {
            summary: 'Exact T-state counting lets engineers synthesize calibrated software timers cleanly and assign life-critical shutdown inputs to Non-Maskable TRAP!',
            industries: ['Safety Interlocks', 'Lab Assembly Trainers'],
            examples: ['Wiring an emergency trip button directly to 8085 TRAP (RST 4.5) so EI/DI masks can never ignore it'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Peripherals and Interfacing for 8085
    // =========================================================================
    {
      unitNumber: 3,
      title: '8085 Memory/I/O Interfacing & Peripherals (8251, 8253/8254, 8255, 8279)',
      hours: 8,
      summary:
        'Memory interfacing & address decoding, Memory-Mapped vs Peripheral-Mapped I/O, data transfer schemes (Programmed/Interrupt/DMA), and internal block/pin/mode architectures of 8251, 8253/8254, 8255 & 8279.',
      topics: [
        {
          id: 'mpes-u3-mem-io-schemes',
          title: 'Memory Interfacing, Memory-Mapped vs Peripheral-Mapped I/O & Data Transfers',
          summary:
            '74LS138 address decoding (RAM/EPROM); 16-bit MEMR/MEMW Memory-Mapped I/O vs 8-bit IN/OUT IOR/IOW Isolated I/O; Programmed Polling, Interrupt-Driven & HOLD/HLDA DMA.',
          explanation:
            'To connect multiple EPROM, SRAM, and peripheral ICs onto one shared bus without bus contention, upper address lines feed decoders (e.g., 3-to-8 74LS138) generating unique active-low Chip Select CS̄ signals across disjoint address ranges. Connecting I/O devices offers two choices: (1) Peripheral (I/O)-Mapped I/O decodes A0–A7 (256 ports max) gated strictly with IO/M̄ = 1 using dedicated 2-byte IN/OUT instructions—preserving all 64 KB RAM untouched; (2) Memory-Mapped I/O decodes full 16-bit A0–A15 with IO/M̄ = 0, treating every port like a memory cell so powerful instructions (MOV, ADD, STA, CMP M) act on field ports directly! Data transfers occur via CPU Polling (Programmed wait loop), Asynchronous Interrupts (CPU runs background tasks until device pulses INTR/RST), or Direct Memory Access (DMA controller pulls HOLD HIGH so CPU tri-states buses via HLDA and bulk-transfers high-speed ADC frames directly into RAM).',
          workingPrinciple:
            'Gating IO/M̄ alongside chip-select logic separates I/O ports cleanly from RAM or intentionally maps ports right inside the 64 KB memory space for single-instruction arithmetic.',
          equations: [
            { label: 'Control Strobe Decoding Matrix', latex: '\\overline{\\text{MEMR}} = \\text{IO/}\\overline{\\text{M}} + \\overline{\\text{RD}}, \\qquad \\overline{\\text{IOR}} = \\overline{\\text{IO/}\\overline{\\text{M}}} + \\overline{\\text{RD}} \\;(\\text{Active Low})' },
          ],
          realWorldApplications: {
            summary: 'DMA high-speed streaming and memory-mapped peripheral registers remain standard in every modern ARM Cortex & PLC I/O backplane.',
            industries: ['High-Speed DAQ', 'PLC Rack Backplanes'],
            examples: ['Allocating 0000H–1FFFH (8 KB EPROM), 2000H–3FFFH (8 KB SRAM) & 80H–83H (I/O ports) cleanly via 74LS138 decoder'],
          },
        },
        {
          id: 'mpes-u3-peripherals-825x',
          title: 'Programmable Peripherals: 8251 USART, 8253/8254 PIT, 8255 PPI & 8279',
          summary:
            '8251 Sync/Async serial USART (Mode/Command/Status); 8253/8254 3×16-bit Timer (Modes 0–5); 8255 24-bit PPI (Modes 0/1/2 + Port C BSR); 8279 64-key auto-debounce & 16-digit display controller.',
          explanation:
            'Offloading repetitive timing, parallel latching, serial framing, and keypad debounce from the 8085 uses four workhorse Intel ICs: (1) **8255A PPI** provides 24 parallel I/O lines (Port A 8-bit, Port B 8-bit, Port C split 4+4 bit) configurable across Mode 0 (basic latched I/O), Mode 1 (handshake STB/IBF/OBF), Mode 2 (bidirectional Port A), plus Bit Set/Reset (BSR: bit 7=0 in CWR sets/resets single Port C pins independently); (2) **8253 / 8254 PIT** integrates three independent 16-bit down-counters (CLK/GATE/OUT) programmable across 6 hardware modes (Mode 2 rate generator & Mode 3 exact 50%-duty square wave baud clock; 8254 adds Read-Back command); (3) **8251A USART** converts parallel bytes to full-duplex serial TxD/RxD (Mode Word + Command Word, ×1/×16/×64 baud factor, parity); and (4) **8279 Keyboard/Display Controller** scans up to 64 keys with hardware ~10 ms debounce into an 8-byte FIFO + IRQ while autonomously refreshing sixteen 7-segment digits from dual 16×8 Display RAM!',
          workingPrinciple:
            'Writing compact configuration bytes once at startup programs dedicated peripheral silicon to sustain exact baud clocks, handshakes, and LED scans cleanly without burning CPU loops.',
          equations: [
            { label: '8255 CWR Address Decode & 8253 Frequency Division', latex: 'A_1A_0 = 11 \\implies \\text{Control Reg}, \\qquad f_{\\text{OUT}} = \\frac{f_{\\text{CLK}}}{N_{\\text{16-bit}}}' },
          ],
          mermaidDiagram: `flowchart LR
  CPU["Intel 8085 CPU (D0–D7, A0–A7, CS̄)"] --> PPI["8255 PPI (24 Parallel Pins: ADC/Stepper)"]
  CPU --> PIT["8253/8254 PIT (3x 16-bit Timers -> Baud Clk)"]
  PIT -->|"TxC / RxC"| USART["8251 USART (TxD/RxD RS-232 Telemetry)"]
  CPU --> KBD["8279 Kbd/Disp (64-Key FIFO + 16-Digit LEDs)"]`,
          realWorldApplications: {
            summary: 'Complete hardware blueprint behind industrial weighbridge scales, CNC control keypads, Modbus RS-232 ports, and PLC digital card blocks.',
            industries: ['Benchtop Instruments', 'Motor Trainers', 'Telemetry Modems'],
            examples: ['Programming 8255 Control Word 98H (PA=In, PC_upper=In, PB=Out) to read ADC0808 on PA and drive relays on PB'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Introduction to 16-bit Microprocessor (Intel 8086)
    // =========================================================================
    {
      unitNumber: 4,
      title: '16-Bit Microprocessor: Intel 8086 Architecture, Segmentation, Modes & Interrupts',
      hours: 8,
      summary:
        'Intel 8086 internal block diagram (BIU & EU), registers & flags, 6-byte instruction queue, 20-bit segmented physical addressing, pin description, Min/Max operating modes, addressing modes & interrupts.',
      topics: [
        {
          id: 'mpes-u4-8086-arch-seg',
          title: 'Intel 8086 BIU/EU Block Architecture, Registers, Flags, Prefetch Queue & Segmentation',
          summary:
            'Parallel Bus Interface Unit (BIU: CS/DS/SS/ES, IP, 6-byte queue, 20-bit adder) & Execution Unit (EU: AX–DX, SP/BP/SI/DI, 16-bit ALU, 9 Flags); 1 MB Physical Address PA = Segment×16 + Offset.',
          explanation:
            'The Intel 8086 upgrades cleanly to a 16-bit ALU/data path AND a 20-bit address bus (1 MB RAM) while introducing Instruction Pipelining by splitting silicon into two asynchronous engines: (1) Bus Interface Unit (BIU) handles all external pins (multiplexed AD0–AD15 & A16/S3–A19/S6), shifts 16-bit Segment Registers (CS Code, DS Data, SS Stack, ES Extra) left by 4 bits (×16) and adds 16-bit Offsets (IP/BX/SI/DI/SP) via a dedicated adder to reach 20-bit Physical Addresses (PA = Seg×10H + Offset), AND keeps a 6-byte Instruction Prefetch Queue filled whenever the bus is quiet! (2) Execution Unit (EU) decodes queued opcodes cleanly in parallel across four split general registers AX(AH/AL)..DX, pointer/index registers SP, BP, SI, DI, and 9 Flags (6 status flags + 3 control flags: Trap TF, Interrupt IF, String Direction DF)!',
          workingPrinciple:
            'Because BIU pre-fetches upcoming bytes into a 6-byte FIFO queue while EU executes internal math, memory fetch idle states vanish cleanly (until a JUMP flushes the queue!).',
          equations: [
            { label: '20-Bit Physical Address Calculation', latex: '\\text{PA}_{20} = (\\text{Segment}_{16} \\ll 4) + \\text{Offset}_{16} = (\\text{Segment} \\times 10\\text{H}) + \\text{Offset}' },
          ],
          numericals: [
            {
              title: '8086 Logical Segment:Offset to 20-Bit Physical Address',
              problem: 'If CS = 2400H and IP = 05B8H, calculate the 20-bit Physical Address of the next opcode and upper limit of that 64 KB code segment.',
              steps: [
                'Shift CS left by 1 hex digit (×16 = 10H): 2400H × 10H = 24000H.',
                'Add IP Offset: PA = 24000H + 05B8H = 245B8H.',
                'A single 64 KB segment spans offsets 0000H to FFFFH ⇒ ending at 24000H + FFFFH = 33FFFH.',
              ],
              result: 'Physical Address = 245B8H; Segment ends at 33FFFH.',
            },
          ],
          mermaidDiagram: `flowchart LR
  subgraph BIU["Bus Interface Unit (BIU)"]
    SEG["Segments: CS, DS, SS, ES + IP"] --> ADD["20-Bit Physical Adder (Seg*16 + Off)"]
    Q["6-Byte Prefetch FIFO Queue"]
  end
  MEM["1 MB Memory Bus (AD0–AD15, A16–A19)"] <--> Q
  Q --> EU["Execution Unit (EU): AX–DX, SP/BP/SI/DI, 16-bit ALU, 9 Flags"]`,
          realWorldApplications: {
            summary: 'Introduced x86 hardware segmentation, pipelined instruction prefetching, and real-mode drivers used across industrial PC controllers.',
            industries: ['Industrial PCs / SCADA', 'Legacy Motion Controllers'],
            examples: ['Protecting separate Code (CS), Sensor Array Data (DS), and Stack (SS) partitions inside 1 MB RAM cleanly'],
          },
        },
        {
          id: 'mpes-u4-8086-modes-addr-int',
          title: '8086 Pin Description, Minimum/Maximum Modes, Addressing Modes & Interrupts',
          summary:
            'MN/MX̄ pin switching Single-CPU Minimum Mode vs Multiprocessor Maximum Mode (8288 Bus Controller + 8087); 8086 Addressing Modes (Indexed/Based-Indexed); 256-vector 1 KB Interrupt Vector Table (IVT).',
          explanation:
            '8086 pins adapt dynamically to system complexity via Pin 33 MN/MX̄: strapping MN/MX̄ = +5 V selects **Minimum Mode** (CPU directly outputs ALE, DEN̄, DT/R̄, M/IŌ, WR̄, HLDA for compact single-processor boards); strapping GND selects **Maximum Mode** (encoding status S0̄–S2̄ for an external 8288 Bus Controller + LOCK̄/QS0–QS1 to share the bus cleanly with an 8087 math coprocessor or 8089 DMA!). Powerful 8086 Addressing Modes extend 8085 cleanly with Displacement, Register-Indirect ([BX]/[SI]/[DI]), Based-Indexed ([BX+SI]), and Based-Indexed-with-Displacement array indexing! All 256 software & hardware Interrupts (Type 0 divide-by-zero, NMI Type 2, INTR programmable 8259, and INT n) index directly into a 1024-byte **Interrupt Vector Table (00000H–003FFH)** where each vector consumes 4 bytes holding target [IP_low, IP_high, CS_low, CS_high].',
          workingPrinciple:
            'An interrupt type N multiplies cleanly by 4 bytes (Address = 4×N) inside RAM base 0000H to fetch the full 32-bit CS:IP handler address.',
          equations: [
            { label: 'IVT Lookup & Minimum/Maximum Control Selection', latex: '\\text{IVT Entry Address} = 4 \\times N_{\\text{type}} \\;\\in [00000\\text{H},\\; 003\\text{FFH}]' },
          ],
          realWorldApplications: {
            summary: 'Vectored interrupt lookup tables and numeric coprocessors directly shaped real-time x86 RTOS & industrial PC BIOS interrupt handlers.',
            industries: ['Embedded x86 Boards', 'BIOS/RTOS Kernels'],
            examples: ['Computing IVT offset 4 × 21H = 0084H holding CS:IP pointer for DOS/BIOS hardware system call'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Microcontrollers (Intel 8051)
    // =========================================================================
    {
      unitNumber: 5,
      title: 'Microcontrollers & Intel 8051 (Architecture, Timers, UART, Interrupts & Interfacing)',
      hours: 10,
      summary:
        'MCU selection factors, Intel 8051 architecture & pinout, addressing modes, instructions & programming, Timer/Counter, UART serial & interrupt priorities, and LCD / 7-Segment / ADC / DAC interfacing.',
      topics: [
        {
          id: 'mpes-u5-8051-arch-instr',
          title: 'Microcontroller Selection, 8051 Architecture, Pinout, Addressing & Instructions',
          summary:
            'MCU criteria (word width, Flash/RAM, I/O/ADC/PWM pins, power, tools); 8051 Harvard 4 KB ROM + 128 B RAM + 4 ports (P0–P3), EĀ/PSEN̄/ALE, SFRs; 5 addressing modes & Boolean bit instructions.',
          explanation:
            'Whereas a general microprocessor requires external ROM, RAM, clock dividers, and 8255 PPIs to blink an LED, a Microcontroller embeds CPU + non-volatile Program ROM + RAM + Timers + UART + GPIO cleanly inside ONE chip—selected on processing speed, I/O pin count, integrated peripherals (ADC/PWM/UART/CAN), ultra-low standby sleep current, and IDE/debugger ecosystem! The classic Intel 8051 (MCS-51, 40-pin DIP, 12-clock machine cycle = 1.085 μs at 11.0592 MHz XTAL) integrates 4 KB ROM, 128 B internal RAM (including 32 bytes in 4 Register Banks R0–R7, 16 Bit-Addressable bytes 20H–2FH, and 80B Stack/Scratchpad), Special Function Registers (ACC, B, PSW, DPTR, SP, P0–P3, TCON/TMOD/SCON/IE/IP), and four 8-bit ports P0–P3 (remember open-drain Port 0 demands external 10 kΩ pull-ups when used as general I/O!). Instructions cover Immediate (#data), Register, Direct (SFR/RAM), Register-Indirect (@R0/@R1), Indexed MOVC (@A+DPTR for ROM lookup tables!), plus single-bit Boolean ops (SETB P1.0, CLR P1.0, JB).',
          workingPrinciple:
            'Bit-addressable RAM (00H–7FH bits) and bit-addressable SFRs let firmware flip any single port pin or timer flag cleanly in ONE instruction without corrupting adjacent 7 bits!',
          equations: [
            { label: '8051 Machine Cycle Frequency & Pull-Up Rule', latex: 'T_{\\text{MC}} = \\frac{12}{f_{\\text{osc}}} = 1.085\\,\\mu\\text{s}\\; (@\\,11.0592\\text{ MHz})' },
          ],
          realWorldApplications: {
            summary: 'Widely embedded across industrial temperature controllers, digital multimeters, appliances, and smart valve actuator positioners.',
            industries: ['Panel Controllers', 'Consumer/Industrial Appliances', 'Smart Actuators'],
            examples: ['Single instruction SETB P2.3 / CLR P2.3 pulsing ultrasonic transducer bursts or relay coils reliably'],
          },
        },
        {
          id: 'mpes-u5-8051-timers-uart-int',
          title: '8051 Timer/Counter Programming, Serial UART & Interrupt Priorities',
          summary:
            'TMOD & TCON registers; Timer Mode 1 (16-bit) & Mode 2 (8-bit auto-reload); SCON/SBUF Mode 1 full-duplex UART baud rates via Timer 1 (TH1 = FDH = 9600 bps); 5 interrupts IE & IP priority.',
          explanation:
            '8051 houses two 16-bit Timers/Counters (Timer 0 & Timer 1), configured cleanly by TMOD (choosing C/T̄ = 0 internal crystal timer vs 1 external P3.4/P3.5 event counter, plus Mode 1 non-repeating 16-bit 0000H–FFFFH or Mode 2 8-bit auto-reload for exact periodic intervals) and started/stopped via TCON (TR0/TR1 + overflow flags TF0/TF1). Serial UART (TXD=P3.1, RXD=P3.0) uses SCON = 50H (Mode 1: 8-bit variable baud, REN=1 enabled) clocked cleanly by Timer 1 in Mode 2 Auto-Reload—using standard 11.0592 MHz crystal yields exact 9600 bps with TH1 = FDH (0.00% framing error!). Five interrupts (INT0, TF0, INT1, TF1, Serial RI/TI—plus TF2 on 8052) enable individually via IE register (MSB EA=1) and divide into High vs Low priority via IP register.',
          workingPrinciple:
            'Setting Timer 1 to Mode 2 automatically reloads 8-bit TH1 into TL1 upon every rollover, generating rock-steady RS-232 UART baud clocks with zero software interrupt latency!',
          equations: [
            { label: '16-Bit Timer Reload & Mode-1 UART Baud (SMOD=0)', latex: '\\text{Reload} = 65536 - \\frac{t_{\\text{delay}}}{T_{\\text{MC}}}, \\qquad \\text{Baud} = \\frac{f_{\\text{osc}}}{12 \\times 32 \\times (256 - \\text{TH1})}' },
          ],
          numericals: [
            {
              title: 'Compute TH1 Reload for 9600 Baud on 8051 UART',
              problem: 'Find Timer-1 Mode-2 auto-reload value TH1 in hex for 9600 bps serial transmission with f_osc = 11.0592 MHz (SMOD = 0).',
              steps: [
                'Machine cycle clock / 32 UART divider = 11,059,200 / (12 × 32) = 28,800 Hz.',
                'Required division counts = 28,800 / 9600 = 3 ticks.',
                '8-bit auto-reload TH1 = 256 − 3 = 253 = FDH (or −3 in signed two’s complement)!',
              ],
              result: 'Load TH1 = 0FDH, TMOD = 20H, SCON = 50H, SETB TR1 for exact 9600 baud.',
            },
          ],
          realWorldApplications: {
            summary: 'Establishes RS-485 Modbus serial telemetry links from remote sensors straight into PLC/PC serial ports.',
            industries: ['Field Modbus Sensors', 'Embedded Telemetry', 'UPS / BMS Controllers'],
            examples: ['Embedded C/Assembly ISR catching incoming Modbus command bytes on Serial RI interrupt without stalling ADC polling'],
          },
        },
        {
          id: 'mpes-u5-8051-interfacing',
          title: '8051 Hardware Interfacing: LCD, 7-Segment Displays, ADC & DAC',
          summary:
            'HD44780 16×2 LCD command/data RS,RW,E timing (4/8-bit); Common Anode/Cathode 7-Segment lookup tables & current resistors; ADC0804/0808 SOC/EOC sensor interface; DAC0808 current/op-amp waveform synthesizer.',
          explanation:
            'Interfacing 8051 cleanly to plant HMIs & analog loops connects four universal modules: (1) **16×2 LCD (HD44780)**: wire P2 data D0–D7 (or 4-bit D4–D7) plus RS (0=command e.g. 38H/01H/0CH/80H line1; 1=ASCII char), R/W=0, and strobe Enable HIGH→LOW to latch strings! (2) **7-Segment LED Displays**: connect P1 through 330 Ω limiting resistors mapping digits 0–9 via MOVC A,@A+DPTR ROM lookup tables (scanning 4 digits >100 Hz cleanly via common transistor drivers); (3) **ADC (e.g., 8-bit SAR ADC0804 / 8-ch ADC0808)**: MCU selects channel (ABC pins), pulses ALE + Start-of-Conversion (SOC), polls End-of-Conversion (EOC/INTR) going active, and enables OE to read calibrated 0–255 sensor byte! (4) **DAC (e.g., 8-bit R-2R DAC0808 + Op-Amp I-to-V)**: MCU writes 8-bit Port byte driving proportional analog output current (I_out = I_ref × D/256) converted into clean 0–5 V/0–10 V analog valve/motor/waveform outputs.',
          workingPrinciple:
            'Wait-for-EOC polling (or external INT0 edge trigger) ensures the 8051 reads parallel SAR ADC bits strictly after all 8 successive-approximation steps settle completely.',
          mermaidDiagram: `flowchart LR
  SENS["Analog Sensor (0–5V)"] --> ADC["ADC0804/0808 (SOC/EOC)"]
  ADC -->|"P1 (D0–D7)"| MCU["Intel 8051 MCU (XTAL 11.0592MHz)"]
  MCU -->|"P2 + RS/E"| LCD["16x2 LCD & 7-Seg Display"]
  MCU -->|"P3 / P0"| DAC["DAC0808 + I/V Op-Amp -> Analog Actuator"]`,
          realWorldApplications: {
            summary: 'Complete hardware-software recipe for standalone digital thermometers, PID temperature controllers, and precision waveform bench generators.',
            industries: ['Benchtop Panel Meters', 'Smart Sensor Heads', 'Student Automation Rigs'],
            examples: ['Reading LM35 analog temp via ADC0804 on P1, formatting degrees °C in ROM, and printing live to 16×2 LCD on P2'],
          },
          crossLinks: [
            { label: 'DAC & ADC Circuits (Sem III ECDC0213)', targetSubjectId: 'nitj-sem3-ade', note: 'Reviews internal R-2R DAC ladders and SAR comparator conversion circuits.' },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 6 — Embedded Systems
    // =========================================================================
    {
      unitNumber: 6,
      title: 'Embedded Systems Architecture, Quality Attributes & Hardware-Software Co-Design',
      hours: 6,
      summary:
        'Embedded vs general computing systems, classification, design challenges & application areas, purpose & characteristics, quality attributes, typical system elements, and hardware-software co-design.',
      topics: [
        {
          id: 'mpes-u6-embedded-codesign',
          title: 'Embedded vs General Computing, Classification, Attributes, Elements & Co-Design',
          summary:
            'Comparison vs desktop PCs; small/medium/complex & real-time classification; reliability, deterministic hard real-time, power/memory challenges; operational/non-operational quality attributes; Hardware-Software Co-Design.',
          explanation:
            'An Embedded System pairs dedicated computing hardware cleanly with domain-specific firmware engineered into a larger electromechanical product to execute defined real-time control or monitoring reliably—differing sharply from General-Purpose Computing PCs by single-function firmware (ROM/Flash), hard Real-Time deadlines (missing an ABS brake pulse or turbine overspeed trip causes catastrophic failure!), ultra-tight RAM/kilobyte energy budgets, and continuous headless 24/7 operation without user keyboards. Systems classify by complexity (small 8-bit coffee maker → medium RTOS automotive ECU → sophisticated SoC smart MRI/ADAS) and deterministic reactivity. Design balances Challenges (power/battery life, EMI/ESD plant noise, code memory limits, strict cost) against Elements (Sensors → Conditioning/ADC → Processor/ASIC/FPGA + Flash/RAM → Actuators + Comms) and Operational/Non-Operational Quality Attributes (reliability MTBF, maintainability, safety SIL, upgradability, time-to-market). **Hardware-Software Co-Design** co-architects custom FPGA/peripheral hardware accelerators alongside firmware concurrently rather than writing software last—partitioning tight microsecond PID/PWM loops into hardware timers while keeping complex telemetry/UI cleanly in C!',
          workingPrinciple:
            'Hardware-Software Partitioning maps hard high-rate tasks (PWM, quadrature decoding, CRC) onto dedicated silicon peripherals while assigning complex low-rate state logic cleanly to MCU firmware.',
          equations: [
            { label: 'Hard Real-Time Schedulability Bound (Liu-Layland RMS)', latex: 'U = \\sum_{i=1}^{n} \\frac{C_i}{T_i} \\le n\\left(2^{1/n} - 1\\right)' },
          ],
          mermaidDiagram: `flowchart TB
  SPEC["System Spec & Real-Time Constraints"] --> PART["HW / SW Co-Design Partitioning"]
  PART -->|"Fast Microsecond Loops (PWM, Timer, FPGA)"| HW["Hardware Synthesis (PCB + Silicon)"]
  PART -->|"State Machines, UI, Networking (C / RTOS)"| SW["Embedded Firmware (Flash)"]
  HW <-->|"Co-Verification & Integration"| SW`,
          realWorldApplications: {
            summary: 'Drives smart 4–20 mA field transmitters, EV Battery Management Systems (BMS), ABS braking ECUs, and medical infusion pumps.',
            industries: ['Automotive EV/ADAS', 'Medical Devices', 'Aerospace & Defense', 'Field Transmitters'],
            examples: ['Hardware timer hardware fault comparator shutting H-bridge MOSFETs within 100 ns before software RTOS even wakes up'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 7 — Open Source Electronics Platform (Arduino & Raspberry Pi)
    // =========================================================================
    {
      unitNumber: 7,
      title: 'Open-Source Electronics Platforms (Arduino & Raspberry Pi)',
      hours: 6,
      summary:
        'Open-source hardware philosophy, Arduino UNO architecture/pinout, Arduino IDE & libraries, setup()/loop() sketches & sensor/actuator applications, and Raspberry Pi Linux SBC architecture & applications.',
      topics: [
        {
          id: 'mpes-u7-arduino-platform',
          title: 'Open-Source Platforms, Arduino Architecture, IDE, Libraries & Applications',
          summary:
            'Open-source hardware ecosystem, ATmega328P UNO pinout (D0–D13 PWM, A0–A5 10-bit ADC, I2C/SPI/UART), Arduino IDE & C/C++ libraries, setup()/loop() sketch lifecycle & sensor/actuator control.',
          explanation:
            'Open-Source Electronics Platforms publish complete circuit schematics, PCB Gerbers, and permissive software toolchains publicly, slashing instrumentation prototyping time from weeks to hours. **Arduino (e.g., UNO R3)** centers on an 8-bit Harvard AVR ATmega328P (16 MHz, 32 KB Flash, 2 KB SRAM, 1 KB EEPROM, pre-flashed USB serial bootloader) exposing 14 digital I/O pins (6 supporting hardware PWM via `analogWrite(pin, 0..255)`), 6 multiplexed 10-bit ADC analog pins (`analogRead(A0)` = 0–1023 over 5 V), UART TX/RX, hardware SPI, and I2C (`Wire.h`). Writing firmware in the **Arduino IDE** follows a clean two-function life cycle: `setup()` initializes pinMode/serial/libraries once upon reset/power-up, while `loop()` executes deterministic control polling continuously—leveraging rich community Libraries (`LiquidCrystal`, `Servo`, `PID_v1`, `ModbusMaster`) to log ultrasonic distances, regulate heating PWM, and drive motors reliably.',
          workingPrinciple:
            'Bare-metal C++ execution directly controls AVR hardware timers and ADC muxes without an operating system scheduler, delivering jitter-free PWM & sensor sampling.',
          inputOutput: { input: 'Arduino C++ Sketch (.ino) + Sensors', output: '10-Bit ADC Reads + PWM / I2C / Serial Control' },
          equations: [
            { label: '10-Bit Arduino Sensor Scaling Formula', latex: 'V_{\\text{pin}} = \\frac{\\text{ADC}_{0..1023}}{1023}\\,V_{\\text{ref}}, \\qquad \\text{Duty} = \\frac{\\text{analogWrite}_{0..255}}{255} \\times 100\\%' },
          ],
          realWorldApplications: {
            summary: 'Go-to bench rapid-prototyping rig for automated calibration fixtures, sensor burn-in boards, and undergraduate capstones.',
            industries: ['R&D Prototyping', 'Automated Test Fixtures', 'Agri/HVAC IoT'],
            examples: ['PID heater bench running RTD MAX31865 SPI shield → Solid-State Relay PWM zero-cross control in <50 lines of Arduino C++'],
          },
        },
        {
          id: 'mpes-u7-raspberry-pi',
          title: 'Raspberry Pi Embedded Linux SBC Architecture & IIoT Applications',
          summary:
            '64-bit ARM SoC, microSD OS, 40-pin 3.3 V GPIO header (I2C/SPI/UART — non-5V tolerant & no onboard ADC), Python/SQLite edge dashboards, OpenCV camera inspection & Arduino vs Raspberry Pi tradeoffs.',
          explanation:
            'While Arduino excels cleanly at microsecond bare-metal sensor interfacing, complex networking, browser HMIs, SQLite logging, and machine vision require an embedded computer! **Raspberry Pi** is an affordable Single-Board Computer (SBC) integrating a multi-core 64-bit ARM Cortex SoC, gigabytes of RAM, Gigabit Ethernet, Wi-Fi/BLE, HDMI displays, USB hosts, CSI camera interface, and a 40-pin GPIO header running full Linux OS! Critical hardware traps every ICE engineer must check: (1) ALL Raspberry Pi GPIO pins operate strictly at **3.3 V** (~16 mA max)—feeding 5 V sensor logic directly destroys the SoC without level shifting; (2) Raspberry Pi has ZERO built-in analog ADC pins (external SPI/I2C ADC chips like ADS1115/MCP3008—or pairing an Arduino co-processor cleanly over USB/UART—are mandatory for analog transducers!). Combined cleanly, Arduino handles hard real-time PWM/ADC while Raspberry Pi hosts OPC UA / MQTT telemetry, SQLite history, and web SCADA dashboards!',
          workingPrinciple:
            'Linux kernel multitasking allows simultaneous Python data acquisition, local SQLite writes, MQTT broker telemetry, and camera quality inspection on one credit-card board.',
          realWorldApplications: {
            summary: 'IIoT field gateway aggregating legacy Modbus/Arduino RTUs into plant historians and vision-guided conveyor sorting.',
            industries: ['Smart Factories (IIoT)', 'Machine Vision QA', 'Remote Lab Telemetry'],
            examples: ['Hybrid edge node: Arduino reads 5 V analog load cells deterministically, streaming packets over USB to Raspberry Pi MQTT/SQLite historian'],
          },
        },
      ],
    },
  ],

  comparisons: [
    {
      title: 'Von Neumann vs Harvard Processor Architecture',
      leftName: 'Von Neumann (Intel 8085 / 8086)',
      rightName: 'Harvard (Intel 8051 / AVR / DSP)',
      rows: [
        { criterion: 'Memory & Buses', leftValue: 'Single shared address/data bus holding both Code & Data', rightValue: 'Physically separated Program Flash/ROM bus and Data RAM bus' },
        { criterion: 'Fetch Throughput', leftValue: 'Must serialize instruction fetch and memory operand transfer (bottleneck)', rightValue: 'Simultaneous parallel opcode fetch + data read/write in one cycle' },
      ],
    },
    {
      title: 'Memory-Mapped I/O vs Peripheral (I/O)-Mapped I/O (8085)',
      leftName: 'Memory-Mapped I/O (IO/M̄ = 0)',
      rightName: 'Peripheral / Isolated I/O (IO/M̄ = 1)',
      rows: [
        { criterion: 'Address Size & Instructions', leftValue: 'Full 16-bit addresses (64 KB shared); LDA/STA/ADD/CMP M work directly!', rightValue: '8-bit port addresses (256 ports); dedicated 2-byte IN / OUT instructions' },
        { criterion: 'RAM Preservation', leftValue: 'Carves port addresses cleanly out of 64 KB main memory space', rightValue: 'Full 64 KB RAM/EPROM space stays completely intact for code/data' },
      ],
    },
    {
      title: 'Arduino Microcontroller vs Raspberry Pi Embedded SBC',
      leftName: 'Arduino UNO (ATmega328P MCU)',
      rightName: 'Raspberry Pi (ARM Linux SBC)',
      rows: [
        { criterion: 'Execution & Real-Time', leftValue: 'Bare-metal C++ single loop — deterministic microsecond hardware PWM', rightValue: 'Full preemptive Linux OS — great for Python/SQL/Web, millisecond timing jitter' },
        { criterion: 'GPIO Voltage & Native ADC', leftValue: '5 V robust logic + 6 integrated 10-bit ADC analog channels', rightValue: 'Strict 3.3 V non-5V-tolerant GPIO + NO internal ADC (needs ADS1115/MCP3008)' },
      ],
    },
  ],

  simulatorQuestions: [
    {
      id: 'sim-mpes-1',
      level: 'Beginner',
      topic: '8085 Bus & Interrupts',
      question: 'Why does Intel 8085 multiplex pins AD0–AD7 AND require a 74LS373 latch pulsed by ALE at the start of every machine cycle?',
      options: [
        'Time-sharing 8 pins cleanly between A0–A7 (captured on ALE during T1) and data D0–D7 (T2–T3) fits 16-bit address + 8-bit data inside a 40-pin DIP.',
        'To boost clock speed past 100 MHz.',
        'Because the 8085 has no internal Flag register.',
      ],
      correctIndex: 0,
      answer: 'Pin economy: latching A0–A7 during T1 via ALE preserves stable 16-bit memory addresses while freeing those exact 8 pins to move D0–D7 bytes during T2–T3!',
      principle: 'Address bits A0–A7 appear strictly during T1; ALE falling edge freezes them externally so D0–D7 never corrupts memory selection.',
      followUpIfCorrect: 'Which 8085 hardware interrupt bypasses IE masks (Non-Maskable) and holds highest fixed priority?',
      followUpIfReview: 'Check what stays connected to A8–A15 vs AD0–AD7 during T1, T2, and T3.',
      followUpAnswer: 'TRAP (RST 4.5, vector 0024H) — edge- and level-triggered simultaneously, non-maskable so DI cannot disable plant emergency shutdown trips!',
    },
    {
      id: 'sim-mpes-2',
      level: 'Practical Scenario',
      topic: '8051 Crystal & Raspberry Pi Interfacing',
      question: 'An engineer wires a 0–5 V industrial pressure transmitter directly to a Raspberry Pi GPIO pin to measure tank height in Python. Name the TWO hardware design flaws here!',
      options: [
        '1) Raspberry Pi has NO internal ADC on GPIO pins (digital only); 2) Feeding 5 V into non-5V-tolerant 3.3 V BCM GPIO permanently damages the SoC!',
        'Raspberry Pi lacks Python libraries for pressure units.',
        'GPIO pins only read RS-232 negative voltages.',
      ],
      correctIndex: 0,
      answer: 'Raspberry Pi lacks native analog ADC channels AND operates strictly at 3.3 V logic — you must wire an external I2C/SPI ADC (e.g., ADS1115) powered at 3.3 V (with resistor divider/shunt)!',
      principle: 'Unlike 5 V Arduino / ADC0804 MCU pins, ARM Linux SBCs lack onboard SAR ADCs and damage above 3.3 V.',
      followUpIfCorrect: 'Meanwhile, why does a classic 8051 trainer mount an unusual 11.0592 MHz crystal?',
      followUpIfReview: 'Compare Arduino UNO A0–A5 10-bit ADC pins vs Raspberry Pi digital-only 3.3 V BCM headers.',
      followUpAnswer: '11.0592 MHz ÷ (12 × 32) = exactly 28,800 Hz — dividing cleanly by 3 (TH1 = FDH) produces exact 9600 bps UART serial frames with zero baud error!',
    },
  ],
};

