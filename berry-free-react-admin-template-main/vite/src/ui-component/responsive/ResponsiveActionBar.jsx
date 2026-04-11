import Stack from '@mui/material/Stack';

export default function ResponsiveActionBar({ children, spacing = 1, justifyContent = 'flex-end', sx = {}, className = '', ...props }) {
  return (
    <Stack
      className={['responsive-action-bar', className].filter(Boolean).join(' ')}
      direction="row"
      spacing={spacing}
      useFlexGap
      flexWrap="wrap"
      alignItems="center"
      justifyContent={justifyContent}
      sx={{
        width: '100%',
        minWidth: 0,
        '& > .MuiButton-root': {
          width: { xs: 'auto', sm: 'auto' },
          flex: { xs: '1 1 auto', sm: '0 0 auto' },
          minWidth: { xs: 0, sm: 96 }
        },
        '& > .MuiIconButton-root': {
          flex: '0 0 auto',
          width: 40,
          height: 40,
          alignSelf: 'center'
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Stack>
  );
}
