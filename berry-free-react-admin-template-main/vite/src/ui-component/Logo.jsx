// material-ui
import { useTheme } from '@mui/material/styles';

// project imports

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={colorScheme === ThemeMode.DARK ? logoDark : logo} alt="Berry" width="100" />
     *
     */
   <svg width="200" height="80" viewBox="0 0 360 90" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffb347"/>
      <stop offset="100%" stop-color="#ff7f00"/>
    </linearGradient>
  </defs>

  
  <circle cx="40" cy="45" r="28" fill="url(#gradA)" />
  <path d="M30 40 Q40 50 50 40" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="32" cy="35" r="3" fill="#000"/>
  <circle cx="48" cy="35" r="3" fill="#000"/>

  <text x="90" y="55" font-family="Poppins, sans-serif" font-size="36" font-weight="700" fill="#333">
    Lion <tspan fill="#ff7f00">Services</tspan>
  </text>
</svg>


  );
}
