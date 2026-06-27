import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import EmptyState from './components/EmptyState';
import SessionCard from './components/SessionCard';
import { rowsOf } from './constants';
import { colors, inputSx, selectMenuProps, surfaceSx } from './styles';

export default function SessionsView({ filters, loading, onDisconnect, onFilterChange, sessions }) {
  const rows = rowsOf(sessions);

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...surfaceSx, p: 2 }}>
        <Typography variant="h2" sx={{ color: colors.text }}>
          Sesiones
        </Typography>
        <Typography sx={{ color: colors.muted }}>Clientes conectados y sesiones revocadas de tus cuentas Premium.</Typography>
      </Paper>

      <Paper sx={{ ...surfaceSx, p: 1.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
          <TextField
            value={filters.search}
            onChange={(event) => onFilterChange({ ...filters, search: event.target.value })}
            placeholder="Buscar cuenta, correo o dispositivo"
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
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="ACTIVE">Online ahora</MenuItem>
            <MenuItem value="REVOKED">Desconectadas</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {rows.length ? (
        <Stack spacing={1.5}>
          {rows.map((row) => (
            <SessionCard key={row.sessionId || row.id} row={row} onDisconnect={onDisconnect} />
          ))}
        </Stack>
      ) : (
        <EmptyState
          title={loading ? 'Cargando sesiones' : 'No hay sesiones con esos filtros'}
          text={loading ? 'Consultando conexiones recientes.' : 'Cuando un cliente esté online aparecerá aquí.'}
        />
      )}
    </Stack>
  );
}
