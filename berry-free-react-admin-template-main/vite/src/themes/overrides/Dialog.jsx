import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
  return {
    MuiDialog: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
            backgroundColor: withAlpha('#020617', theme.palette.mode === 'dark' ? 0.68 : 0.4)
          },
          '& .MuiDialogContent-root': {
            minWidth: 0,
            [theme.breakpoints.down('md')]: {
              paddingLeft: 14,
              paddingRight: 14,
              '& .MuiGrid-container': {
                width: '100%',
                marginLeft: '0 !important',
                marginTop: '0 !important',
                columnGap: '0 !important',
                rowGap: theme.spacing(1.5)
              },
              '& .MuiGrid-container > .MuiGrid-item, & .MuiGrid-container > .MuiGrid-root, & .MuiGrid-container > *': {
                width: '100% !important',
                maxWidth: '100% !important',
                flexBasis: '100% !important',
                flexGrow: '0 !important',
                flexShrink: '0 !important',
                marginLeft: '0 !important',
                paddingLeft: '0 !important',
                paddingTop: `${theme.spacing(1.5)} !important`
              },
              '& .MuiFormControl-root, & .MuiTextField-root, & .MuiAutocomplete-root': {
                width: '100% !important',
                minWidth: 0
              },
              '& [class*="MuiGrid-grid-"]': {
                maxWidth: '100% !important',
                flexBasis: '100% !important'
              }
            },
            [theme.breakpoints.down('sm')]: {
              paddingLeft: 12,
              paddingRight: 12
            }
          },
          '& .MuiDialogActions-root': {
            [theme.breakpoints.down('sm')]: {
              paddingLeft: 12,
              paddingRight: 12,
              paddingBottom: 12,
              gap: 8,
              flexDirection: 'column-reverse',
              alignItems: 'stretch',
              '& > .MuiButton-root': {
                width: '100%'
              }
            }
          }
        },
        paper: {
          padding: '0',
          borderRadius: 18,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundColor: theme.vars.palette.surface.card,
          boxShadow:
            theme.palette.mode === 'dark' ? `0 30px 70px ${withAlpha('#020617', 0.62)}` : `0 24px 56px ${withAlpha('#0f172a', 0.26)}`,
          overflow: 'hidden',
          [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 12px)',
            maxWidth: 'calc(100% - 12px)',
            maxHeight: 'calc(100% - 12px)',
            margin: 6,
            borderRadius: 16
          },
          [theme.breakpoints.down('md')]: {
            maxWidth: 'calc(100vw - 24px)'
          }
        }
      }
    }
  };
}
