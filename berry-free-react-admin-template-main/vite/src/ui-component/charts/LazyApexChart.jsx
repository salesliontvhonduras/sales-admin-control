import { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ApexChart = lazy(() => import('react-apexcharts'));

function ChartFallback({ height }) {
  return (
    <Box
      sx={{
        minHeight: height || 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={26} />
    </Box>
  );
}

ChartFallback.propTypes = {
  height: PropTypes.number
};

export default function LazyApexChart({ height, ...rest }) {
  return (
    <Suspense fallback={<ChartFallback height={height} />}>
      <ApexChart {...rest} height={height} />
    </Suspense>
  );
}

LazyApexChart.propTypes = {
  height: PropTypes.number
};
