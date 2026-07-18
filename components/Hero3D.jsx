'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* A sphere of "services" (points), a mesh of connections (lines),
   and messages (glowing packets) forever in flight between them.
   The whole structure breathes, follows the pointer, and recedes on scroll. */

const COUNT = 380;
const RADIUS = 2.3;
const LINK_DIST = 0.62;
const PACKETS = 14;

function fibonacciSphere(n, r) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r)
    );
  }
  return pts;
}

function Network({ progress }) {
  const group = useRef();
  const packetsRef = useRef();

  const { positions, linePositions, pairs, colors } = useMemo(() => {
    const pts = fibonacciSphere(COUNT, RADIUS);
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const amber = new THREE.Color('#F0B34C');
    const steel = new THREE.Color('#7C96C4');
    pts.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3);
      const c = Math.random() < 0.18 ? amber : steel;
      col.set([c.r, c.g, c.b], i * 3);
    });
    const prs = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (pts[i].distanceTo(pts[j]) < LINK_DIST) prs.push([i, j]);
      }
    }
    const lp = new Float32Array(prs.length * 6);
    prs.forEach(([a, b], k) => {
      lp.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], k * 6);
    });
    return { positions: pos, linePositions: lp, pairs: { pts, prs }, colors: col };
  }, []);

  const packets = useMemo(
    () =>
      Array.from({ length: PACKETS }, () => ({
        pair: Math.floor(Math.random() * pairs.prs.length),
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.35,
      })),
    [pairs]
  );

  const packetPositions = useMemo(() => new Float32Array(PACKETS * 3), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // slow rotation + pointer parallax
    g.rotation.y += delta * 0.06;
    const px = state.pointer.x || 0;
    const py = state.pointer.y || 0;
    g.rotation.x += ((py * 0.25) - g.rotation.x) * 0.04;
    g.rotation.z += ((px * -0.12) - g.rotation.z) * 0.04;

    // scroll: sphere recedes and tilts as the visitor descends
    const p = progress.current;
    state.camera.position.z = 5.4 + p * 3.2;
    state.camera.position.y = p * -0.8;
    g.rotation.x += p * 0.002;

    // packets in flight
    const { pts, prs } = pairs;
    packets.forEach((pk, i) => {
      pk.t += delta * pk.speed;
      if (pk.t >= 1) {
        pk.t = 0;
        pk.pair = Math.floor(Math.random() * prs.length);
        pk.speed = 0.15 + Math.random() * 0.35;
      }
      const [a, b] = prs[pk.pair];
      const x = pts[a].x + (pts[b].x - pts[a].x) * pk.t;
      const y = pts[a].y + (pts[b].y - pts[a].y) * pk.t;
      const z = pts[a].z + (pts[b].z - pts[a].z) * pk.t;
      packetPositions.set([x, y, z], i * 3);
    });
    if (packetsRef.current) {
      packetsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={[1.35, 0.1, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#7C96C4" transparent opacity={0.1} depthWrite={false} />
      </lineSegments>
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PACKETS} array={packetPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.09} color="#F0B34C" transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

export default function Hero3D({ progress }) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 5.4], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <Network progress={progress} />
    </Canvas>
  );
}
