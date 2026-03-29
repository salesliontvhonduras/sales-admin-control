// project imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| DEFAULT THEME - CUSTOM SHADOWS ||============================== //

function createCustomShadow(palette, baseColor) {
  const commonShadow = (color) => `0 12px 24px ${withAlpha(color, 0.24)}`;

  return {
    z1: `0 2px 6px ${withAlpha(baseColor, 0.08)}`,
    z8: `0 10px 24px ${withAlpha(baseColor, 0.14)}`,
    z12: `0 14px 30px ${withAlpha(baseColor, 0.16)}`,
    z16: `0 18px 36px ${withAlpha(baseColor, 0.18)}`,
    z20: `0 22px 42px ${withAlpha(baseColor, 0.2)}`,
    z24: `0 26px 52px ${withAlpha(baseColor, 0.22)}`,

    primary: commonShadow(palette.primary.main),
    secondary: commonShadow(palette.secondary.main),
    orange: commonShadow(palette.orange.main),
    success: commonShadow(palette.success.main),
    warning: commonShadow(palette.warning.main),
    error: commonShadow(palette.error.main)
  };
}

export default function CustomShadows(palette, mode) {
  const baseColor = mode === 'dark' ? '#020817' : '#0f172a';
  return createCustomShadow(palette, baseColor);
}
