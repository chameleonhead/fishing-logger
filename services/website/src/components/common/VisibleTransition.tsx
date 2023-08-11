import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type VisibleTransitionProps = React.PropsWithChildren<{
  visible: boolean;
}>;

export const VisibleTransition = ({
  visible,
  children,
}: VisibleTransitionProps) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="content"
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={{
          open: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default VisibleTransition;
