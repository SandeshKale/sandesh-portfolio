// Shared mutable state bridging GSAP ScrollTrigger (DOM world)
// and the R3F render loop (WebGL world). No re-renders — refs only.
//
// phase: 0 = crystalline core (hero)
//        1 = dispersed agent constellation (composition)
//        2 = neural pipelines (observability)
//        3 = obsidian monolith (contact)
export const phaseState = {
  target: 0, // set by ScrollTrigger
  current: 0, // damped by useFrame
  velocity: 0, // normalized scroll velocity, decays in the loop
  scrollNorm: 0, // 0..1 page position, for gutter parallax
};
