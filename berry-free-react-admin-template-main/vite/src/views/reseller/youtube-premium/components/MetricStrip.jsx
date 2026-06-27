import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { colors, surfaceSx } from '../styles';

export default function MetricStrip({ metrics = [], loading = false }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        gap: 1.5
      }}
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Paper key={metric.label} sx={{ ...surfaceSx, p: 2, minHeight: 118 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: colors.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                  {metric.label}
                </Typography>
                {Icon ? (
                  <Box sx={{ width: 32, height: 32, display: 'grid', placeItems: 'center', color: metric.color || colors.text }}>
                    <Icon fontSize="small" />
                  </Box>
                ) : null}
              </Stack>
              <Typography variant="h2" sx={{ color: colors.text, lineHeight: 1 }}>
                {metric.value}
              </Typography>
              {metric.helper ? <Typography sx={{ color: colors.dim, fontSize: 13 }}>{metric.helper}</Typography> : null}
              {loading ? <LinearProgress sx={{ bgcolor: colors.surface3, '& .MuiLinearProgress-bar': { bgcolor: colors.accent } }} /> : null}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}
