'use client';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { phaseState } from '@/lib/scrollPhase';
import { useTheme, PALETTES } from '@/lib/theme';

/* ============================================================
   The Architecture of Thought.
   One fixed, full-viewport scene behind the entire page.
   Scroll conducts it through four states:
   0 crystalline core → 1 agent constellation → 2 neural pipelines → 3 obsidian monolith
   ============================================================ */

/* smooth window: 0 outside [a,d], 1 inside [b,c], eased edges */
function window4(x, a, b, c, d) {
  const up = THREE.MathUtils.smoothstep(x, a, b);
  const down = 1 - THREE.MathUtils.smoothstep(x, c, d);
  return up * down;
}

function usePerfTier() {
  const [tier, setTier] = useState(null);
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const weak =
      (navigator.hardwareConcurrency || 8) <= 4 ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4);
    setTier(
      mobile || weak
        ? { name: 'low', dpr: [1, 1.2], nodes: 36, packets: 26, gutters: false, glass: false }
        : { name: 'high', dpr: [1, 1.75], nodes: 64, packets: 64, gutters: true, glass: true }
    );
  }, []);
  return tier;
}

/* ---------- phase-0 core: glass polyhedron + displaced wire shell ---------- */
function CrystallineCore({ glass, pal }) {
  const group = useRef();
  const shellMat = useRef();
  const innerRef = useRef();

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.1 },
      uOpacity: { value: 0.5 },
      uColA: { value: new THREE.Color(pal.wireA) },
      uColB: { value: new THREE.Color(pal.wireB) },
    }),
    []
  );

  useFrame((state, delta) => {
    const p = phaseState.current;
    const vel = phaseState.velocity;
    const g = group.current;
    if (!g) return;

    // presence: full at phase 0, gone by 1.4
    const presence = 1 - THREE.MathUtils.smoothstep(p, 0.55, 1.35);
    g.visible = presence > 0.01;
    if (!g.visible) return;

    // scroll-synced rotation: a full revolution across the first phase
    g.rotation.y = p * Math.PI * 2 + state.clock.elapsedTime * 0.08;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;

    const s = presence * (1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015);
    g.scale.setScalar(s);

    // the shell breathes; scroll velocity and the pull-apart both amplify displacement
    shellUniforms.uTime.value = state.clock.elapsedTime;
    shellUniforms.uAmp.value = 0.08 + vel * 0.45 + THREE.MathUtils.smoothstep(p, 0.2, 0.9) * 0.6;
    shellUniforms.uOpacity.value = 0.55 * presence;
    if (innerRef.current) innerRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group}>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        {glass ? (
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.65}
            roughness={0.12}
            ior={1.45}
            chromaticAberration={0.05}
            anisotropicBlur={0.2}
            color={pal.glass}
            attenuationColor={pal.attenuation}
            attenuationDistance={2.2}
          />
        ) : (
          <meshPhysicalMaterial
            color={pal.glass}
            metalness={0.15}
            roughness={0.2}
            transparent
            opacity={0.4}
            clearcoat={0.8}
          />
        )}
      </mesh>
      {/* displaced wire shell — cheap trig noise vertex shader */}
      <mesh>
        <icosahedronGeometry args={[1.35, 3]} />
        <shaderMaterial
          ref={shellMat}
          uniforms={shellUniforms}
          transparent
          wireframe
          depthWrite={false}
          blending={pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          vertexShader={`
            uniform float uTime; uniform float uAmp; varying float vN;
            void main(){
              vec3 p = position;
              float n = sin(p.x*2.3 + uTime) + sin(p.y*3.1 + uTime*1.3) + sin(p.z*4.2 + uTime*0.7);
              n *= 0.3333;
              p += normal * n * uAmp;
              vN = n * 0.5 + 0.5;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }`}
          fragmentShader={`
            uniform float uOpacity; uniform vec3 uColA; uniform vec3 uColB; varying float vN;
            void main(){
              gl_FragColor = vec4(mix(uColA, uColB, vN), uOpacity * (0.35 + vN*0.65));
            }`}
        />
      </mesh>
    </group>
  );
}

/* ---------- phase-1: the core disperses into an agent constellation ---------- */
function AgentConstellation({ count, pal }) {
  const inst = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(() => {
    const arr = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      arr.push({
        dir: new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r),
        wob: Math.random() * Math.PI * 2,
        spin: 0.3 + Math.random() * 0.8,
        size: 0.5 + Math.random() * 0.9,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const p = phaseState.current;
    const m = inst.current;
    if (!m) return;
    const presence = window4(p, 0.45, 0.95, 1.55, 2.15);
    m.visible = presence > 0.01;
    m.material.opacity = presence;
    if (!m.visible) return;

    const t = state.clock.elapsedTime;
    const radius = 0.4 + THREE.MathUtils.smoothstep(p, 0.45, 1.1) * 2.6;
    dirs.forEach((d, i) => {
      const wob = Math.sin(t * d.spin + d.wob) * 0.18;
      dummy.position.copy(d.dir).multiplyScalar(radius + wob);
      dummy.rotation.set(t * d.spin, d.wob + t * 0.4, 0);
      dummy.scale.setScalar(0.07 * d.size * (0.6 + presence * 0.4));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.rotation.y = t * 0.05 + p * 1.2;
  });

  return (
    <instancedMesh ref={inst} args={[undefined, undefined, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={pal.glass}
        emissive={pal.nodeEmissive}
        emissiveIntensity={0.35}
        metalness={0.6}
        roughness={0.25}
        transparent
        clearcoat={1}
      />
    </instancedMesh>
  );
}

/* ---------- phase-2: rolling architectural timeline wireframe ---------- */
function TimelineRibbon({ markerCount = 26, pal }) {
  const group = useRef();
  const ribbonUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uRoll: { value: 0 }, uOpacity: { value: 0 }, uColA: { value: new THREE.Color(pal.wireA) }, uColB: { value: new THREE.Color(pal.wireB) } }),
    []
  );
  const inst = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const roll = useRef(0);

  useFrame((state, delta) => {
    const p = phaseState.current;
    const presence = window4(p, 1.45, 1.95, 2.35, 2.9);
    const g = group.current;
    if (!g) return;
    g.visible = presence > 0.01;
    if (!g.visible) return;

    // the ribbon rolls at base speed, and rushes with the visitor's scroll velocity
    roll.current += delta * (0.35 + phaseState.velocity * 4.5);
    ribbonUniforms.uTime.value = state.clock.elapsedTime;
    ribbonUniforms.uRoll.value = roll.current;
    ribbonUniforms.uOpacity.value = 0.4 * presence;

    // era markers gliding along the line
    const m = inst.current;
    for (let i = 0; i < markerCount; i++) {
      const u = ((i / markerCount + roll.current * 0.06) % 1 + 1) % 1;
      const x = -7 + u * 14;
      const y = Math.sin(u * Math.PI * 4 + 1.2) * 0.35;
      dummy.position.set(x, y, 0.15);
      dummy.rotation.set(roll.current * 0.8 + i, i * 0.7, 0);
      dummy.scale.setScalar(0.055 + (i % 4 === 0 ? 0.035 : 0));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    m.material.opacity = presence;
    g.rotation.z = -0.06;
  });

  return (
    <group ref={group} position={[0, -0.4, -0.6]} rotation={[-0.9, 0, 0]}>
      {/* rolling wireframe grid — vertex-displaced plane */}
      <mesh>
        <planeGeometry args={[16, 5, 72, 12]} />
        <shaderMaterial
          uniforms={ribbonUniforms}
          transparent
          wireframe
          depthWrite={false}
          blending={pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          side={THREE.DoubleSide}
          vertexShader={`
            uniform float uTime; uniform float uRoll; varying float vH;
            void main(){
              vec3 p = position;
              float w = sin(p.x * 1.4 + uRoll * 2.0) * 0.28
                      + sin(p.y * 2.2 + uTime * 0.6) * 0.12
                      + sin((p.x + p.y) * 3.1 + uRoll * 3.0) * 0.08;
              p.z += w;
              vH = w * 1.6 + 0.5;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }`}
          fragmentShader={`
            uniform float uOpacity; uniform vec3 uColA; uniform vec3 uColB; varying float vH;
            void main(){
              gl_FragColor = vec4(mix(uColA, uColB, clamp(vH, 0.0, 1.0)), uOpacity * (0.4 + vH * 0.5));
            }`}
        />
      </mesh>
      {/* era markers rolling along the timeline */}
      <instancedMesh ref={inst} args={[undefined, undefined, markerCount]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={pal.marker} transparent blending={pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

/* ---------- phase-3: the obsidian monolith ---------- */
function Monolith({ pal }) {
  const mesh = useRef();
  useFrame((state) => {
    const p = phaseState.current;
    const presence = THREE.MathUtils.smoothstep(p, 2.25, 2.95);
    const m = mesh.current;
    if (!m) return;
    m.visible = presence > 0.01;
    if (!m.visible) return;
    m.scale.setScalar(presence);
    // subtle inertia toward the cursor
    const px = state.pointer.x || 0;
    const py = state.pointer.y || 0;
    m.rotation.y += (px * 0.45 + 0.35 - m.rotation.y) * 0.03;
    m.rotation.x += (-py * 0.25 - m.rotation.x) * 0.03;
    m.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });
  return (
    <mesh ref={mesh} visible={false}>
      <boxGeometry args={[1.15, 2.7, 0.5]} />
      <meshPhysicalMaterial
        color={pal.monolith}
        metalness={0.95}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.06}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/* ---------- gutters: floating vector clusters framing the copy ---------- */
function GutterCluster({ side, count = 34, pal }) {
  const inst = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        y: (Math.random() - 0.5) * 7,
        z: -1.5 - Math.random() * 2.5,
        xj: (Math.random() - 0.5) * 0.9,
        s: 0.03 + Math.random() * 0.05,
        r: Math.random() * Math.PI * 2,
        sp: 0.2 + Math.random() * 0.5,
      })),
    [count]
  );

  useFrame((state) => {
    const p = phaseState.current;
    const presence = window4(p, 0.35, 0.8, 2.3, 2.85);
    const m = inst.current;
    if (!m) return;
    m.visible = presence > 0.01;
    m.material.opacity = 0.75 * presence;
    if (!m.visible) return;
    const t = state.clock.elapsedTime;
    const x = side * (viewport.width / 2 - 0.9);
    const parallax = phaseState.scrollNorm * 2.2; // gutters drift upstream as you descend
    seeds.forEach((s, i) => {
      dummy.position.set(
        x + s.xj + Math.sin(t * s.sp + s.r) * 0.12,
        ((s.y + parallax * (0.5 + (i % 3) * 0.35)) % 8) - 4,
        s.z
      );
      dummy.rotation.set(t * s.sp, s.r + t * 0.3, 0);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={inst} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={pal.wireA} emissive={pal.wireA} emissiveIntensity={pal.additive ? 0.25 : 0.05} transparent metalness={0.5} roughness={0.4} />
    </instancedMesh>
  );
}

/* ---------- camera rig + phase damping ---------- */
function Rig() {
  useFrame((state, delta) => {
    // damp phase toward target; decay velocity
    phaseState.current = THREE.MathUtils.damp(phaseState.current, phaseState.target, 3.2, delta);
    phaseState.velocity = THREE.MathUtils.damp(phaseState.velocity, 0, 2.5, delta);
    // gentle pointer parallax on the camera
    const px = state.pointer.x || 0;
    const py = state.pointer.y || 0;
    state.camera.position.x += (px * 0.35 - state.camera.position.x) * 0.04;
    state.camera.position.y += (py * 0.22 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function GlobalScene() {
  const tier = usePerfTier();
  const { mode } = useTheme();
  const pal = PALETTES[mode];
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  if (!tier || reduced) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas key={mode} dpr={tier.dpr} camera={{ position: [0, 0, 6.5], fov: 46 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={[pal.fog, 8, 15]} />
        <ambientLight intensity={pal.ambient} />
        <spotLight position={[5, 7, 6]} intensity={pal.spot} color={mode === 'dark' ? '#ffe3b0' : '#ffffff'} angle={0.5} penumbra={0.8} />
        <directionalLight position={[-6, -3, -4]} intensity={0.8} color={pal.wireA} />
        <pointLight position={[0, 0, -6]} intensity={0.7} color={pal.wireA} />
        <Rig />
        <CrystallineCore glass={tier.glass} pal={pal} />
        <AgentConstellation count={tier.nodes} pal={pal} />
        <TimelineRibbon markerCount={tier.packets > 40 ? 30 : 18} pal={pal} />
        <Monolith pal={pal} />
        {tier.gutters && (
          <>
            <GutterCluster side={-1} pal={pal} />
            <GutterCluster side={1} pal={pal} />
          </>
        )}
      </Canvas>
    </div>
  );
}
