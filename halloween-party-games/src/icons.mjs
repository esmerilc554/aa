// Simple line icons for picture bingo, drawn on a 48x48 grid.
// O = orange accent fill, P = purple accent fill; strokes use currentColor.
const O = 'var(--orange-soft)';
const P = 'var(--purple-soft)';

export const ICONS = {
  Pumpkin: `<path d="M24 14c-10 0-17 6-17 15s7 13 17 13 17-4 17-13-7-15-17-15z" fill="${O}"/><path d="M24 14c-5 4-6 22 0 28M24 14c5 4 6 22 0 28"/><path d="M24 14V8c2-2 5-2 7-1"/>`,
  Ghost: `<path d="M12 42V22a12 12 0 0 1 24 0v20l-4-3-4 3-4-3-4 3-4-3z" fill="#fff"/><circle cx="20" cy="22" r="2" fill="currentColor"/><circle cx="28" cy="22" r="2" fill="currentColor"/><path d="M21 29q3 3 6 0"/>`,
  Bat: `<path d="M24 20c-2-3-6-4-9-2-3-3-7-3-11 0 3 2 4 6 3 9 3-1 6 0 8 3 2-3 5-4 9-4 4 0 7 1 9 4 2-3 5-4 8-3-1-3 0-7 3-9-4-3-8-3-11 0-3-2-7-1-9 2z" fill="${P}"/><path d="M22 18l-1-4 3 2 3-2-1 4"/>`,
  Spider: `<circle cx="24" cy="28" r="7" fill="${P}"/><circle cx="24" cy="18" r="4" fill="${P}"/><path d="M17 25l-8-5-3 4M17 29H7l-2 4M17 32l-7 5-1 5M31 25l8-5 3 4M31 29h10l2 4M31 32l7 5 1 5M24 14V5"/>`,
  'Witch Hat': `<path d="M8 38h32" stroke-width="4"/><path d="M14 37L22 8c4 2 6 6 6 10l6 19z" fill="${P}"/><path d="M15.5 31h17" stroke="var(--orange)" stroke-width="3"/>`,
  Cauldron: `<path d="M9 20h30" stroke-width="3.5"/><path d="M11 21c-2 12 4 19 13 19s15-7 13-19z" fill="${P}"/><path d="M14 41l-2 3M34 41l2 3"/><circle cx="20" cy="14" r="3" fill="var(--green-soft)"/><circle cx="28" cy="10" r="2.5" fill="var(--green-soft)"/>`,
  Broom: `<path d="M38 6L22 26"/><path d="M22 26l-12 6c-2 4-1 8 2 10l6-2 10-10z" fill="${O}"/><path d="M14 36l6-6M17 39l7-7"/>`,
  Candy: `<ellipse cx="24" cy="24" rx="9" ry="7" fill="${O}"/><path d="M15 24l-9-6v12zM33 24l9-6v12z" fill="${P}"/><path d="M21 18l-3 12M28 18l-3 12"/>`,
  Skull: `<path d="M24 7c-9 0-15 6-15 14 0 5 3 8 6 10v6h18v-6c3-2 6-5 6-10 0-8-6-14-15-14z" fill="#fff"/><circle cx="18" cy="22" r="3.5" fill="currentColor"/><circle cx="30" cy="22" r="3.5" fill="currentColor"/><path d="M24 27l-2 3h4zM20 37v-4M24 37v-4M28 37v-4"/>`,
  Moon: `<path d="M30 6a18 18 0 1 0 12 26A15 15 0 0 1 30 6z" fill="var(--yellow-soft)"/>`,
  Owl: `<path d="M12 12l6 4h12l6-4v18c0 8-5 12-12 12s-12-4-12-12z" fill="${O}"/><circle cx="19" cy="22" r="4.5" fill="#fff"/><circle cx="29" cy="22" r="4.5" fill="#fff"/><circle cx="19" cy="22" r="1.5" fill="currentColor"/><circle cx="29" cy="22" r="1.5" fill="currentColor"/><path d="M24 26l-2 3h4z"/>`,
  'Black Cat': `<path d="M10 40V18l4-10 6 7h8l6-7 4 10v22z" fill="#2b2233"/><path d="M17 26l4 2M31 26l-4 2" stroke="var(--yellow)" stroke-width="3"/><path d="M22 33l2 2 2-2M6 31h8M6 35h8M34 31h8M34 35h8"/>`,
  'Haunted House': `<path d="M8 42V22L24 9l16 13v20z" fill="${P}"/><path d="M4 24L24 7l20 17"/><path d="M20 42V32h8v10" fill="#fff"/><rect x="13" y="24" width="6" height="5" fill="var(--yellow-soft)"/><rect x="29" y="24" width="6" height="5" fill="var(--yellow-soft)"/>`,
  Candle: `<rect x="17" y="20" width="14" height="22" rx="2" fill="#fff"/><path d="M24 20v-3"/><path d="M24 6c-3 4-4 7 0 10 4-3 3-6 0-10z" fill="${O}"/><path d="M17 26c3 2 4 0 6 3"/>`,
  Potion: `<path d="M20 6h8M21 6v10L11 34c-2 5 1 9 6 9h14c5 0 8-4 6-9L27 16V6" fill="none"/><path d="M14 30h20l3 5c1 4-1 7-6 7H17c-5 0-7-3-6-7z" fill="var(--green-soft)"/><circle cx="21" cy="35" r="1.5" fill="currentColor"/><circle cx="27" cy="33" r="1" fill="currentColor"/>`,
  Tombstone: `<path d="M12 42V18a12 12 0 0 1 24 0v24z" fill="#ddd6e3"/><path d="M6 42h36"/><path d="M19 21h10M19 27h10M24 15v18" stroke-width="2"/>`,
  'Spider Web': `<path d="M24 4v40M4 24h40M10 10l28 28M38 10L10 38"/><path d="M24 12l8 4 4 8-4 8-8 4-8-4-4-8 4-8zM24 18l4 2 2 4-2 4-4 2-4-2-2-4 2-4z"/>`,
  Lantern: `<path d="M20 8h8M18 12h12M24 4v4"/><path d="M16 14h16l2 22H14z" fill="var(--yellow-soft)"/><path d="M12 38h24v4H12z" fill="${P}"/><path d="M24 20c-2 3-2 6 0 8 2-2 2-5 0-8z" fill="${O}"/>`,
  Mask: `<path d="M5 20c6-4 13-4 19 0 6-4 13-4 19 0 0 8-4 13-10 13-4 0-7-3-9-6-2 3-5 6-9 6-6 0-10-5-10-13z" fill="${P}"/><ellipse cx="15" cy="23" rx="4" ry="3" fill="#fff"/><ellipse cx="33" cy="23" rx="4" ry="3" fill="#fff"/><path d="M43 20l3-6"/>`,
  'Candy Corn': `<path d="M24 5L10 41c9 3 19 3 28 0z" fill="#fff"/><path d="M15 28c6 2 12 2 18 0l5 13c-9 3-19 3-28 0z" fill="var(--yellow-soft)"/><path d="M18.5 19c4 1.5 7 1.5 11 0l3.5 9c-6 2-12 2-18 0z" fill="${O}"/>`,
  Eyeball: `<circle cx="24" cy="24" r="17" fill="#fff"/><circle cx="24" cy="24" r="8" fill="var(--green-soft)"/><circle cx="24" cy="24" r="3.5" fill="currentColor"/><path d="M9 16l5 3M11 32l5-2M38 14l-4 4M39 31l-5-1" stroke="var(--red)" stroke-width="1.5"/>`,
  Bones: `<path d="M12 12l24 24M36 12L12 36" stroke-width="5"/><circle cx="10" cy="10" r="3" fill="#fff"/><circle cx="14" cy="8" r="3" fill="#fff"/><circle cx="38" cy="10" r="3" fill="#fff"/><circle cx="34" cy="8" r="3" fill="#fff"/><circle cx="10" cy="38" r="3" fill="#fff"/><circle cx="14" cy="40" r="3" fill="#fff"/><circle cx="38" cy="38" r="3" fill="#fff"/><circle cx="34" cy="40" r="3" fill="#fff"/>`,
  Coffin: `<path d="M18 4h12l7 12-5 28H16l-5-28z" fill="${P}"/><path d="M24 14v16M18 20h12" stroke="#fff" stroke-width="3"/>`,
  Apple: `<path d="M24 14c-4-3-14-3-15 8-1 10 6 20 11 20 2 0 3-1 4-1s2 1 4 1c5 0 12-10 11-20-1-11-11-11-15-8z" fill="var(--red-soft)"/><path d="M24 14c0-4 1-7 4-9"/><path d="M26 10c3-3 7-3 9-1-3 3-6 3-9 1z" fill="var(--green-soft)"/>`,
  Star: `<path d="M24 5l5.5 12 13 1.5-9.7 8.8 2.7 12.9L24 33.6l-11.5 6.6 2.7-12.9-9.7-8.8 13-1.5z" fill="var(--yellow-soft)"/>`,
  Leaf: `<path d="M24 42V30M24 30l-12 4 3-7-9-4 6-3-3-7 8 2 3-6 4 6 4-6 3 6 8-2-3 7 6 3-9 4 3 7z" fill="${O}"/><path d="M24 30V14"/>`,
  Mummy: `<path d="M12 42V20a12 12 0 0 1 24 0v22z" fill="#f2ede3"/><path d="M12 22l24-4M12 30l24-5M12 37l24-4"/><rect x="16" y="22" width="16" height="6" rx="3" fill="#2b2233"/><circle cx="20" cy="25" r="1.6" fill="#fff"/><circle cx="28" cy="25" r="1.6" fill="#fff"/>`,
  Lollipop: `<circle cx="24" cy="18" r="12" fill="${O}"/><path d="M24 18c0-4 5-4 5 0s-8 6-9 0 6-11 12-7" /><path d="M24 30v14" stroke-width="3"/>`,
  'Candy Bucket': `<path d="M10 18h28l-3 24H13z" fill="${O}"/><path d="M10 18c0-10 28-10 28 0"/><path d="M18 26l3 3 3-3M26 26l3 3 3-3M19 35q5 4 10 0"/>`,
  'Crystal Ball': `<circle cx="24" cy="21" r="14" fill="var(--purple-soft)"/><path d="M14 38h20l2 5H12z" fill="${O}"/><path d="M18 14c2-3 5-4 8-4" stroke="#fff" stroke-width="3"/>`,
};

export function icon(name, size = 48) {
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}
