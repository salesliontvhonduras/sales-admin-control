// material-ui
import { alpha } from '@mui/material/styles';

/**
 * Converts a hex color string to an RGB channel string ("r g b").
 *
 * @param hex - The hex color string (e.g. "#C8FAD6", "#FFF", "#FF00FFAA").
 * @returns The RGB channel string (e.g. "200 250 214").
 * @throws {Error} If the input is not a valid hex color.
 */
export function hexToRgbChannel(hex) {
  let cleaned = hex.replace(/^#/, '');

  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleaned.length === 4) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (cleaned.length !== 6 && cleaned.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
}

export function extendPaletteWithChannels(palette) {
  const result = { ...palette };

  Object.entries(palette).forEach(([k, v]) => {
    if (typeof v === 'string' && v.startsWith('#')) {
      result[`${k}Channel`] = hexToRgbChannel(v);
    } else if (typeof v === 'object' && v !== null) {
      result[k] = extendPaletteWithChannels(v);
    }
  });

  return result;
}

export function withAlpha(color, opacity) {
  if (!color || typeof color !== 'string') return color;

  const trimmed = color.trim();

  // Case 1: CSS variable, including fallback:
  // var(--palette-divider) or var(--palette-divider, rgba(...))
  if (trimmed.startsWith('var(')) {
    const match = trimmed.match(/^var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*.+)?\)$/);
    if (!match?.[1]) return trimmed;
    return `rgba(var(${match[1]}Channel) / ${opacity})`;
  }

  // Case 2: plain CSS color values
  if (/^\s*(#|rgb\(|rgba\(|hsl\(|hsla\(|color\()/i.test(trimmed)) {
    return alpha(trimmed, opacity);
  }

  return trimmed;
}
