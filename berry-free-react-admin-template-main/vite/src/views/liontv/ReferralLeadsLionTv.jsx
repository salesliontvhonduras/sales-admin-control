import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
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
import Avatar from '@mui/material/Avatar';
import { useMediaQuery, useTheme } from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GiftRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { shopifyDemosApi } from 'utils/api';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const STATUS_OPTIONS = ['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'REWARDED', 'REJECTED'];

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function normalizeReferral(item = {}) {
  const row = {
    id: item.id ?? null,
    referrerCustomerId: item.referrerCustomerId ?? item.referrer_customer_id ?? null,
    referrerCustomerName: item.referrerCustomerName ?? item.referrer_customer_name ?? '',
    referrerContactType: (item.referrerContactType ?? item.referrer_contact_type ?? '').toUpperCase(),
    referrerContactValue: item.referrerContactValue ?? item.referrer_contact_value ?? '',
    referredName: item.referredName ?? item.referred_name ?? '',
    referredWhatsapp: item.referredWhatsapp ?? item.referred_whatsapp ?? '',
    status: (item.status ?? 'NEW').toUpperCase(),
    adminNotes: item.adminNotes ?? item.admin_notes ?? '',
    contactedAt: item.contactedAt ?? item.contacted_at ?? null,
    convertedAt: item.convertedAt ?? item.converted_at ?? null,
    rewardGrantedAt: item.rewardGrantedAt ?? item.reward_granted_at ?? null,
    sourceShop: item.sourceShop ?? item.source_shop ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };

  row.searchText = [
    row.referrerCustomerName,
    row.referrerContactValue,
    row.referredName,
    row.referredWhatsapp,
    row.status,
    row.sourceShop
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return row;
}

function statusConfig(theme, status, t) {
  const map = {
    NEW: {
      color: 'info',
      icon: <HourglassEmptyRoundedIcon fontSize="small" />,
      label: t('referrals.status.NEW')
    },
    CONTACTED: {
      color: 'primary',
      icon: <ContactPhoneOutlinedIcon fontSize="small" />,
      label: t('referrals.status.CONTACTED')
    },
    CONVERTED: {
      color: 'success',
      icon: <CheckCircleOutlineIcon fontSize="small" />,
      label: t('referrals.status.CONVERTED')
    },
    REWARDED: {
      color: 'success',
      icon: <GiftRoundedIcon fontSize="small" />,
      label: t('referrals.status.REWARDED')
    },
    REJECTED: {
      color: 'error',
      icon: <HighlightOffIcon fontSize="small" />,
      label: t('referrals.status.REJECTED')
    }
  };

  return (
    map[status] || {
      color: 'default',
      icon: <HourglassEmptyRoundedIcon fontSize="small" />,
      label: status || '-'
    }
  );
}

function StatusChip({ status }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const cfg = statusConfig(theme, status, t);

  return (
    <Chip
      size="small"
      variant="outlined"
      color={cfg.color}
      icon={cfg.icon}
      label={cfg.label}
      sx={{ fontWeight: 700 }}
    />
  );
}

function RowActions({ row, onOpen, onWhatsapp, onCopy }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={(theme) => ({
          bgcolor: theme.palette.primary.lighter,
          color: theme.palette.primary.main,
          '&:hover': { bgcolor: theme.palette.primary.light }
        })}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onOpen(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          {t('actions.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onWhatsapp(row);
          }}
        >
          <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: '#25D366' }} />
          WhatsApp
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onCopy(row.referrerContactValue);
          }}
        >
          <ContentCopyRoundedIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
          {t('actions.copy', 'Copy')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ReferralLeadsLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formState, setFormState] = useState({ status: 'NEW', adminNotes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPage(0);
  }, [searchText, statusFilter, fromDate, toDate]);

  useEffect(() => {
    let active = true;

    async function loadReferrals() {
      setLoading(true);
      try {
        const response = await shopifyDemosApi.get('/referrals');
        const list = response?.data?.data ?? response?.data ?? [];
        if (!active) return;
        setRows((Array.isArray(list) ? list : []).map(normalizeReferral));
      } catch (error) {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || error?.message || 'No se pudieron cargar los referidos.', {
          variant: 'error'
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReferrals();
    return () => {
      active = false;
    };
  }, [enqueueSnackbar, refreshKey]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;
      if (searchText && !row.searchText.includes(searchText.trim().toLowerCase())) return false;

      const createdDate = row.createdAt ? new Date(row.createdAt) : null;
      if (fromDate && createdDate) {
        const from = new Date(`${fromDate}T00:00:00`);
        if (createdDate < from) return false;
      }
      if (toDate && createdDate) {
        const to = new Date(`${toDate}T23:59:59`);
        if (createdDate > to) return false;
      }

      return true;
    });
  }, [rows, statusFilter, searchText, fromDate, toDate]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const metrics = useMemo(() => {
    const countByStatus = (status) => rows.filter((row) => row.status === status).length;
    return {
      total: rows.length,
      newCount: countByStatus('NEW'),
      contacted: countByStatus('CONTACTED'),
      converted: countByStatus('CONVERTED'),
      rewarded: countByStatus('REWARDED')
    };
  }, [rows]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const openWhatsApp = (row) => {
    const digits = String(row?.referredWhatsapp || '').replace(/\D/g, '');
    if (!digits) {
      enqueueSnackbar('El referido no tiene WhatsApp válido.', { variant: 'warning' });
      return;
    }
    const message = `Hola ${row?.referredName || ''}, te escribimos de Lion TV porque nos compartieron tu contacto para ofrecerte el servicio.`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const copyText = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      enqueueSnackbar('Dato copiado.', { variant: 'success' });
    } catch {
      enqueueSnackbar('No se pudo copiar el dato.', { variant: 'error' });
    }
  };

  const openDetail = (row) => {
    setSelectedRow(row);
    setFormState({
      status: row.status || 'NEW',
      adminNotes: row.adminNotes || ''
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedRow?.id) return;
    setSaving(true);
    try {
      await shopifyDemosApi.put(`/referrals/${selectedRow.id}`, {
        status: formState.status,
        adminNotes: formState.adminNotes || null
      });
      enqueueSnackbar('Solicitud de referido actualizada.', { variant: 'success' });
      setDialogOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || 'No se pudo actualizar la solicitud.', {
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderSkeletonRows = (
    <Stack spacing={1.25}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={112} />
      ))}
    </Stack>
  );

  const renderMobileCards = (
    <Stack spacing={1.5}>
      {loading
        ? renderSkeletonRows
        : pagedRows.map((row) => (
            <MobileSummaryCard
              key={row.id}
              icon={
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 42, height: 42 }}>
                  <PersonAddAlt1Icon fontSize="small" />
                </Avatar>
              }
              title={row.referredName || '-'}
              subtitle={row.referrerCustomerName || '-'}
              chips={[<StatusChip key="status" status={row.status} />]}
              actions={
                <ResponsiveActionBar justifyContent="flex-start">
                  <Button variant="contained" onClick={() => openDetail(row)}>
                    {t('actions.edit')}
                  </Button>
                  <Button variant="outlined" color="success" startIcon={<WhatsAppIcon />} onClick={() => openWhatsApp(row)}>
                    WhatsApp
                  </Button>
                </ResponsiveActionBar>
              }
            >
              <MobileFieldGrid
                fields={[
                  { label: t('referrals.fields.referrerContact', 'Cliente actual'), value: row.referrerContactValue },
                  { label: t('referrals.fields.whatsapp', 'WhatsApp referido'), value: row.referredWhatsapp },
                  { label: t('referrals.fields.createdAt', 'Creado'), value: formatDateTime(row.createdAt) },
                  { label: t('referrals.fields.notes', 'Notas'), value: row.adminNotes || '-' }
                ]}
              />
            </MobileSummaryCard>
          ))}
      {!loading && !pagedRows.length ? (
        <Card variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('referrals.empty', 'No hay solicitudes de referidos.')}
          </Typography>
        </Card>
      ) : null}
    </Stack>
  );

  const renderDesktopTable = (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('referrals.headers.createdAt', 'Creado')}</TableCell>
            <TableCell>{t('referrals.headers.referrer', 'Cliente actual')}</TableCell>
            <TableCell>{t('referrals.headers.referrerContact', 'Contacto')}</TableCell>
            <TableCell>{t('referrals.headers.referredName', 'Referido')}</TableCell>
            <TableCell>{t('referrals.headers.whatsapp', 'WhatsApp')}</TableCell>
            <TableCell>{t('referrals.headers.status', 'Estado')}</TableCell>
            <TableCell>{t('referrals.headers.notes', 'Notas')}</TableCell>
            <TableCell align="right">{t('actions.actions', 'Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((__, col) => (
                  <TableCell key={col}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : pagedRows.length ? (
            pagedRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                <TableCell>{row.referrerCustomerName || '-'}</TableCell>
                <TableCell>{row.referrerContactValue || '-'}</TableCell>
                <TableCell>{row.referredName || '-'}</TableCell>
                <TableCell>{row.referredWhatsapp || '-'}</TableCell>
                <TableCell>
                  <StatusChip status={row.status} />
                </TableCell>
                <TableCell sx={{ maxWidth: 280 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {row.adminNotes || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <RowActions row={row} onOpen={openDetail} onWhatsapp={openWhatsApp} onCopy={copyText} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="subtitle1" sx={{ py: 3, fontWeight: 700 }}>
                  {t('referrals.empty', 'No hay solicitudes de referidos.')}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <MainCard
        title={t('referrals.title', 'Referral leads')}
        secondary={
          <ResponsiveActionBar justifyContent="flex-start">
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
              {t('actions.refresh', 'Refresh')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2}>
          <Typography variant="body1" color="text.secondary">
            {t(
              'referrals.description',
              'Solicitudes enviadas desde Shopify por clientes actuales que quieren referir a otra persona y reclamar 1 mes gratis.'
            )}
          </Typography>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 1, md: 2, lg: 5 }}>
            <LionMetricCard title={t('referrals.metrics.total', 'Total')} value={metrics.total} icon={<PersonAddAlt1Icon />} color="primary" />
            <LionMetricCard title={t('referrals.metrics.new', 'New')} value={metrics.newCount} icon={<HourglassEmptyRoundedIcon />} color="info" />
            <LionMetricCard title={t('referrals.metrics.contacted', 'Contacted')} value={metrics.contacted} icon={<MarkEmailReadRoundedIcon />} color="secondary" />
            <LionMetricCard title={t('referrals.metrics.converted', 'Converted')} value={metrics.converted} icon={<CheckCircleOutlineIcon />} color="success" />
            <LionMetricCard title={t('referrals.metrics.rewarded', 'Rewarded')} value={metrics.rewarded} icon={<GiftRoundedIcon />} color="warning" />
          </ResponsiveMetricGrid>

          <ResponsiveFilters>
            <TextField
              fullWidth
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder={t('referrals.search', 'Buscar por cliente, contacto, referido o WhatsApp')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              sx={{ ...fieldSx, flex: 1 }}
            />
            <FormControl sx={fieldSx}>
              <InputLabel>{t('referrals.filters.status', 'Estado')}</InputLabel>
              <Select value={statusFilter} label={t('referrals.filters.status', 'Estado')} onChange={(event) => setStatusFilter(event.target.value)}>
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === 'ALL' ? t('referrals.filters.all', 'Todos') : status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('referrals.filters.from', 'Desde')}
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              label={t('referrals.filters.to', 'Hasta')}
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </ResponsiveFilters>

          <ResponsiveEntityView
            isMobile={isMobile}
            mobileContent={renderMobileCards}
            desktopContent={renderDesktopTable}
            pagination={
              <TablePagination
                component="div"
                count={filteredRows.length}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            }
          />
        </Stack>
      </MainCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullScreen={isMobile} fullWidth maxWidth="md">
        <DialogTitleWithClose
          title={t('referrals.dialog.title', 'Referral detail')}
          subtitle={selectedRow?.referredName || selectedRow?.referrerCustomerName || ''}
          onClose={() => setDialogOpen(false)}
        />
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5
              }}
            >
              <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('referrals.sections.referrer', 'Cliente actual')}
                  </Typography>
                  <MobileFieldGrid
                    columns={{ xs: 1, sm: 1 }}
                    fields={[
                      { label: t('referrals.fields.referrerCustomer', 'Nombre'), value: selectedRow?.referrerCustomerName || '-' },
                      { label: t('referrals.fields.referrerContact', 'Teléfono o correo'), value: selectedRow?.referrerContactValue || '-' },
                      { label: t('referrals.fields.referrerCustomerId', 'Customer ID'), value: selectedRow?.referrerCustomerId || '-' },
                      { label: t('referrals.fields.sourceShop', 'Shop'), value: selectedRow?.sourceShop || '-' }
                    ]}
                  />
                </Stack>
              </Card>

              <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('referrals.sections.referred', 'Referido')}
                  </Typography>
                  <MobileFieldGrid
                    columns={{ xs: 1, sm: 1 }}
                    fields={[
                      { label: t('referrals.fields.referredName', 'Nombre'), value: selectedRow?.referredName || '-' },
                      { label: t('referrals.fields.whatsapp', 'WhatsApp'), value: selectedRow?.referredWhatsapp || '-' },
                      { label: t('referrals.fields.createdAt', 'Creado'), value: formatDateTime(selectedRow?.createdAt) },
                      { label: t('referrals.fields.contactedAt', 'Contactado'), value: formatDateTime(selectedRow?.contactedAt) },
                      { label: t('referrals.fields.convertedAt', 'Convertido'), value: formatDateTime(selectedRow?.convertedAt) },
                      { label: t('referrals.fields.rewardGrantedAt', 'Beneficio aplicado'), value: formatDateTime(selectedRow?.rewardGrantedAt) }
                    ]}
                  />
                </Stack>
              </Card>
            </Box>

            <Divider />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 1.5
              }}
            >
              <FormControl sx={fieldSx} fullWidth>
                <InputLabel>{t('referrals.fields.status', 'Estado')}</InputLabel>
                <Select
                  value={formState.status}
                  label={t('referrals.fields.status', 'Estado')}
                  onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                >
                  {STATUS_OPTIONS.filter((status) => status !== 'ALL').map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label={t('referrals.fields.adminNotes', 'Notas admin')}
                value={formState.adminNotes}
                onChange={(event) => setFormState((prev) => ({ ...prev, adminNotes: event.target.value }))}
                sx={fieldSx}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button fullWidth={isMobile} variant="outlined" startIcon={<ContentCopyRoundedIcon />} onClick={() => copyText(selectedRow?.referrerContactValue)}>
            {t('referrals.actions.copyReferrer', 'Copiar contacto')}
          </Button>
          <Button fullWidth={isMobile} variant="outlined" color="success" startIcon={<WhatsAppIcon />} onClick={() => openWhatsApp(selectedRow)}>
            WhatsApp
          </Button>
          <Button fullWidth={isMobile} variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? t('actions.saving', 'Saving...') : t('actions.save', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
