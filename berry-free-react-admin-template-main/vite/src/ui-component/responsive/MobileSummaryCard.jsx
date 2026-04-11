import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MobileSummaryCard({ icon, title, subtitle, chips, actions, children, sx = {} }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 3,
        borderColor: 'divider',
        boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
        ...sx
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          {icon ? <Box sx={{ flexShrink: 0 }}>{icon}</Box> : null}
          <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
        {chips ? (
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            {chips}
          </Stack>
        ) : null}
        {children}
        {actions ? <Box>{actions}</Box> : null}
      </Stack>
    </Card>
  );
}
