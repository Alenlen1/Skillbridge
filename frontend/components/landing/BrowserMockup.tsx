"use client";

import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  active: string;
  activeIndex: number;
  tabs: Tab[];
  url: string;
  ActivePanel: React.ComponentType;
  goTo: (index: number) => void;
  handleDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    },
  ) => void;
}

export default function BrowserMockup({
  active,
  activeIndex,
  tabs,
  url,
  ActivePanel,
  goTo,
  handleDragEnd,
}: Props) {
  return (
    <>
      <div className="relative">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-indigo-500/[0.06] blur-[80px]"
        />

        {/* Browser */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f1a] p-1 shadow-2xl shadow-black/40">
          {/* Browser Header */}
          <div className="mb-3 flex items-center gap-2 px-3 pt-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <div className="ml-3 flex-1 overflow-hidden rounded-md bg-white/[0.05] px-3 py-1">
              <span className="truncate text-xs text-slate-500">{url}</span>
            </div>
          </div>

          {/* Preview — no AnimatePresence, no transition */}
          <motion.div
            className="touch-pan-y cursor-grab overflow-hidden rounded-xl bg-[#0d0d18] active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -120, right: 120 }}
            dragSnapToOrigin
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            <div className="h-[420px] overflow-y-auto sm:h-[500px] lg:h-[560px]">
              <ActivePanel key={active} />
            </div>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => goTo(index)}
              aria-label={tab.label}
              className={`transition-all ${
                tab.id === active
                  ? "h-1.5 w-6 rounded-full bg-indigo-400"
                  : "h-1.5 w-1.5 rounded-full bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f]" />
    </>
  );
}
