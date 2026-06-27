import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';

import { formatDateTime, maskDeviceHash, sessionStatusColor, sessionStatusOptions, statusColor, surfaceSx, tableContainerSx } from './shared';

function SessionActions({ row, canRevokeSession, onRevoke }) {
  const active = String(row.status || '').toUpperCase() === 'ACTIVE';
  return (
    <Button
      size="small"
      color="warning"
      variant="outlined"
      startIcon={<LogoutIcon />}
      disabled={!active || !canRevokeSession}
      onClick={() => onRevoke(row)}
    >
      Desconectar
    </Button>
  );
}

function SessionCard({ row, locale, canRevokeSession, onRevoke }) {
  return (
    <Card variant="outlined" sx={(theme) => surfaceSx(theme)}>
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" spacing={1.5}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                {row.name || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {row.email}
              </Typography>
            </Box>
            <Chip size="small" color={sessionStatusColor(row.status)} label={row.status || '-'} />
          </Stack>
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip size="small" label={row.deviceName || 'Dispositivo Android'} />
            <Chip size="small" label={maskDeviceHash(row.deviceIdHash)} />
            <Chip size="small" color={statusColor(row.licenseStatus)} label={`Licencia ${row.licenseStatus || '-'}`} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Primer acceso: {formatDateTime(row.firstSeenAt, locale)} · Último heartbeat: {formatDateTime(row.lastSeenAt, locale)}
          </Typography>
          {row.revokedAt ? (
            <Typography variant="caption" color="text.secondary">
              Desconectada: {formatDateTime(row.revokedAt, locale)} · {row.revokeReason || 'Sin motivo'}
            </Typography>
          ) : null}
          <SessionActions row={row} canRevokeSession={canRevokeSession} onRevoke={onRevoke} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SmartTubePremiumSessionsTab({
  rows,
  total,
  loading,
  page,
  rowsPerPage,
  search,
  status,
  userId,
  locale,
  canRevokeSession,
  onSearchChange,
  onStatusChange,
  onUserIdChange,
  onPageChange,
  onRowsPerPageChange,
  onRevoke
}) {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      <ResponsiveFilters>
        <TextField
          label="Buscar sesión"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cliente, correo, serial o dispositivo"
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
        />
        <TextField select label="Estado de sesión" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {sessionStatusOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Usuario ID" type="number" value={userId} onChange={(event) => onUserIdChange(event.target.value)} placeholder="Opcional" />
      </ResponsiveFilters>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={tableContainerSx(theme)}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Dispositivo</TableCell>
                <TableCell>Sesión</TableCell>
                <TableCell>Último heartbeat</TableCell>
                <TableCell>Licencia</TableCell>
                <TableCell>Revocación</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.sessionId} hover>
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">{row.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography variant="body2">{row.deviceName || 'Dispositivo Android'}</Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }} color="text.secondary">
                        {maskDeviceHash(row.deviceIdHash)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Chip size="small" color={sessionStatusColor(row.status)} label={row.status || '-'} />
                      <Typography variant="caption" color="text.secondary">
                        #{row.sessionId}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDateTime(row.lastSeenAt, locale)}</TableCell>
                  <TableCell>
                    <Stack spacing={0.4}>
                      <Chip size="small" color={statusColor(row.licenseStatus)} label={row.licenseStatus || '-'} />
                      <Typography variant="caption" color="text.secondary">
                        {row.serialCode || '-'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.revokedAt ? (
                      <Stack spacing={0.2}>
                        <Typography variant="body2">{formatDateTime(row.revokedAt, locale)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.revokeReason || '-'}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Activa
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <SessionActions row={row} canRevokeSession={canRevokeSession} onRevoke={onRevoke} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay sesiones YouTube Premium con esos filtros.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Stack spacing={1.25} sx={{ display: { xs: 'flex', md: 'none' } }}>
        {rows.map((row) => (
          <SessionCard key={row.sessionId} row={row} locale={locale} canRevokeSession={canRevokeSession} onRevoke={onRevoke} />
        ))}
        {!loading && rows.length === 0 ? (
          <Card variant="outlined" sx={(themeValue) => surfaceSx(themeValue)}>
            <CardContent>
              <Typography color="text.secondary" align="center">
                No hay sesiones YouTube Premium con esos filtros.
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Stack>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, nextPage) => onPageChange(nextPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      />
    </Stack>
  );
}
