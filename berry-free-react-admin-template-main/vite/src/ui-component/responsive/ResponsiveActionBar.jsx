import Stack from '@mui/material/Stack';

export default function ResponsiveActionBar({ children, spacing = 1, justifyContent = 'flex-end', sx = {}, ...props }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={spacing}
      alignItems="stretch"
      justifyContent={justifyContent}
      sx={{
        width: '100%',
        '& > .MuiButton-root': {
          width: { xs: '100%', sm: 'auto' }
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}
