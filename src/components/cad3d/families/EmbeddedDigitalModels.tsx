import { useMemo } from 'react';
import type { PartRole } from '@/3d/instrumentFinish';
import { CadPartGroup, useCadSim, useInstrumentFinish } from '../CadPart';
import { buildLcdDisplayTexture } from '../materials';
import { PbrMat } from '../primitives';

function DipPinRows({ countPerSide = 20, span = 2.15, zOffset = 0.34, yBase = -0.14 }: {
  countPerSide?: number;
  span?: number;
  zOffset?: number;
  yBase?: number;
}) {
  const step = countPerSide > 1 ? span / (countPerSide - 1) : 0;
  const start = -span / 2;
  return (
    <group>
      {Array.from({ length: countPerSide }, (_, idx) => {
        const x = start + idx * step;
        return (
          <group key={idx}>
            <mesh position={[x, yBase, zOffset]}>
              <boxGeometry args={[0.045, 0.24, 0.04]} />
              <PbrMat preset="chrome" />
            </mesh>
            <mesh position={[x, yBase, -zOffset]}>
              <boxGeometry args={[0.045, 0.24, 0.04]} />
              <PbrMat preset="chrome" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Parameterized Dual-In-Line Microprocessor / Microcontroller / Peripheral IC
 * Cutaway lid reveals labeled Silicon Die blocks, ALU / Regs / Timer / Port cores & bond wires.
 */
function DipMicrochipAssembly({
  prefix,
  partIds,
  pinCountPerSide,
  accentRole,
  labelTop,
  labelSub,
}: {
  prefix: string;
  partIds: [string, string, string, string];
  pinCountPerSide: number;
  accentRole: PartRole;
  labelTop: string;
  labelSub: string;
}) {
  useCadSim();
  const finish = useInstrumentFinish();
  const accentColor = finish.roles[accentRole].color;
  const topTex = useMemo(
    () => buildLcdDisplayTexture(labelTop, labelSub, '#102436', accentColor),
    [labelTop, labelSub, accentColor],
  );

  return (
    <group>
      {/* Protective molded epoxy/ceramic top lid */}
      <CadPartGroup partId={partIds[0]} basePos={[0, 0.14, 0]} explodeOffset={[0, 0.85, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.35, 0.12, 0.64]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.95, 0.44]} />
          <meshBasicMaterial map={topTex} />
        </mesh>
      </CadPartGroup>

      {/* Leadframe substrate & DIP carrier base */}
      <CadPartGroup partId={partIds[1]} basePos={[0, -0.02, 0]} explodeOffset={[0, -0.55, 0]}>
        <mesh>
          <boxGeometry args={[2.35, 0.12, 0.64]} />
          <PbrMat preset="castIron" />
        </mesh>
        <DipPinRows countPerSide={pinCountPerSide} />
      </CadPartGroup>

      {/* Primary Silicon Die (ALU / Execution / Control block) */}
      <CadPartGroup partId={partIds[2]} basePos={[-0.38, 0.06, 0]} explodeOffset={[-0.5, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.08, 0.42]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.56, 0.02, 0.28]} />
          <meshStandardMaterial color={accentColor} roughness={0.55} metalness={0.18} />
        </mesh>
      </CadPartGroup>

      {/* Register File / Bus / Peripheral Sub-Die */}
      <CadPartGroup partId={partIds[3]} basePos={[0.48, 0.06, 0]} explodeOffset={[0.5, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.78, 0.08, 0.42]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.62, 0.02, 0.3]} />
          <PbrMat preset="gold" />
        </mesh>
        {/* Quartz timing crystal reference next to chip on X1/X2 pins */}
        <mesh key={`${prefix}-xtal`} position={[0.42, -0.05, 0.52]}>
          <boxGeometry args={[0.24, 0.14, 0.14]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ArduinoUnoAssembly() {
  const sim = useCadSim();
  const txBlink = 0.25 + (sim.primaryNorm ?? 0.5) * 1.15;

  return (
    <group>
      {/* UNO R3 Teal/Blue 4-Layer PCB */}
      <CadPartGroup partId="ar_pcb" basePos={[0, -0.1, 0]} explodeOffset={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[2.65, 0.1, 1.85]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      {/* ATmega328P 28-pin DIP MCU */}
      <CadPartGroup partId="ar_mcu" basePos={[0.28, 0.04, 0.12]} explodeOffset={[0.2, 0.72, 0.2]}>
        <mesh>
          <boxGeometry args={[1.38, 0.16, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <DipPinRows countPerSide={14} span={1.2} zOffset={0.22} yBase={-0.06} />
      </CadPartGroup>

      {/* USB Type-B Connector + ATmega16U2 Serial Bridge */}
      <CadPartGroup partId="ar_usb" basePos={[-1.08, 0.18, -0.42]} explodeOffset={[-0.75, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.56, 0.44, 0.48]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, -0.18, 0.95]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.48, 20]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      {/* Digital D0-D13 & Analog A0-A5 Pin Header Rails + D13 LED */}
      <CadPartGroup partId="ar_headers" basePos={[0.1, 0.1, 0]} explodeOffset={[0, 0.85, 0.45]}>
        <mesh position={[0.1, 0, -0.78]}>
          <boxGeometry args={[2.0, 0.24, 0.16]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.18, 0, 0.78]}>
          <boxGeometry args={[1.75, 0.24, 0.16]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[-0.15, 0.04, -0.45]}>
          <boxGeometry args={[0.12, 0.08, 0.08]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function RaspberryPiAssembly() {
  useCadSim();

  return (
    <group>
      {/* Structural Deep Steel Blue SBC PCB */}
      <CadPartGroup partId="rp_pcb" basePos={[0, -0.1, 0]} explodeOffset={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[2.65, 0.09, 1.75]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      {/* Quad-Core ARM SoC Heatspreader + PMIC */}
      <CadPartGroup partId="rp_soc" basePos={[-0.12, 0.04, 0.05]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.68, 0.14, 0.68]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-0.78, 0, -0.35]}>
          <boxGeometry args={[0.42, 0.1, 0.42]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      {/* 40-Pin Dual-Row Gold GPIO Header */}
      <CadPartGroup partId="rp_gpio" basePos={[-0.12, 0.14, -0.68]} explodeOffset={[0, 0.85, -0.55]}>
        <mesh>
          <boxGeometry args={[1.95, 0.18, 0.24]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-0.84 + i * 0.13, 0.14, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <PbrMat preset="gold" />
          </mesh>
        ))}
      </CadPartGroup>

      {/* RJ45 Ethernet + Dual USB 3.0 Stacks + microHDMI */}
      <CadPartGroup partId="rp_ports" basePos={[1.06, 0.28, 0]} explodeOffset={[0.8, 0.35, 0]}>
        <mesh position={[0, 0, -0.48]}>
          <boxGeometry args={[0.58, 0.56, 0.54]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0, 0.36]}>
          <boxGeometry args={[0.56, 0.56, 0.54]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-1.95, -0.18, 0.55]}>
          <boxGeometry args={[0.14, 0.08, 0.14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function Lcd16x2Assembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const lcdTex = useMemo(
    () =>
      buildLcdDisplayTexture(
        '8051  LCD  16x2',
        `T = ${(20 + (sim.primaryNorm ?? 0.5) * 60).toFixed(1)} C   OK`,
        '#102436',
        finish.roles.ceramic.color,
      ),
    [sim.primaryNorm, finish.roles.ceramic.color],
  );

  return (
    <group>
      {/* Structural Carrier PCB & 16-pin Header */}
      <CadPartGroup partId="lc_pcb" basePos={[0, 0, -0.12]} explodeOffset={[0, 0, -0.65]}>
        <mesh>
          <boxGeometry args={[2.55, 1.15, 0.1]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
        <DipPinRows countPerSide={16} span={1.9} zOffset={0} yBase={0.46} />
      </CadPartGroup>

      {/* HD44780 Controller COB & Contrast Potentiometer */}
      <CadPartGroup partId="lc_controller" basePos={[-0.3, 0, -0.22]} explodeOffset={[0, 0, -0.95]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.1, 20]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.1, 20]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      {/* Black Metal Bezel & 16x2 Character Liquid-Crystal Panel */}
      <CadPartGroup partId="lc_panel" basePos={[0, 0, 0.08]} explodeOffset={[0, 0, 0.65]}>
        <mesh>
          <boxGeometry args={[2.25, 0.84, 0.22]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[1.95, 0.56]} />
          <meshBasicMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function SevenSegAssembly() {
  const sim = useCadSim();
  const intensity = 0.4 + (sim.primaryNorm ?? 0.5) * 1.1;

  const segCoords: [number, number, number, number][] = [
    [0, 0.48, 0.42, 0.09],   // a
    [0.24, 0.24, 0.09, 0.4], // b
    [0.24, -0.24, 0.09, 0.4],// c
    [0, -0.48, 0.42, 0.09],  // d
    [-0.24, -0.24, 0.09, 0.4],// e
    [-0.24, 0.24, 0.09, 0.4], // f
    [0, 0, 0.42, 0.09],      // g
  ];

  return (
    <group>
      {/* Epoxy Diffuser Body */}
      <CadPartGroup partId="ss_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0, -0.55]} isCutawayShell>
        <mesh>
          <boxGeometry args={[0.92, 1.38, 0.36]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      {/* 7 LED Segment Bars + Decimal Point */}
      <CadPartGroup partId="ss_leds" basePos={[0, 0, 0.19]} explodeOffset={[0, 0, 0.65]}>
        {segCoords.map(([x, y, w, h], idx) => (
          <mesh key={idx} position={[x, y, 0]}>
            <boxGeometry args={[w, h, 0.05]} />
            <PbrMat preset={idx === 2 ? 'anodizedDark' : 'alnicoRed'} />
          </mesh>
        ))}
        <mesh position={[0.35, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      {/* 10-Pin Common Cathode/Anode Leads */}
      <CadPartGroup partId="ss_pins" basePos={[0, 0, -0.28]} explodeOffset={[0, -0.55, -0.6]}>
        {Array.from({ length: 5 }, (_, i) => (
          <group key={i}>
            <mesh position={[-0.3 + i * 0.15, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
              <PbrMat preset="chrome" />
            </mesh>
            <mesh position={[-0.3 + i * 0.15, -0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
              <PbrMat preset="chrome" />
            </mesh>
          </group>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function renderEmbeddedDigitalModel(key: string) {
  switch (key) {
    case 'intel-8085':
      return (
        <DipMicrochipAssembly
          prefix="8085"
          partIds={['m85_lid', 'm85_carrier', 'm85_alu', 'm85_regs']}
          pinCountPerSide={20}
          accentRole="primaryBody"
          labelTop="INTEL 8085AH"
          labelSub="8-BIT CPU · 3 MHz"
        />
      );
    case 'intel-8086':
      return (
        <DipMicrochipAssembly
          prefix="8086"
          partIds={['m86_lid', 'm86_carrier', 'm86_biu', 'm86_eu']}
          pinCountPerSide={20}
          accentRole="secondaryBody"
          labelTop="INTEL 8086"
          labelSub="16-BIT BIU+EU · 1MB"
        />
      );
    case 'intel-8051':
      return (
        <DipMicrochipAssembly
          prefix="8051"
          partIds={['m51_lid', 'm51_carrier', 'm51_rom_ram', 'm51_ports']}
          pinCountPerSide={20}
          accentRole="sensing"
          labelTop="INTEL MCS-51"
          labelSub="8051 MCU · HARVARD"
        />
      );
    case 'ic-8251':
      return (
        <DipMicrochipAssembly
          prefix="8251"
          partIds={['p51_lid', 'p51_carrier', 'p51_txrx', 'p51_modem']}
          pinCountPerSide={14}
          accentRole="copper"
          labelTop="8251A USART"
          labelSub="SERIAL TX/RX COMM"
        />
      );
    case 'ic-8253':
      return (
        <DipMicrochipAssembly
          prefix="8253"
          partIds={['p53_lid', 'p53_carrier', 'p53_counters', 'p53_ctrl']}
          pinCountPerSide={12}
          accentRole="sensing"
          labelTop="8253/8254 PIT"
          labelSub="3x 16-BIT TIMERS"
        />
      );
    case 'ic-8255':
      return (
        <DipMicrochipAssembly
          prefix="8255"
          partIds={['p55_lid', 'p55_carrier', 'p55_groups', 'p55_ports']}
          pinCountPerSide={20}
          accentRole="secondaryBody"
          labelTop="8255A PPI"
          labelSub="24-BIT PA / PB / PC"
        />
      );
    case 'ic-8279':
      return (
        <DipMicrochipAssembly
          prefix="8279"
          partIds={['p79_lid', 'p79_carrier', 'p79_keyscan', 'p79_dispram']}
          pinCountPerSide={20}
          accentRole="primaryBody"
          labelTop="8279 KBD/DISP"
          labelSub="64-KEY SCAN + FIFO"
        />
      );
    case 'dsp-processor':
      return (
        <DipMicrochipAssembly
          prefix="dsp"
          partIds={['dsp_lid', 'dsp_carrier', 'dsp_mac', 'dsp_harvard']}
          pinCountPerSide={20}
          accentRole="sensing"
          labelTop="FIXED/FLOAT DSP"
          labelSub="HARVARD 1-CYCLE MAC"
        />
      );
    case 'arduino-uno':
      return <ArduinoUnoAssembly />;
    case 'raspberry-pi':
      return <RaspberryPiAssembly />;
    case 'lcd-16x2':
      return <Lcd16x2Assembly />;
    case 'seven-seg':
      return <SevenSegAssembly />;
    default:
      return null;
  }
}
