import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - DATA GRID ||============================== //

export default function DataGrid(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiDataGrid: {
      defaultProps: {
        rowHeight: 54
      },
      styleOverrides: {
        root: {
          borderWidth: 1,
          borderColor: theme.vars.palette.divider,
          borderRadius: 14,
          backgroundColor: theme.vars.palette.surface.card,
          [theme.breakpoints.down('sm')]: {
            borderRadius: 12
          },

          '& .MuiDataGrid-columnHeader--filledGroup': {
            borderBottomWidth: 0
          },

          '& .MuiDataGrid-columnHeader--emptyGroup': {
            borderBottomWidth: 0
          },

          '& .MuiFormControl-root>.MuiInputBase-root': {
            backgroundColor: `${theme.vars.palette.surface.sunken} !important`,
            borderColor: `${theme.vars.palette.divider} !important`
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: isDark ? withAlpha(theme.vars.palette.surface.muted, 0.92) : theme.vars.palette.surface.sunken,
            borderBottom: `1px solid ${theme.vars.palette.divider}`
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: withAlpha(theme.vars.palette.primary.main, isDark ? 0.16 : 0.08)
          },
          '& .MuiDataGrid-main': {
            WebkitOverflowScrolling: 'touch'
          }
        },
        withBorderColor: {
          borderColor: theme.vars.palette.divider
        },
        toolbarContainer: {
          '& .MuiButton-root': {
            paddingLeft: '16px !important',
            paddingRight: '16px !important'
          }
        },
        columnHeader: {
          color: theme.vars.palette.text.secondary,
          paddingLeft: 24,
          paddingRight: 24,
          [theme.breakpoints.down('sm')]: {
            paddingLeft: 12,
            paddingRight: 12
          }
        },
        footerContainer: {
          '&.MuiDataGrid-withBorderColor': {
            borderBottom: 'none'
          }
        },
        columnHeaderCheckbox: {
          paddingLeft: 0,
          paddingRight: 0
        },
        cellCheckbox: {
          paddingLeft: 0,
          paddingRight: 0
        },
        cell: {
          borderWidth: 1,
          paddingLeft: 24,
          paddingRight: 24,
          borderColor: theme.vars.palette.divider,
          [theme.breakpoints.down('sm')]: {
            paddingLeft: 12,
            paddingRight: 12
          },

          '&.MuiDataGrid-cell--withRenderer > div': {
            ' > .high': {
              background: theme.vars.palette.success.light
            },
            '& > .medium': {
              background: theme.vars.palette.warning.light
            },
            '& > .low': {
              background: theme.vars.palette.error.light
            }
          }
        }
      }
    }
  };
}
