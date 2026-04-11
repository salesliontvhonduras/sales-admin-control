import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export default function ResponsiveFilters({ children, sx = {}, paperSx = {}, ...props }) {
  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        ...paperSx
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.25}
        useFlexGap
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{
          width: '100%',
          '& .MuiFormControl-root, & .MuiTextField-root': {
            width: { xs: '100%', md: 'auto' }
          },
          ...sx
        }}
        {...props}
      >
        {children}
      </Stack>
    </Paper>
  );
}
