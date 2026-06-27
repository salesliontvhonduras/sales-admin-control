import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function AccountActionsGrid({ row, active, onDelete, onDeviceLimit, onRenew, onResetPassword, onToggleStatus }) {
  const actions = [
    {
      key: 'renew',
      label: 'Renovar',
      icon: <RefreshRoundedIcon />,
      variant: 'contained',
      onClick: () => onRenew(row)
    },
    {
      key: 'password',
      label: 'Password',
      icon: <KeyRoundedIcon />,
      variant: 'outlined',
      onClick: () => onResetPassword(row)
    },
    {
      key: 'devices',
      label: 'Dispositivos',
      icon: <DevicesRoundedIcon />,
      variant: 'outlined',
      onClick: () => onDeviceLimit(row)
    },
    {
      key: 'status',
      label: active ? 'Suspender' : 'Activar',
      icon: <PowerSettingsNewRoundedIcon />,
      variant: 'outlined',
      color: active ? 'warning' : 'success',
      onClick: () => onToggleStatus(row)
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <DeleteRoundedIcon />,
      variant: 'outlined',
      color: 'error',
      onClick: () => onDelete(row),
      fullMobile: true
    }
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))'
        },
        gap: 1,
        '& .MuiButton-root': {
          minWidth: 0,
          minHeight: 46,
          px: 1,
          borderRadius: '8px',
          fontWeight: 900,
          textTransform: 'none',
          justifyContent: 'center',
          whiteSpace: 'nowrap'
        },
        '& .MuiButton-startIcon': {
          mr: 0.75,
          ml: 0,
          '& .MuiSvgIcon-root': {
            fontSize: 18
          }
        }
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.key}
          size="small"
          variant={action.variant}
          color={action.color}
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ gridColumn: action.fullMobile ? { xs: '1 / -1', sm: 'auto' } : undefined }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
