'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

const links = ['thesis', 'trace', 'topology', 'ai', 'query', 'contact'];

export default function Nav() {
  const { scrollYProgress, scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120], ['rgba(11,14,21,0)', 'rgba(11,14,21,.72)']);
  const line = useTransform(scrollY, [0, 120], ['rgba(231,236,246,0)', 'rgba(231,236,246,.08)']);

  return (
    <motion.nav
      style={{ backgroundColor: bg, borderColor: line }}
      className="fixed top-0 inset-x-0 z-[55] flex items-center justify-between px-8 py-4 border-b backdrop-blur-md"
    >
      <a href="#hero" className="font-mono text-xs tracking-[0.08em] text-mist">
        sandesh.kale <span className="text-amber">/ sg</span>
      </a>
      <div className="hidden sm:flex gap-6 font-mono text-[11.5px] tracking-[0.05em]">
        {links.map((l) => (
          <a key={l} href={`#${l}`} className="text-mute hover:text-amber transition-colors">
            {l}
          </a>
        ))}
      </div>
      {/* scroll progress — the trace of this session */}
      <motion.div
        className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-gradient-to-r from-amber to-steel"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.nav>
  );
}
