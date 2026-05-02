import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export default function ResponsiveFilters({ children, sx = {}, paperSx = {}, ...props }) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: theme.vars.palette.surface.card,
        backgroundImage:
          theme.palette.mode === 'light'
            ? `linear-gradient(120deg, ${theme.vars.palette.primary.light}12 0%, ${theme.vars.palette.secondary.light}12 100%)`
            : `linear-gradient(135deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 12px 26px rgba(2,8,23,0.38)'
            : '0 10px 20px rgba(15,23,42,0.08)',
        ...(typeof paperSx === 'function' ? paperSx(theme) : paperSx)
      })}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.25}
        useFlexGap
        flexWrap={{ xs: 'nowrap', md: 'wrap' }}
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        sx={{
          width: '100%',
          minWidth: 0,
          '& > *': {
            minWidth: 0,
            maxWidth: '100%'
          },
          '& .MuiFormControl-root, & .MuiTextField-root, & .MuiAutocomplete-root': {
            width: { xs: '100%', md: 'auto' }
          },
          '& .MuiFormControl-root': {
            minWidth: { xs: 0, md: 170 },
            maxWidth: '100%',
            flexShrink: 1
          },
          '& .MuiInputBase-root, & .MuiAutocomplete-root .MuiInputBase-root': {
            minWidth: 0,
            minHeight: 46
          },
          '& .MuiInputLabel-root': {
            maxWidth: 'calc(100% - 24px)'
          },
          '& .MuiInputBase-input, & .MuiSelect-select': {
            textOverflow: 'ellipsis'
          },
          '& .MuiButton-root': {
            width: { xs: '100%', md: 'auto' },
            maxWidth: '100%',
            minHeight: 46,
            textTransform: 'none'
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
