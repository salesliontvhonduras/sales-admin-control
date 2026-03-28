// ==============================|| OVERRIDES - LIST ITEM BUTTON ||============================== //

export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          paddingTop: '9px',
          paddingBottom: '9px',
          borderRadius: 10,
          transition: 'all 140ms ease',

          '&.Mui-selected': {
            color: theme.vars.palette.secondary.dark,
            backgroundColor: theme.vars.palette.secondary.light,
            boxShadow: 'inset 0 0 0 1px rgba(25, 118, 210, 0.16)',
            '&:hover': {
              backgroundColor: theme.vars.palette.secondary.light,
              transform: 'translateX(1px)'
            },
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.secondary.dark
            }
          },

          '&:hover': {
            backgroundColor: theme.vars.palette.secondary.light,
            color: theme.vars.palette.secondary.dark,
            transform: 'translateX(1px)',
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.secondary.dark
            }
          }
        }
      }
    }
  };
}
