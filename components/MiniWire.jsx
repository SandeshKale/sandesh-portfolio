'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme, PALETTES } from '@/lib/theme';

/* Small isolated wireframe previews for the milestone tracker.
   One tiny canvas each, dpr-capped, geometry matched to the era:
   lattice (BPM grids) → torus (migration loops) → sphere (coreless) → icosa (composed platform) */

function Wire({ geo, hover, active, pal }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const speed = hover ? 1.4 : 0.35;
    m.rotation.y += delta * speed;
    m.rotation.x += delta * speed * 0.45;
  });

  const color = active ? pal.wireB : pal.wireA;
  return (
    <mesh ref={ref}>
      {geo === 'lattice' && <boxGeometry args={[1.5, 1.5, 1.5, 3, 3, 3]} />}
      {geo === 'torus' && <torusKnotGeometry args={[0.85, 0.28, 64, 8, 2, 3]} />}
      {geo === 'sphere' && <sphereGeometry args={[1.15, 12, 12]} />}
      {geo === 'icosa' && <icosahedronGeometry args={[1.2, 1]} />}
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={hover ? 0.95 : 0.55}
        blending={pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MiniWire({ geo, hover, active }) {
  const { mode } = useTheme();
  const pal = PALETTES[mode];
  return (
    <div className="w-[170px] h-[170px] md:w-[200px] md:h-[200px]" aria-hidden="true">
      <Canvas key={mode} dpr={1} camera={{ position: [0, 0, 3.1], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Wire geo={geo} hover={hover} active={active} pal={pal} />
      </Canvas>
    </div>
  );
}
