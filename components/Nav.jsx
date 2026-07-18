'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/lib/theme';

const links = ['composition', 'sandbox', 'milestones', 'lab', 'query', 'contact'];

export default function Nav() {
  const { scrollYProgress, scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const { mode, toggle } = useTheme();

  return (
    <nav className="fixed top-0 inset-x-0 z-[55]">
      {/* theme-aware scrolled backdrop */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-ink/75 backdrop-blur-md border-b hairline"
      />
      <div className="relative flex items-center justify-between px-6 md:px-8 py-4">
        <a href="#hero" className="font-mono text-xs tracking-[0.08em] text-mist">
          sandesh.kale <span className="text-amber">/ sg</span>
        </a>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 font-mono text-[11.5px] tracking-[0.05em]">
            {links.map((l) => (
              <a key={l} href={`#${l}`} className="text-mute hover:text-amber transition-colors">
                {l}
              </a>
            ))}
          </div>
          <button
            onClick={toggle}
            data-hot
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            className="w-9 h-9 rounded-full border hairline-strong flex items-center justify-center text-mute hover:text-amber hover:border-amber/50 transition-colors"
          >
            {mode === 'dark' ? (
              /* sun */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              /* moon */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <motion.div
        className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-gradient-to-r from-amber to-steel"
        style={{ scaleX: scrollYProgress }}
      />
    </nav>
  );
}
