import React from 'react';
import { motion } from 'framer-motion';

export function Card({
  children,
  className = '',
  variant = 'glass', // glass, solid, gradient
  padding = 'md', // sm, md, lg
  animate = true,
  onClick,
  ...props
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    glass: 'glass-panel',
    solid: 'bg-slate-900 border border-slate-800 rounded-2xl shadow-xl',
    gradient: 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-900/40 rounded-2xl shadow-2xl',
  };

  const content = (
    <div
      onClick={onClick}
      className={`${variants[variant] || variants.glass} ${paddings[padding] || paddings.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
