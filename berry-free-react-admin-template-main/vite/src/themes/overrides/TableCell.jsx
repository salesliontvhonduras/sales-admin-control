// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 12
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
            background: theme.vars.palette.grey[50],
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
            backgroundColor: 'rgba(15, 23, 42, 0.015)'
          },
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.06)'
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
            color: theme.vars.palette.grey[900],
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
