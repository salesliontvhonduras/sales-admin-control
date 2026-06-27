export const colors = {
  page: '#050505',
  sidebar: '#080808',
  surface: '#101010',
  surface2: '#151515',
  surface3: '#1f1f1f',
  border: 'rgba(255,255,255,0.08)',
  strongBorder: 'rgba(255,255,255,0.16)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.62)',
  dim: 'rgba(255,255,255,0.42)',
  accent: '#ff2d2d',
  accentDark: '#b91c1c',
  success: '#63d471',
  warning: '#f6c76b',
  danger: '#ff6b6b'
};

export const surfaceSx = {
  bgcolor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  boxShadow: '0 20px 70px rgba(0,0,0,0.24)'
};

export const inputSx = {
  '& .MuiInputBase-root': {
    bgcolor: colors.surface2,
    color: colors.text,
    borderRadius: '8px',
    minHeight: 48
  },
  '& .MuiInputLabel-root': { color: colors.muted },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.strongBorder },
  '& .MuiSvgIcon-root': { color: colors.muted },
  '& .MuiFormHelperText-root': { ml: 0, color: colors.dim }
};

export const mobileButtonSx = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 44,
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 900
};

export const mobileActionsSx = {
  width: '100%',
  justifyContent: { xs: 'stretch', sm: 'flex-end' },
  '& .MuiButton-root': mobileButtonSx
};

export const selectMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: colors.surface2,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      '& .MuiMenuItem-root:hover': { bgcolor: colors.surface3 }
    }
  }
};
