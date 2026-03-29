import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 14,
          backgroundColor: theme.vars.palette.surface.card
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: isDark ? withAlpha(theme.vars.palette.surface.muted, 0.92) : theme.vars.palette.surface.sunken,
            position: 'sticky',
            top: 0,
            zIndex: 1
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 150ms ease',
          '&:nth-of-type(even)': {
            backgroundColor: isDark ? withAlpha(theme.vars.palette.grey[200], 0.18) : withAlpha(theme.vars.palette.grey[100], 0.5)
          },
          '&:hover': {
            backgroundColor: withAlpha(theme.vars.palette.primary.main, isDark ? 0.14 : 0.08)
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 12,
          borderColor: theme.vars.palette.grey[200],

          '&.MuiTableCell-head': {
            fontSize: '0.875rem',
            color: theme.vars.palette.text.primary,
            fontWeight: 700
          },
          '&.MuiTableCell-body': {
            fontSize: '0.84rem'
          }
        }
      }
    }
  };
}
