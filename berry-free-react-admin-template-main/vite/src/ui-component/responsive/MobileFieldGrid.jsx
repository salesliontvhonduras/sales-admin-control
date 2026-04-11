import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function MobileFieldGrid({ fields = [], columns = { xs: 1, sm: 2 }, sx = {} }) {
  const visibleFields = fields.filter((field) => field && field.value !== undefined && field.value !== null && field.value !== '');

  if (!visibleFields.length) return null;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, minmax(0, 1fr))`,
          sm: `repeat(${columns.sm || columns.xs || 1}, minmax(0, 1fr))`
        },
        gap: 1.25,
        ...sx
      }}
    >
      {visibleFields.map((field, index) => (
        <Stack key={`${field.label || 'field'}-${index}`} spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {field.label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: field.emphasis ? 700 : 500, wordBreak: 'break-word' }}>
            {field.value}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}
