import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.resolve(__dirname, '../public/models');

// Minimal FileReader polyfill for Node.js so GLTFExporter binary export works natively
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf;
          if (typeof this.onloadend === 'function') this.onloadend({ target: this });
          if (typeof this.onload === 'function') this.onload({ target: this });
        })
        .catch((err) => {
          this.error = err;
          if (typeof this.onerror === 'function') this.onerror(err);
        });
    }
    readAsDataURL(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          const b64 = Buffer.from(buf).toString('base64');
          this.result = `data:${blob.type || 'application/octet-stream'};base64,${b64}`;
          if (typeof this.onloadend === 'function') this.onloadend({ target: this });
          if (typeof this.onload === 'function') this.onload({ target: this });
        })
        .catch((err) => {
          this.error = err;
          if (typeof this.onerror === 'function') this.onerror(err);
        });
    }
  };
}

// Reusable industrial PBR material palette
function createMaterials() {
  return {
    ss316: new THREE.MeshStandardMaterial({
      name: 'AISI_316L_Stainless',
      color: 0xcbd2d9,
      metalness: 0.88,
      roughness: 0.25,
    }),
    ssDark: new THREE.MeshStandardMaterial({
      name: 'Forged_Stainless_Steel',
      color: 0x9aa3ad,
      metalness: 0.85,
      roughness: 0.34,
    }),
    inconel: new THREE.MeshStandardMaterial({
      name: 'Inconel_600',
      color: 0xa6aab0,
      metalness: 0.86,
      roughness: 0.28,
    }),
    castAluminum: new THREE.MeshStandardMaterial({
      name: 'DieCast_Aluminum_Coated',
      color: 0x4b5563,
      metalness: 0.55,
      roughness: 0.44,
    }),
    epoxyBlue: new THREE.MeshStandardMaterial({
      name: 'Industrial_Epoxy_SlateBlue',
      color: 0x2f4863,
      metalness: 0.35,
      roughness: 0.42,
    }),
    brass: new THREE.MeshStandardMaterial({
      name: 'Machined_Brass',
      color: 0xd4a84f,
      metalness: 0.88,
      roughness: 0.28,
    }),
    nickelBrass: new THREE.MeshStandardMaterial({
      name: 'Nickel_Plated_Brass',
      color: 0xbfc5cc,
      metalness: 0.9,
      roughness: 0.22,
    }),
    ceramicAlumina: new THREE.MeshStandardMaterial({
      name: 'Alumina_Ceramic_99_7',
      color: 0xf4f0e8,
      metalness: 0.02,
      roughness: 0.62,
    }),
    mgoPowder: new THREE.MeshStandardMaterial({
      name: 'MgO_Compacted_Insulation',
      color: 0xe7e3da,
      metalness: 0.0,
      roughness: 0.85,
    }),
    polymerBlack: new THREE.MeshStandardMaterial({
      name: 'Industrial_Polymer_PA6',
      color: 0x1e2126,
      metalness: 0.05,
      roughness: 0.6,
    }),
    pvcCable: new THREE.MeshStandardMaterial({
      name: 'PVC_Cable_Jacket',
      color: 0x525a63,
      metalness: 0.04,
      roughness: 0.7,
    }),
    wireRed: new THREE.MeshStandardMaterial({
      name: 'PTFE_Lead_Red',
      color: 0xc93b3b,
      metalness: 0.08,
      roughness: 0.48,
    }),
    wireWhite: new THREE.MeshStandardMaterial({
      name: 'PTFE_Lead_White',
      color: 0xededed,
      metalness: 0.06,
      roughness: 0.45,
    }),
    chromel: new THREE.MeshStandardMaterial({
      name: 'Chromel_Alloy_KP',
      color: 0xd0d6de,
      metalness: 0.9,
      roughness: 0.22,
    }),
    alumel: new THREE.MeshStandardMaterial({
      name: 'Alumel_Alloy_KN',
      color: 0xc28b67,
      metalness: 0.88,
      roughness: 0.25,
    }),
    platinum: new THREE.MeshStandardMaterial({
      name: 'High_Purity_Platinum',
      color: 0xe9edf2,
      metalness: 0.96,
      roughness: 0.16,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      name: 'Borosilicate_Glass',
      color: 0xdff0f5,
      metalness: 0.05,
      roughness: 0.08,
      transparent: true,
      opacity: 0.45,
    }),
    carbonSteel: new THREE.MeshStandardMaterial({
      name: 'Carbon_Steel_Pipe',
      color: 0x525962,
      metalness: 0.72,
      roughness: 0.48,
    }),
    yellowAccent: new THREE.MeshStandardMaterial({
      name: 'IEC_TypeK_Yellow',
      color: 0xd9a81e,
      metalness: 0.15,
      roughness: 0.48,
    }),
    gasket: new THREE.MeshStandardMaterial({
      name: 'Spiral_Wound_Graphite_Gasket',
      color: 0x30343a,
      metalness: 0.25,
      roughness: 0.75,
    }),
    lcdFace: new THREE.MeshStandardMaterial({
      name: 'Backlit_LCD_Face',
      color: 0x1a2621,
      metalness: 0.1,
      roughness: 0.35,
    }),
  };
}

function addPart(parent, name, meshOrGroup) {
  meshOrGroup.name = name;
  meshOrGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.partId = name;
    }
  });
  parent.add(meshOrGroup);
  return meshOrGroup;
}

// Helper: threaded cylindrical segment made of sharp stacked V-rings
function createThreadedBarrel(radiusMajor, radiusMinor, length, turns, mat) {
  const pts = [];
  const pitch = length / turns;
  pts.push(new THREE.Vector2(0.001, -length / 2));
  pts.push(new THREE.Vector2(radiusMinor, -length / 2));
  for (let i = 0; i < turns; i++) {
    const y0 = -length / 2 + i * pitch;
    pts.push(new THREE.Vector2(radiusMajor, y0 + pitch * 0.42));
    pts.push(new THREE.Vector2(radiusMajor, y0 + pitch * 0.56));
    pts.push(new THREE.Vector2(radiusMinor, y0 + pitch));
  }
  pts.push(new THREE.Vector2(0.001, length / 2));
  const geo = new THREE.LatheGeometry(pts, 40);
  return new THREE.Mesh(geo, mat);
}

// Helper: hollow protection tube with closed bottom dome
function createHollowTube(outerR, innerR, yTop, yBottom, mat) {
  const pts = [
    new THREE.Vector2(0, yBottom),
    new THREE.Vector2(outerR * 0.6, yBottom + 0.015),
    new THREE.Vector2(outerR * 0.94, yBottom + 0.055),
    new THREE.Vector2(outerR, yBottom + 0.1),
    new THREE.Vector2(outerR, yTop),
    new THREE.Vector2(innerR, yTop),
    new THREE.Vector2(innerR, yBottom + 0.12),
    new THREE.Vector2(0, yBottom + 0.08),
  ];
  const geo = new THREE.LatheGeometry(pts, 40);
  return new THREE.Mesh(geo, mat);
}

// =========================================================================
// 1. INDUSTRIAL RTD Pt100 ASSEMBLY (DIN Form B + Thermowell)
// =========================================================================
function buildRtdModel() {
  const m = createMaterials();
  const root = new THREE.Group();
  root.name = 'RTD_Pt100_Assembly';

  // 01. Terminal Head (DIN Form B Cast Aluminum housing + screw lid + O-ring)
  const headGroup = new THREE.Group();
  const bodyPts = [
    new THREE.Vector2(0.11, 0.84),
    new THREE.Vector2(0.16, 0.84),
    new THREE.Vector2(0.16, 0.96),
    new THREE.Vector2(0.30, 1.06),
    new THREE.Vector2(0.35, 1.18),
    new THREE.Vector2(0.36, 1.48),
    new THREE.Vector2(0.38, 1.50),
    new THREE.Vector2(0.38, 1.54),
    new THREE.Vector2(0.31, 1.54),
    new THREE.Vector2(0.31, 1.16),
    new THREE.Vector2(0.11, 1.02),
    new THREE.Vector2(0.11, 0.84),
  ];
  const headBody = new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 48), m.castAluminum);
  headGroup.add(headBody);

  // Side cable-entry boss on -X
  const entryBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.24, 24), m.castAluminum);
  entryBoss.rotation.z = Math.PI / 2;
  entryBoss.position.set(-0.37, 1.24, 0);
  headGroup.add(entryBoss);

  // Viton O-ring gasket
  const oRing = new THREE.Mesh(new THREE.TorusGeometry(0.345, 0.015, 12, 48), m.polymerBlack);
  oRing.rotation.x = Math.PI / 2;
  oRing.position.y = 1.545;
  headGroup.add(oRing);

  // Threaded domed screw lid with knurled ribs
  const lidPts = [
    new THREE.Vector2(0.31, 1.54),
    new THREE.Vector2(0.385, 1.54),
    new THREE.Vector2(0.39, 1.66),
    new THREE.Vector2(0.35, 1.72),
    new THREE.Vector2(0.22, 1.76),
    new THREE.Vector2(0.0, 1.77),
  ];
  const lid = new THREE.Mesh(new THREE.LatheGeometry(lidPts, 48), m.castAluminum);
  headGroup.add(lid);

  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.10, 0.016), m.castAluminum);
    rib.position.set(Math.cos(a) * 0.392, 1.60, Math.sin(a) * 0.392);
    rib.rotation.y = -a;
    headGroup.add(rib);
  }

  // Nameplate band on cap top
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.012, 32), m.ss316);
  badge.position.y = 1.772;
  headGroup.add(badge);
  addPart(root, 'terminal_head', headGroup);

  // 02. Cable Gland (M20x1.5 strain relief + emerging shielded cable)
  const glandGroup = new THREE.Group();
  const glandHex = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.07, 6), m.nickelBrass);
  glandHex.rotation.z = Math.PI / 2;
  glandHex.position.set(-0.52, 1.24, 0);
  glandGroup.add(glandHex);

  const glandBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.12, 24), m.nickelBrass);
  glandBarrel.rotation.z = Math.PI / 2;
  glandBarrel.position.set(-0.60, 1.24, 0);
  glandGroup.add(glandBarrel);

  const domeNut = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.115, 0.13, 18), m.polymerBlack);
  domeNut.rotation.z = Math.PI / 2;
  domeNut.position.set(-0.71, 1.24, 0);
  glandGroup.add(domeNut);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.77, 1.24, 0),
    new THREE.Vector3(-0.98, 1.22, 0.04),
    new THREE.Vector3(-1.14, 1.10, 0.08),
    new THREE.Vector3(-1.22, 0.90, 0.10),
  ]);
  const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 24, 0.042, 16, false), m.pvcCable);
  glandGroup.add(cableMesh);
  addPart(root, 'cable_gland', glandGroup);

  // 03. Ceramic Terminal Block + 4 Brass Binding Screws + Spring Mounts
  const blockGroup = new THREE.Group();
  const blockBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.11, 32), m.ceramicAlumina);
  blockBase.position.y = 1.28;
  blockGroup.add(blockBase);

  // Center insulating barrier cross
  const barrier1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.03), m.ceramicAlumina);
  barrier1.position.y = 1.36;
  blockGroup.add(barrier1);

  const barrier2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.42), m.ceramicAlumina);
  barrier2.position.y = 1.36;
  blockGroup.add(barrier2);

  // 4 Brass terminal plates + binding screws (IEC 60751 4-wire)
  const termOffsets = [
    [-0.10, -0.10, m.wireRed],
    [0.10, -0.10, m.wireRed],
    [-0.10, 0.10, m.wireWhite],
    [0.10, 0.10, m.wireWhite],
  ];
  for (const [tx, tz, collarMat] of termOffsets) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.09), m.brass);
    pad.position.set(tx, 1.345, tz);
    blockGroup.add(pad);

    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.04, 16), m.brass);
    screw.position.set(tx, 1.375, tz);
    blockGroup.add(screw);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12), collarMat);
    ferrule.position.set(tx, 1.21, tz);
    blockGroup.add(ferrule);
  }

  // Dual mounting posts with springs
  for (const sx of [-0.17, 0.17]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.26, 12), m.ss316);
    post.position.set(sx, 1.21, 0);
    blockGroup.add(post);
  }
  addPart(root, 'terminal_block', blockGroup);

  // 04. Process Connection (1/2" NPT Hex Nut + Threaded Nipple)
  const procGroup = new THREE.Group();
  const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 6), m.ss316);
  hexNut.position.y = 0.65;
  procGroup.add(hexNut);

  const upperCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.16, 32), m.ss316);
  upperCollar.position.y = 0.78;
  procGroup.add(upperCollar);

  const nptThreads = createThreadedBarrel(0.158, 0.132, 0.24, 8, m.ssDark);
  nptThreads.position.y = 0.46;
  procGroup.add(nptThreads);
  addPart(root, 'process_connection', procGroup);

  // 05. Protective Sheath (Hollow 316L tube + inner compacted MgO liner)
  const sheathGroup = new THREE.Group();
  const sheathTube = createHollowTube(0.095, 0.072, 0.34, -1.52, m.ss316);
  sheathGroup.add(sheathTube);

  // Laser-etched band ring near top of sheath
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.097, 0.097, 0.06, 32), m.ssDark);
  band.position.y = 0.24;
  sheathGroup.add(band);
  addPart(root, 'protective_sheath', sheathGroup);

  // 06. Drilled Bar-Stock Flanged Thermowell (ANSI B16.5 outer isolation sleeve)
  const twGroup = new THREE.Group();
  const flangeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.11, 48), m.ssDark);
  flangeDisc.position.y = 0.20;
  twGroup.add(flangeDisc);

  const raisedFace = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.025, 40), m.ss316);
  raisedFace.position.y = 0.265;
  twGroup.add(raisedFace);

  // 4 Bolt bosses on flange perimeter
  for (let b = 0; b < 4; b++) {
    const ba = (b / 4) * Math.PI * 2 + Math.PI / 4;
    const boltHead = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.06, 6), m.ss316);
    boltHead.position.set(Math.cos(ba) * 0.32, 0.27, Math.sin(ba) * 0.32);
    twGroup.add(boltHead);
  }

  // Tapered thermowell outer stem (hollow so sheath fits cleanly inside!)
  const twPts = [
    new THREE.Vector2(0.0, -1.66),
    new THREE.Vector2(0.09, -1.64),
    new THREE.Vector2(0.115, -1.56),
    new THREE.Vector2(0.155, 0.15),
    new THREE.Vector2(0.11, 0.15),
    new THREE.Vector2(0.105, -1.52),
    new THREE.Vector2(0.0, -1.55),
  ];
  const twStem = new THREE.Mesh(new THREE.LatheGeometry(twPts, 40), m.ssDark);
  twGroup.add(twStem);
  addPart(root, 'thermowell', twGroup);

  // 07. Multi-Bore Alumina Ceramic Insulator Segments (inside sheath)
  const insGroup = new THREE.Group();
  for (let s = 0; s < 5; s++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.27, 24), m.ceramicAlumina);
    seg.position.y = 0.18 - s * 0.30;
    insGroup.add(seg);
  }
  addPart(root, 'ceramic_insulator', insGroup);

  // 08. 4-Wire Internal Connecting Leads (2 Red + 2 White IEC 60751)
  const leadsGroup = new THREE.Group();
  const leadCoords = [
    { x: -0.028, z: -0.028, tx: -0.10, tz: -0.10, mat: m.wireRed },
    { x: 0.028, z: -0.028, tx: 0.10, tz: -0.10, mat: m.wireRed },
    { x: -0.028, z: 0.028, tx: -0.10, tz: 0.10, mat: m.wireWhite },
    { x: 0.028, z: 0.028, tx: 0.10, tz: 0.10, mat: m.wireWhite },
  ];
  for (const lc of leadCoords) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(lc.x, -1.24, lc.z),
      new THREE.Vector3(lc.x, 0.35, lc.z),
      new THREE.Vector3(lc.x * 1.4, 0.92, lc.z * 1.4),
      new THREE.Vector3(lc.tx, 1.24, lc.tz),
    ]);
    const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.011, 10, false), lc.mat);
    leadsGroup.add(wire);
  }
  addPart(root, 'internal_leads', leadsGroup);

  // 09. Pt100 Sensing Element (Alumina substrate + serpentine platinum grid + glass glaze)
  const elemGroup = new THREE.Group();
  const substrate = new THREE.Mesh(new THREE.BoxGeometry(0.066, 0.21, 0.022), m.ceramicAlumina);
  substrate.position.y = -1.35;
  elemGroup.add(substrate);

  // Fine platinum meandering serpentine loops on both faces
  for (let row = 0; row < 7; row++) {
    const py = -1.42 + row * 0.022;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.008, 0.028), m.platinum);
    bar.position.y = py;
    elemGroup.add(bar);
  }

  // Borosilicate protective glaze capsule
  const glaze = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.23, 24), m.glass);
  glaze.position.y = -1.35;
  elemGroup.add(glaze);

  // Lead-out weld pins
  for (const px of [-0.022, 0.022]) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8), m.platinum);
    pin.position.set(px, -1.22, 0);
    elemGroup.add(pin);
  }
  addPart(root, 'sensing_element', elemGroup);

  return root;
}

// =========================================================================
// 2. TYPE-K THERMOCOUPLE ASSEMBLY (Mineral Insulated + Polarized Head)
// =========================================================================
function buildThermocoupleModel() {
  const m = createMaterials();
  const root = new THREE.Group();
  root.name = 'Thermocouple_Type_K_Assembly';

  // 01. K-Type Head with IEC Yellow Identification Band
  const headGroup = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.42, 36), m.castAluminum);
  body.position.y = 1.24;
  headGroup.add(body);
  const yellowCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.07, 36), m.yellowAccent);
  yellowCollar.position.y = 1.46;
  headGroup.add(yellowCollar);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.14, 36), m.castAluminum);
  lid.position.y = 1.56;
  headGroup.add(lid);
  addPart(root, 'tc_terminal_head', headGroup);

  // 02. Polarized Chromel(+)/Alumel(-) Ceramic Terminal Block
  const blkGroup = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.22), m.ceramicAlumina);
  block.position.y = 1.24;
  blkGroup.add(block);
  const posTerm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.14), m.chromel);
  posTerm.position.set(-0.08, 1.32, 0);
  blkGroup.add(posTerm);
  const negTerm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.14), m.alumel);
  negTerm.position.set(0.08, 1.32, 0);
  blkGroup.add(negTerm);
  addPart(root, 'tc_terminal_block', blkGroup);

  // 03. Spring-Loaded Adjustable Compression Fitting
  const compGroup = new THREE.Group();
  const hex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 6), m.ss316);
  hex1.position.y = 0.68;
  compGroup.add(hex1);
  const hex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.10, 6), m.brass);
  hex2.position.y = 0.84;
  compGroup.add(hex2);
  const threads = createThreadedBarrel(0.15, 0.125, 0.22, 7, m.ssDark);
  threads.position.y = 0.50;
  compGroup.add(threads);
  addPart(root, 'tc_compression_fitting', compGroup);

  // 04. Compensating Cable Gland & Yellow Extension Cable
  const cableGroup = new THREE.Group();
  const gland = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.11, 0.18, 6), m.brass);
  gland.rotation.z = Math.PI / 2;
  gland.position.set(-0.40, 1.22, 0);
  cableGroup.add(gland);
  const extCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.48, 1.22, 0),
    new THREE.Vector3(-0.78, 1.18, 0.05),
    new THREE.Vector3(-0.98, 0.96, 0.08),
  ]);
  cableGroup.add(new THREE.Mesh(new THREE.TubeGeometry(extCurve, 20, 0.036, 14, false), m.yellowAccent));
  addPart(root, 'tc_cable_entry', cableGroup);

  // 05. Inconel 600 Hollow Sheath
  const sheathGroup = new THREE.Group();
  sheathGroup.add(createHollowTube(0.088, 0.065, 0.40, -1.55, m.inconel));
  addPart(root, 'tc_inconel_sheath', sheathGroup);

  // 06. Twin-Bore Porcelain Fish-Spine Beads
  const beadsGroup = new THREE.Group();
  for (let i = 0; i < 11; i++) {
    const bead = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.145, 20), m.ceramicAlumina);
    bead.position.y = 0.25 - i * 0.158;
    beadsGroup.add(bead);
  }
  addPart(root, 'tc_mgo_beads', beadsGroup);

  // 07. Dissimilar Thermoelements (Chromel + Alumel)
  const wiresGroup = new THREE.Group();
  const kpCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.42, 0),
    new THREE.Vector3(-0.024, -1.25, 0),
    new THREE.Vector3(-0.024, 0.70, 0),
    new THREE.Vector3(-0.08, 1.24, 0),
  ]);
  const knCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.42, 0),
    new THREE.Vector3(0.024, -1.25, 0),
    new THREE.Vector3(0.024, 0.70, 0),
    new THREE.Vector3(0.08, 1.24, 0),
  ]);
  wiresGroup.add(new THREE.Mesh(new THREE.TubeGeometry(kpCurve, 32, 0.013, 10, false), m.chromel));
  wiresGroup.add(new THREE.Mesh(new THREE.TubeGeometry(knCurve, 32, 0.013, 10, false), m.alumel));
  addPart(root, 'tc_dissimilar_wires', wiresGroup);

  // 08. TIG-Welded Measuring Hot Junction Bead
  const juncGroup = new THREE.Group();
  const weldBead = new THREE.Mesh(new THREE.SphereGeometry(0.044, 24, 24), m.platinum);
  weldBead.position.y = -1.43;
  juncGroup.add(weldBead);
  addPart(root, 'tc_hot_junction', juncGroup);

  return root;
}

// =========================================================================
// 3. SMART DIFFERENTIAL PRESSURE TRANSMITTER + 3-VALVE MANIFOLD
// =========================================================================
function buildDpTransmitterModel() {
  const m = createMaterials();
  const root = new THREE.Group();
  root.name = 'Smart_DP_Transmitter';

  // 01. Dual-Compartment Explosion-Proof Transmitter Housing
  const housingGroup = new THREE.Group();
  const mainBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.92, 36), m.epoxyBlue);
  mainBarrel.rotation.z = Math.PI / 2;
  mainBarrel.position.set(0, 0.85, 0);
  housingGroup.add(mainBarrel);

  // Vertical neck collar
  const neckCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, 0.34, 28), m.epoxyBlue);
  neckCollar.position.set(0, 0.44, 0);
  housingGroup.add(neckCollar);

  // Rear terminal compartment screw cap
  const backCap = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.40, 0.14, 32), m.castAluminum);
  backCap.rotation.z = Math.PI / 2;
  backCap.position.set(-0.50, 0.85, 0);
  housingGroup.add(backCap);

  // Front angled display bezel ring
  const frontBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.43, 0.14, 32), m.castAluminum);
  frontBezel.rotation.z = Math.PI / 2;
  frontBezel.position.set(0.50, 0.85, 0);
  housingGroup.add(frontBezel);
  addPart(root, 'dpt_housing', housingGroup);

  // 02. Digital LCD Indicator & Glass Window
  const lcdGroup = new THREE.Group();
  const lcdScreen = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 32), m.lcdFace);
  lcdScreen.rotation.z = Math.PI / 2;
  lcdScreen.position.set(0.53, 0.85, 0);
  lcdGroup.add(lcdScreen);

  const glassWin = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 32), m.glass);
  glassWin.rotation.z = Math.PI / 2;
  glassWin.position.set(0.57, 0.85, 0);
  lcdGroup.add(glassWin);
  addPart(root, 'dpt_lcd_module', lcdGroup);

  // 03. Conduit Entries & Cable Gland
  const conduitGroup = new THREE.Group();
  for (const cz of [-0.46, 0.46]) {
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.18, 20), m.epoxyBlue);
    port.rotation.x = Math.PI / 2;
    port.position.set(-0.14, 0.85, cz);
    conduitGroup.add(port);
  }
  const blindPlug = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 6), m.ss316);
  blindPlug.rotation.x = Math.PI / 2;
  blindPlug.position.set(-0.14, 0.85, -0.57);
  conduitGroup.add(blindPlug);

  const m20Gland = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.11, 0.22, 6), m.nickelBrass);
  m20Gland.rotation.x = Math.PI / 2;
  m20Gland.position.set(-0.14, 0.85, 0.62);
  conduitGroup.add(m20Gland);
  addPart(root, 'dpt_conduit_entry', conduitGroup);

  // 04. Central Welded Sensor Capsule Module
  const sensorGroup = new THREE.Group();
  const sensorCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.50, 32), m.ss316);
  sensorCyl.position.set(0, 0.02, 0);
  sensorGroup.add(sensorCyl);
  const weldNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 24), m.ss316);
  weldNeck.position.set(0, 0.30, 0);
  sensorGroup.add(weldNeck);
  addPart(root, 'dpt_sensor_module', sensorGroup);

  // 05. Dual Corrugated 316L Isolating Diaphragms
  const diaphGroup = new THREE.Group();
  for (const side of [-1, 1]) {
    const pts = [];
    for (let r = 0; r <= 12; r++) {
      const rr = (r / 12) * 0.23;
      const wave = Math.sin(r * 1.4) * 0.015;
      pts.push(new THREE.Vector2(rr, wave));
    }
    const diag = new THREE.Mesh(new THREE.LatheGeometry(pts, 36), m.ss316);
    diag.rotation.z = side * (Math.PI / 2);
    diag.position.set(side * 0.30, 0.0, 0);
    diaphGroup.add(diag);
  }
  addPart(root, 'dpt_isolating_diaphragms', diaphGroup);

  // 06. Forged Process Flanges + 4 High-Tensile Bolts + Vent Plugs
  const flangeGroup = new THREE.Group();
  for (const side of [-1, 1]) {
    const fl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.64), m.ssDark);
    fl.position.set(side * 0.42, 0.0, 0);
    flangeGroup.add(fl);
    // Drain/vent needle valve plug
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), m.ss316);
    vent.position.set(side * 0.44, 0.40, 0.16);
    flangeGroup.add(vent);
  }
  for (const by of [-0.24, 0.24]) {
    for (const bz of [-0.21, 0.21]) {
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.08, 12), m.ssDark);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(0, by, bz);
      flangeGroup.add(bolt);
      for (const nx of [-0.55, 0.55]) {
        const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.06, 6), m.ss316);
        nut.rotation.z = Math.PI / 2;
        nut.position.set(nx, by, bz);
        flangeGroup.add(nut);
      }
    }
  }
  addPart(root, 'dpt_process_flanges', flangeGroup);

  // 07. 3-Valve Stainless Manifold Block (H-Iso, Equalize, L-Iso)
  const maniGroup = new THREE.Group();
  const block = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.34, 0.44), m.ss316);
  block.position.set(0, -0.58, 0);
  maniGroup.add(block);

  const valveConfigs = [
    { x: -0.32, z: 0.34, rotY: 0 }, // High Isolate
    { x: 0.0, z: 0.34, rotY: 0 },   // Equalize
    { x: 0.32, z: 0.34, rotY: 0 },  // Low Isolate
  ];
  for (const vc of valveConfigs) {
    const bonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.22, 16), m.ssDark);
    bonnet.rotation.x = Math.PI / 2;
    bonnet.position.set(vc.x, -0.58, 0.28);
    maniGroup.add(bonnet);

    const tBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.24, 12), m.ss316);
    tBar.rotation.z = Math.PI / 2;
    tBar.position.set(vc.x, -0.58, 0.40);
    maniGroup.add(tBar);
  }
  addPart(root, 'dpt_manifold', maniGroup);

  return root;
}

// =========================================================================
// 4. CONCENTRIC SQUARE-EDGED ORIFICE PLATE & METERING RUN
// =========================================================================
function buildOrificePlateModel() {
  const m = createMaterials();
  const root = new THREE.Group();
  root.name = 'Orifice_Plate_Assembly';

  // Helper for hollow pipe cylinder along X-axis
  function makePipeSpool(xStart, xEnd, outerR, innerR, mat) {
    const pts = [
      new THREE.Vector2(innerR, xStart),
      new THREE.Vector2(outerR, xStart),
      new THREE.Vector2(outerR, xEnd),
      new THREE.Vector2(innerR, xEnd),
      new THREE.Vector2(innerR, xStart),
    ];
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), mat);
    mesh.rotation.z = -Math.PI / 2;
    return mesh;
  }

  // 01. Upstream Pipe Spool (X: -1.45 to -0.18)
  const upGroup = new THREE.Group();
  upGroup.add(makePipeSpool(-1.45, -0.16, 0.34, 0.28, m.carbonSteel));
  addPart(root, 'orf_upstream_pipe', upGroup);

  // 02. Downstream Pipe Spool (X: +0.16 to +1.45)
  const dnGroup = new THREE.Group();
  dnGroup.add(makePipeSpool(0.16, 1.45, 0.34, 0.28, m.carbonSteel));
  addPart(root, 'orf_downstream_pipe', dnGroup);

  // 03. Pair of Raised-Face Orifice Weld-Neck Flanges + 8 Stud Bolts
  const flangeGroup = new THREE.Group();
  for (const fx of [-0.15, 0.15]) {
    const disc = makePipeSpool(fx - 0.08, fx + 0.08, 0.66, 0.28, m.ssDark);
    flangeGroup.add(disc);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const by = Math.sin(a) * 0.52;
    const bz = Math.cos(a) * 0.52;
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.60, 12), m.ss316);
    stud.rotation.z = Math.PI / 2;
    stud.position.set(0, by, bz);
    flangeGroup.add(stud);
    for (const nx of [-0.25, 0.25]) {
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 6), m.ssDark);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(nx, by, bz);
      flangeGroup.add(nut);
    }
  }
  addPart(root, 'orf_flanges', flangeGroup);

  // 04. Concentric Orifice Plate (beta = 0.55) with 45° Downstream Bevel & Paddle Handle
  const plateGroup = new THREE.Group();
  const platePts = [
    new THREE.Vector2(0.154, -0.018), // sharp upstream square edge
    new THREE.Vector2(0.42, -0.018),
    new THREE.Vector2(0.42, 0.018),
    new THREE.Vector2(0.185, 0.018),  // 45° bevel downstream
    new THREE.Vector2(0.154, -0.004),
    new THREE.Vector2(0.154, -0.018),
  ];
  const plateMesh = new THREE.Mesh(new THREE.LatheGeometry(platePts, 48), m.ss316);
  plateMesh.rotation.z = -Math.PI / 2;
  plateGroup.add(plateMesh);

  // Stamped Paddle Handle rising upward
  const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.68, 0.14), m.ss316);
  paddle.position.set(0, 0.68, 0);
  plateGroup.add(paddle);
  addPart(root, 'orf_plate', plateGroup);

  // 05. Dual Spiral-Wound Gaskets
  const gasketGroup = new THREE.Group();
  for (const gx of [-0.035, 0.035]) {
    gasketGroup.add(makePipeSpool(gx - 0.01, gx + 0.01, 0.41, 0.28, m.gasket));
  }
  addPart(root, 'orf_gaskets', gasketGroup);

  // 06. Upstream (P1 High) & Downstream (P2 Low) Impulse Taps + Root Valves
  const tapsGroup = new THREE.Group();
  for (const [tx, colorMat] of [
    [-0.17, m.wireRed],
    [0.17, m.brass],
  ]) {
    const nipple = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.26, 16), m.ss316);
    nipple.position.set(tx, 0.72, 0);
    tapsGroup.add(nipple);
    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), m.ssDark);
    valveBody.position.set(tx, 0.88, 0);
    tapsGroup.add(valveBody);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.025, 16), colorMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(tx, 0.88, 0.10);
    tapsGroup.add(handle);
  }
  addPart(root, 'orf_impulse_taps', tapsGroup);

  // 07. Translucent Flow Profile (showing Vena Contracta constriction)
  const flowGroup = new THREE.Group();
  const flowPts = [
    new THREE.Vector2(0.24, -1.35),
    new THREE.Vector2(0.24, -0.25),
    new THREE.Vector2(0.135, 0.18), // Vena contracta minimum area!
    new THREE.Vector2(0.22, 0.85),
    new THREE.Vector2(0.24, 1.35),
  ];
  const flowStream = new THREE.Mesh(new THREE.LatheGeometry(flowPts, 32), m.glass);
  flowStream.rotation.z = -Math.PI / 2;
  flowGroup.add(flowStream);
  addPart(root, 'orf_flow_stream', flowGroup);

  return root;
}

async function exportGlb(group, outFile) {
  const exporter = new GLTFExporter();
  const arrayBuffer = await exporter.parseAsync(group, { binary: true });
  const outPath = path.join(MODELS_DIR, outFile);
  await fs.writeFile(outPath, Buffer.from(arrayBuffer));
  const stats = await fs.stat(outPath);
  console.log(`Generated ${outFile} (${(stats.size / 1024).toFixed(1)} KB)`);
}

async function main() {
  await fs.mkdir(MODELS_DIR, { recursive: true });
  await exportGlb(buildRtdModel(), 'rtd-pt100-assembly.glb');
  await exportGlb(buildThermocoupleModel(), 'thermocouple-type-k.glb');
  await exportGlb(buildDpTransmitterModel(), 'dp-transmitter.glb');
  await exportGlb(buildOrificePlateModel(), 'orifice-plate-assembly.glb');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

