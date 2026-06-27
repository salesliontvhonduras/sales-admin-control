import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
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

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaymentIcon from '@mui/icons-material/Payment';
import SearchIcon from '@mui/icons-material/Search';

import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';

import { formatDateTime, requestStatusColor, requestStatusOptions, surfaceSx, tableContainerSx } from './shared';

function PaymentLink({ row }) {
  return row.paymentUrl ? (
    <Link href={row.paymentUrl} target="_blank" rel="noreferrer" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
      Abrir pago <OpenInNewIcon sx={{ fontSize: 14 }} />
    </Link>
  ) : (
    <Typography variant="caption" color="text.secondary">
      Link no seleccionado
    </Typography>
  );
}

function RequestActions({ row, canWrite, canOperate, onConfirm, onReject }) {
  const disabled = row.status !== 'PENDING_PAYMENT';
  return (
    <Stack direction="row" spacing={0.75} justifyContent="flex-end" useFlexGap flexWrap="wrap">
      {canWrite ? (
        <Button size="small" startIcon={<CheckCircleIcon />} color="success" variant="outlined" disabled={disabled} onClick={() => onConfirm(row)}>
          Confirmar pago
        </Button>
      ) : null}
      {canOperate ? (
        <Button size="small" startIcon={<CancelIcon />} color="warning" variant="outlined" disabled={disabled} onClick={() => onReject(row)}>
          Rechazar
        </Button>
      ) : null}
    </Stack>
  );
}

function RequestCard({ row, locale, canWrite, canOperate, onConfirm, onReject }) {
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
            <Chip size="small" color={requestStatusColor(row.status)} label={row.status || '-'} />
          </Stack>
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip size="small" icon={<PaymentIcon />} label={row.paymentMethod || 'PENDING'} />
            <Chip size="small" label={`${Number(row.requestedDeviceLimit || 1)} dispositivo(s)`} />
            <Chip size="small" label={`${Number(row.requestedDurationDays || 30)} días`} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Solicitado: {formatDateTime(row.createdAt, locale)}
          </Typography>
          <PaymentLink row={row} />
          <RequestActions row={row} canWrite={canWrite} canOperate={canOperate} onConfirm={onConfirm} onReject={onReject} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SmartTubePremiumRequestsTab({
  rows,
  total,
  loading,
  page,
  rowsPerPage,
  search,
  status,
  locale,
  canWrite,
  canOperate,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onRowsPerPageChange,
  onConfirm,
  onReject
}) {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      <ResponsiveFilters>
        <TextField
          label="Buscar solicitud"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nombre o correo"
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
        />
        <TextField select label="Estado de solicitud" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {requestStatusOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </ResponsiveFilters>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={tableContainerSx(theme)}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Pago</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Solicitado</TableCell>
                <TableCell>Dispositivos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.requestId} hover>
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">{row.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.4}>
                      <Chip size="small" icon={<PaymentIcon />} label={row.paymentMethod || 'PENDING'} />
                      <PaymentLink row={row} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color={requestStatusColor(row.status)} label={row.status || '-'} />
                  </TableCell>
                  <TableCell>{formatDateTime(row.createdAt, locale)}</TableCell>
                  <TableCell>{Number(row.requestedDeviceLimit || 1)}</TableCell>
                  <TableCell align="right">
                    <RequestActions row={row} canWrite={canWrite} canOperate={canOperate} onConfirm={onConfirm} onReject={onReject} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay solicitudes YouTube Premium con esos filtros.</Typography>
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
          <RequestCard key={row.requestId} row={row} locale={locale} canWrite={canWrite} canOperate={canOperate} onConfirm={onConfirm} onReject={onReject} />
        ))}
        {!loading && rows.length === 0 ? (
          <Card variant="outlined" sx={(themeValue) => surfaceSx(themeValue)}>
            <CardContent>
              <Typography color="text.secondary" align="center">
                No hay solicitudes YouTube Premium con esos filtros.
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
