import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCard from './components/AccountCard';
import AccountTable from './components/AccountTable';
import EmptyState from './components/EmptyState';
import { rowsOf } from './constants';
import { colors, inputSx, mobileButtonSx, selectMenuProps, surfaceSx } from './styles';

export default function PremiumAccountsView({
  accounts,
  filters,
  loading,
  onDelete,
  onCreateAccount,
  onCreateDemo,
  onDeviceLimit,
  onFilterChange,
  onRenew,
  onResetPassword,
  onToggleAccount
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const rows = rowsOf(accounts);

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...surfaceSx, p: 2 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { lg: 'center' } }}>
          <Box>
            <Typography variant="h2" sx={{ color: colors.text }}>
              Cuentas Premium
            </Typography>
            <Typography sx={{ color: colors.muted }}>Venta y operación de cuentas YouTube Premium.</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<AccessTimeRoundedIcon />} onClick={onCreateDemo} sx={mobileButtonSx}>
              Crear demo
            </Button>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreateAccount} sx={mobileButtonSx}>
              Nueva cuenta
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ ...surfaceSx, p: 1.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
          <TextField
            value={filters.search}
            onChange={(event) => onFilterChange({ ...filters, search: event.target.value })}
            placeholder="Buscar por nombre, correo o serial"
            fullWidth
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            value={filters.status}
            onChange={(event) => onFilterChange({ ...filters, status: event.target.value })}
            sx={{ ...inputSx, minWidth: { md: 220 } }}
            SelectProps={{ MenuProps: selectMenuProps }}
          >
            <MenuItem value="">Todos los estados</MenuItem>
            <MenuItem value="ACTIVE">Activas</MenuItem>
            <MenuItem value="EXPIRED">Expiradas</MenuItem>
            <MenuItem value="SUSPENDED">Suspendidas</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {rows.length ? (
        isMobile ? (
          <Stack spacing={1.5}>
            {rows.map((row) => (
              <AccountCard
                key={row.userId || row.id || row.email}
                row={row}
                onDelete={onDelete}
                onDeviceLimit={onDeviceLimit}
                onRenew={onRenew}
                onResetPassword={onResetPassword}
                onToggleStatus={onToggleAccount}
              />
            ))}
          </Stack>
        ) : (
          <AccountTable rows={rows} onDelete={onDelete} onDeviceLimit={onDeviceLimit} onRenew={onRenew} onResetPassword={onResetPassword} onToggleStatus={onToggleAccount} />
        )
      ) : (
        <EmptyState
          title={loading ? 'Cargando cuentas' : 'No hay cuentas Premium'}
          text={loading ? 'Estamos consultando tu operación.' : 'Crea una cuenta para empezar a vender el producto.'}
          actionLabel={!loading ? 'Nueva cuenta' : undefined}
          onAction={!loading ? onCreateAccount : undefined}
        />
      )}
    </Stack>
  );
}
