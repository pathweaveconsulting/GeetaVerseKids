import React from 'react';
import { motion } from 'motion/react';

// Decoration artwork that is no longer assigned to any quest. Kept for
// possible reuse; nothing imports this file. Each component renders an SVG
// group in WisdomTree's 400x400 viewBox, so it can be dropped back into the
// tree's <svg> as-is (it also needs the tree's <defs> where noted).

interface RetiredArtProps {
  onClick?: () => void;
}

// Peacock-feather crown. Was the Garden Chimes artwork (quest 2).
// Render it before the canopy so the feathers fan out behind the leaves.
export function FeatherCrownArt({ onClick }: RetiredArtProps) {
  return (
    <motion.g
      id="dec-feather-group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
      className="cursor-pointer hover:brightness-110"
      onClick={onClick}
    >
      {/* Crown of Feathers backing the leaves */}
      {[...Array(5)].map((_, index) => {
        const angle = -45 + index * 22.5; // Fan out
        return (
          <g key={index} transform={`translate(200, 160) rotate(${angle}) translate(0, -110)`}>
            {/* Stem */}
            <line x1="0" y1="0" x2="0" y2="80" stroke="#047857" strokeWidth="2.5" />
            {/* Feather head */}
            <ellipse cx="0" cy="0" rx="16" ry="24" fill="#0D9488" />
            <ellipse cx="0" cy="0" rx="10" ry="16" fill="#F59E0B" />
            <circle cx="0" cy="0" r="6" fill="#0369A1" />
            <circle cx="0" cy="0" r="3" fill="#D946EF" />
          </g>
        );
      })}
    </motion.g>
  );
}

// Bookshelf built into the trunk hollow. Was the Pebble Path artwork (quest 5).
// Render it in place of the tree's plain hollow, after the trunk.
export function BookshelfArt({ onClick }: RetiredArtProps) {
  return (
    <motion.g
      id="dec-bookshelf-group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring' }}
      className="cursor-pointer"
      onClick={onClick}
    >
      {/* Tree Hollow Frame */}
      <ellipse cx="200" cy="275" rx="16" ry="24" fill="#3F2107" />
      {/* Shelf structure */}
      <rect x="187" y="272" width="26" height="3" fill="#D97706" rx="1" />
      <rect x="189" y="284" width="22" height="3" fill="#D97706" rx="1" />
      {/* Tiny stylized colorful books on the shelves! */}
      {/* Shelf 1 Books */}
      <rect x="190" y="260" width="4" height="12" fill="#F43F5E" rx="0.5" />
      <rect x="195" y="263" width="3.5" height="9" fill="#0EA5E9" rx="0.5" />
      <line x1="195" y1="265" x2="198" y2="265" stroke="white" strokeWidth="0.5" />
      <rect x="200" y="258" width="5" height="14" fill="#EAB308" rx="0.5" transform="rotate(10, 202, 265)" />
      {/* Shelf 2 Books (Scrolls) */}
      <rect x="192" y="278" width="16" height="6" fill="#FEF08A" rx="2" stroke="#B45309" strokeWidth="0.5" />
      <circle cx="194" cy="281" r="1" fill="#D97706" />
      <circle cx="206" cy="281" r="1" fill="#D97706" />
    </motion.g>
  );
}
