import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiAmazon, SiGithub, SiGoogle, SiMeta, SiTwitch } from "react-icons/si";
import { twMerge } from "tailwind-merge";

export const DivOrigami = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <LogoRolodex
        items={[
          <LogoItem key={1} className="bg-[#FDFCFB] text-neutral-500">
            <SiAmazon />
          </LogoItem>,
          <LogoItem key={2} className="bg-[#F5F2EE] text-neutral-500">
            <SiGoogle />
          </LogoItem>,
          <LogoItem key={3} className="bg-[#EAE4DD] text-neutral-500">
            <SiMeta />
          </LogoItem>,
          <LogoItem key={4} className="bg-[#DED5C9] text-neutral-500">
            <SiGithub />
          </LogoItem>,
          <LogoItem key={5} className="bg-[#F2EBE3] text-neutral-500">
            <SiTwitch />
          </LogoItem>,
        ]}
      />
    </div>
  );
};

const DELAY_IN_MS = 2500;
const TRANSITION_DURATION_IN_SECS = 1.5;

const LogoRolodex = ({ items }: { items: React.ReactNode[] }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((pv) => pv + 1);
    }, DELAY_IN_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        transform: "rotateY(-15deg) rotateX(5deg)",
        transformStyle: "preserve-3d",
      }}
      className="relative z-0 h-44 w-60 shrink-0 rounded-xl border border-black/5 bg-[#FFFCEB] shadow-lg"
    >
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/5 rounded-t-xl" />
      <AnimatePresence mode="sync">
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            zIndex: -index,
            backfaceVisibility: "hidden",
          }}
          key={index}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          initial={{ rotateX: "0deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "-180deg" }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            zIndex: index,
            backfaceVisibility: "hidden",
          }}
          key={(index + 1) * 2}
          initial={{ rotateX: "180deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "0deg" }}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
      </AnimatePresence>

      <hr
        style={{
          transform: "translateZ(1px)",
        }}
        className="absolute left-0 right-0 top-1/2 z-[999999999] -translate-y-1/2 border-t border-black/5"
      />
      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black/5 blur-sm rounded-br-xl" />
    </div>
  );
};

const LogoItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div
      className={twMerge(
        "grid h-36 w-52 place-content-center rounded-sm bg-neutral-100 text-6xl text-neutral-50 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};
