import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
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

import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import KeyIcon from '@mui/icons-material/Key';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import UpdateIcon from '@mui/icons-material/Update';

import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';

import { formatDateTime, statusColor, statusOptions, surfaceSx, tableContainerSx } from './shared';

function UserActions({ row, canUpdateStatus, onOpenDevices, onOpenRenew, onOpenPassword, onOpenLimit, onToggleStatus }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const close = () => setAnchorEl(null);
  const run = (action) => {
    close();
    action(row);
  };

  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)} aria-label="Acciones de cuenta">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        <MenuItem onClick={() => run(onOpenDevices)}>
          <DevicesOtherIcon fontSize="small" sx={{ mr: 1 }} />
          Dispositivos
        </MenuItem>
        <MenuItem onClick={() => run(onOpenRenew)}>
          <UpdateIcon fontSize="small" sx={{ mr: 1 }} />
          Renovar licencia
        </MenuItem>
        <MenuItem onClick={() => run(onOpenPassword)}>
          <KeyIcon fontSize="small" sx={{ mr: 1 }} />
          Resetear password
        </MenuItem>
        <MenuItem onClick={() => run(onOpenLimit)}>
          <TuneIcon fontSize="small" sx={{ mr: 1 }} />
          Cambiar límite
        </MenuItem>
        <MenuItem disabled={!canUpdateStatus} onClick={() => run(onToggleStatus)}>
          {row.active ? <BlockIcon fontSize="small" sx={{ mr: 1 }} /> : <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />}
          {row.active ? 'Suspender' : 'Activar'}
        </MenuItem>
      </Menu>
    </>
  );
}

function UserCard({ row, locale, canUpdateStatus, onOpenDevices, onOpenRenew, onOpenPassword, onOpenLimit, onToggleStatus }) {
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
            <Chip size="small" color={statusColor(row.licenseStatus)} label={row.licenseStatus || '-'} />
          </Stack>
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip size="small" label={`Dispositivos ${Number(row.deviceCount || 0)} / ${Number(row.deviceLimit || 1)}`} />
            <Chip size="small" label={`Serial ${row.serialCode || '-'}`} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Vence: {formatDateTime(row.expiresAt, locale)} · Último acceso: {formatDateTime(row.lastDeviceSeenAt, locale)}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Button size="small" variant="outlined" startIcon={<DevicesOtherIcon />} onClick={() => onOpenDevices(row)}>
              Dispositivos
            </Button>
            <Button size="small" variant="outlined" startIcon={<UpdateIcon />} onClick={() => onOpenRenew(row)}>
              Renovar
            </Button>
            <Button size="small" variant="outlined" startIcon={<KeyIcon />} onClick={() => onOpenPassword(row)}>
              Password
            </Button>
            <Button size="small" variant="outlined" startIcon={<TuneIcon />} onClick={() => onOpenLimit(row)}>
              Límite
            </Button>
            <Button
              size="small"
              color={row.active ? 'warning' : 'success'}
              variant="outlined"
              disabled={!canUpdateStatus}
              onClick={() => onToggleStatus(row)}
            >
              {row.active ? 'Suspender' : 'Activar'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SmartTubePremiumUsersTab({
  rows,
  total,
  loading,
  page,
  rowsPerPage,
  search,
  status,
  resellerUsername,
  locale,
  canUpdateStatus,
  onSearchChange,
  onStatusChange,
  onResellerUsernameChange,
  onPageChange,
  onRowsPerPageChange,
  onOpenDevices,
  onOpenRenew,
  onOpenPassword,
  onOpenLimit,
  onToggleStatus
}) {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      <ResponsiveFilters>
        <TextField
          label="Buscar cuenta"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nombre o correo"
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
        />
        <TextField select label="Estado" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {statusOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Reseller"
          value={resellerUsername}
          onChange={(event) => onResellerUsernameChange(event.target.value)}
          placeholder="username reseller"
        />
      </ResponsiveFilters>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={tableContainerSx(theme)}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Reseller</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vence</TableCell>
                <TableCell>Dispositivos</TableCell>
                <TableCell>Último acceso</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.userId} hover>
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">{row.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.resellerUsername || '-'}</TableCell>
                  <TableCell>
                    <Chip size="small" color={statusColor(row.licenseStatus)} label={row.licenseStatus || '-'} />
                  </TableCell>
                  <TableCell>{formatDateTime(row.expiresAt, locale)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={Number(row.deviceCount || 0) >= Number(row.deviceLimit || 1) ? 'warning' : 'success'}
                      label={`${Number(row.deviceCount || 0)} / ${Number(row.deviceLimit || 1)}`}
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(row.lastDeviceSeenAt, locale)}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {row.serialCode || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <UserActions
                      row={row}
                      canUpdateStatus={canUpdateStatus}
                      onOpenDevices={onOpenDevices}
                      onOpenRenew={onOpenRenew}
                      onOpenPassword={onOpenPassword}
                      onOpenLimit={onOpenLimit}
                      onToggleStatus={onToggleStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay cuentas SmartTube Premium con esos filtros.</Typography>
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
          <UserCard
            key={row.userId}
            row={row}
            locale={locale}
            canUpdateStatus={canUpdateStatus}
            onOpenDevices={onOpenDevices}
            onOpenRenew={onOpenRenew}
            onOpenPassword={onOpenPassword}
            onOpenLimit={onOpenLimit}
            onToggleStatus={onToggleStatus}
          />
        ))}
        {!loading && rows.length === 0 ? (
          <Card variant="outlined" sx={(themeValue) => surfaceSx(themeValue)}>
            <CardContent>
              <Typography color="text.secondary" align="center">
                No hay cuentas SmartTube Premium con esos filtros.
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
