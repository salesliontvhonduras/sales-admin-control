import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';

import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  createRaffle,
  createRaffleTemplate,
  drawRaffle,
  freezeRaffleAudience,
  listRaffleEntries,
  listRaffleTemplates,
  listRaffleWinners,
  listRaffles,
  previewRaffleAudience,
  updateRaffle,
  updateRaffleTemplate
} from 'api/liontv-engagement';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 46 }
};

const emptyTemplate = {
  id: null,
  name: '',
  description: '',
  active: true,
  filters: {
    status: '',
    channel: '',
    minimumSeniorityDays: '',
    minimumPaidBilling: '',
    minimumPaidInvoices: '',
    minimumActiveSubscriptions: '',
    minimumTotalSubscriptions: '',
    referredOnly: false
  }
};

const emptyRaffle = {
  id: null,
  name: '',
  description: '',
  prizeName: '',
  winnerCount: 1,
  mode: 'FILTERED',
  templateId: '',
  filters: { ...emptyTemplate.filters },
  manualCustomerIdsText: ''
};

function parseManualIds(value) {
  return Array.from(
    new Set(
      String(value || '')
        .split(/[\n, ]+/)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0)
    )
  );
}

function cleanFilters(filters = {}) {
  const next = { ...filters };
  Object.keys(next).forEach((key) => {
    if (next[key] === '' || next[key] === null || next[key] === undefined || next[key] === false) {
      delete next[key];
    }
  });
  return next;
}

export default function RafflesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [raffles, setRaffles] = useState([]);
  const [totalRaffles, setTotalRaffles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [templateDialog, setTemplateDialog] = useState({ open: false, form: { ...emptyTemplate } });
  const [raffleDialog, setRaffleDialog] = useState({ open: false, form: { ...emptyRaffle }, preview: null });
  const [entriesDialog, setEntriesDialog] = useState({ open: false, title: '', rows: [] });
  const [winnersDialog, setWinnersDialog] = useState({ open: false, rows: [] });

  const raffleStatusLabel = useCallback((value) => {
    if (!value) return '-';
    return t(`raffles.status.${value}`, { defaultValue: value });
  }, [t]);

  const raffleModeLabel = useCallback((value) => {
    if (!value) return '-';
    return t(`raffles.modes.${value}`, { defaultValue: value });
  }, [t]);

  const customerStatusLabel = useCallback((value) => {
    if (!value) return '-';
    return t(`customers.status.${value}`, { defaultValue: value });
  }, [t]);

  const channelLabel = useCallback((value) => {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'red social') return t('customers.channels.social');
    if (normalized === 'google') return t('customers.channels.google');
    if (normalized === 'familiares') return t('customers.channels.family');
    if (normalized === 'amigos') return t('customers.channels.friends');
    return value || '-';
  }, [t]);

  const loadTemplates = useCallback(async () => {
    try {
      const response = await listRaffleTemplates();
      setTemplates(response || []);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.loadTemplatesError'), { variant: 'error' });
    }
  }, [enqueueSnackbar, t]);

  const loadRaffles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listRaffles({
        index: page,
        size: rowsPerPage,
        status: statusFilter || undefined
      });
      setRaffles(response?.data || []);
      setTotalRaffles(response?.total || 0);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.loadRafflesError'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, page, rowsPerPage, statusFilter, t]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    loadRaffles();
  }, [loadRaffles]);

  const metrics = useMemo(() => {
    const frozen = raffles.filter((raffle) => raffle.raffleStatus === 'FROZEN').length;
    const drawn = raffles.filter((raffle) => raffle.raffleStatus === 'DRAWN').length;
    return { frozen, drawn };
  }, [raffles]);

  const handleSaveTemplate = async () => {
    const payload = {
      name: templateDialog.form.name,
      description: templateDialog.form.description,
      active: templateDialog.form.active,
      filters: cleanFilters(templateDialog.form.filters)
    };
    setSaving(true);
    try {
      if (templateDialog.form.id) {
        await updateRaffleTemplate(templateDialog.form.id, payload);
      } else {
        await createRaffleTemplate(payload);
      }
      enqueueSnackbar(t('raffles.messages.templateSaved'), { variant: 'success' });
      setTemplateDialog({ open: false, form: { ...emptyTemplate } });
      await loadTemplates();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.templateSaveError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewRaffle = async () => {
    setSaving(true);
    try {
      const payload = {
        name: raffleDialog.form.name,
        description: raffleDialog.form.description,
        prizeName: raffleDialog.form.prizeName,
        winnerCount: Number(raffleDialog.form.winnerCount || 1),
        mode: raffleDialog.form.mode,
        templateId: raffleDialog.form.templateId || null,
        filters: cleanFilters(raffleDialog.form.filters),
        manualCustomerIds: parseManualIds(raffleDialog.form.manualCustomerIdsText)
      };
      const preview = await previewRaffleAudience(payload);
      setRaffleDialog((prev) => ({ ...prev, preview }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.previewError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRaffle = async () => {
    const payload = {
      name: raffleDialog.form.name,
      description: raffleDialog.form.description,
      prizeName: raffleDialog.form.prizeName,
      winnerCount: Number(raffleDialog.form.winnerCount || 1),
      mode: raffleDialog.form.mode,
      templateId: raffleDialog.form.templateId || null,
      filters: cleanFilters(raffleDialog.form.filters),
      manualCustomerIds: parseManualIds(raffleDialog.form.manualCustomerIdsText)
    };
    setSaving(true);
    try {
      if (raffleDialog.form.id) {
        await updateRaffle(raffleDialog.form.id, payload);
      } else {
        await createRaffle(payload);
      }
      enqueueSnackbar(t('raffles.messages.raffleSaved'), { variant: 'success' });
      setRaffleDialog({ open: false, form: { ...emptyRaffle }, preview: null });
      await loadRaffles();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.raffleSaveError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openEditRaffle = (raffle) => {
    setRaffleDialog({
      open: true,
      preview: null,
      form: {
        id: raffle.id,
        name: raffle.name || '',
        description: raffle.description || '',
        prizeName: raffle.prizeName || '',
        winnerCount: raffle.winnerCount || 1,
        mode: raffle.mode || 'FILTERED',
        templateId: raffle.templateId || '',
        filters: { ...emptyTemplate.filters, ...(raffle.filters || {}) },
        manualCustomerIdsText: (raffle.manualCustomerIds || []).join(', ')
      }
    });
  };

  const handleFreezeAudience = async (raffleId) => {
    setSaving(true);
    try {
      const response = await freezeRaffleAudience(raffleId);
      enqueueSnackbar(t('raffles.messages.freezeSuccess', { count: response?.totalEligible || 0 }), { variant: 'success' });
      await loadRaffles();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.freezeError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDraw = async (raffleId) => {
    setSaving(true);
    try {
      const winners = await drawRaffle(raffleId);
      enqueueSnackbar(t('raffles.messages.drawSuccess', { count: winners?.length || 0 }), { variant: 'success' });
      setWinnersDialog({ open: true, rows: winners || [] });
      await loadRaffles();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.drawError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleViewEntries = async (raffleId) => {
    try {
      const rows = await listRaffleEntries(raffleId);
      setEntriesDialog({ open: true, title: t('raffles.dialogs.entriesTitle'), rows: rows || [] });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.loadEntriesError'), { variant: 'error' });
    }
  };

  const handleViewWinners = async (raffleId) => {
    try {
      const rows = await listRaffleWinners(raffleId);
      setWinnersDialog({ open: true, rows: rows || [] });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('raffles.messages.loadWinnersError'), { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
      <MainCard
        title={t('raffles.title')}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => Promise.all([loadTemplates(), loadRaffles()])}>
              {t('actions.refresh')}
            </Button>
            <Button variant="outlined" startIcon={<GroupAddRoundedIcon />} onClick={() => setTemplateDialog({ open: true, form: { ...emptyTemplate } })}>
              {t('raffles.actions.newTemplate')}
            </Button>
            <Button variant="contained" startIcon={<CardGiftcardRoundedIcon />} onClick={() => setRaffleDialog({ open: true, form: { ...emptyRaffle }, preview: null })}>
              {t('raffles.actions.newRaffle')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <Alert severity="info">{t('raffles.alerts.info')}</Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
            <LionMetricCard
              title={t('raffles.metrics.templates')}
              value={templates.length}
              helper={t('raffles.metrics.templatesHelper')}
              color="secondary"
              icon={<GroupAddRoundedIcon />}
            />
            <LionMetricCard
              title={t('raffles.metrics.raffles')}
              value={totalRaffles}
              helper={t('raffles.metrics.rafflesHelper')}
              color="primary"
              icon={<CardGiftcardRoundedIcon />}
            />
            <LionMetricCard
              title={t('raffles.metrics.frozen')}
              value={metrics.frozen}
              helper={t('raffles.metrics.frozenHelper')}
              color="warning"
              icon={<VisibilityRoundedIcon />}
            />
            <LionMetricCard
              title={t('raffles.metrics.drawn')}
              value={metrics.drawn}
              helper={t('raffles.metrics.drawnHelper')}
              color="success"
              icon={<ShuffleRoundedIcon />}
            />
          </ResponsiveMetricGrid>

          <Paper sx={{ p: 1, borderRadius: 3 }}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab label={t('raffles.tabs.templates')} />
              <Tab label={t('raffles.tabs.raffles')} />
            </Tabs>
          </Paper>

          {tab === 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('raffles.table.name')}</TableCell>
                    <TableCell>{t('raffles.table.description')}</TableCell>
                    <TableCell>{t('raffles.table.active')}</TableCell>
                    <TableCell>{t('raffles.table.seed')}</TableCell>
                    <TableCell align="right">{t('raffles.table.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id} hover>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description || '-'}</TableCell>
                      <TableCell>{template.active ? t('raffles.table.yes') : t('raffles.table.no')}</TableCell>
                      <TableCell>{template.seed ? t('raffles.table.yes') : t('raffles.table.no')}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => setTemplateDialog({ open: true, form: { ...emptyTemplate, ...template, filters: { ...emptyTemplate.filters, ...(template.filters || {}) } } })}>
                          {t('actions.edit')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>{t('raffles.filters.status')}</InputLabel>
                    <Select label={t('raffles.filters.status')} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                      <MenuItem value="">{t('raffles.filters.all')}</MenuItem>
                      <MenuItem value="DRAFT">{raffleStatusLabel('DRAFT')}</MenuItem>
                      <MenuItem value="FROZEN">{raffleStatusLabel('FROZEN')}</MenuItem>
                      <MenuItem value="DRAWN">{raffleStatusLabel('DRAWN')}</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('raffles.table.name')}</TableCell>
                      <TableCell>{t('raffles.table.prize')}</TableCell>
                      <TableCell>{t('raffles.table.mode')}</TableCell>
                      <TableCell>{t('raffles.table.winners')}</TableCell>
                      <TableCell>{t('raffles.table.status')}</TableCell>
                      <TableCell>{t('raffles.table.seed')}</TableCell>
                      <TableCell align="right">{t('raffles.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {raffles.map((raffle) => (
                      <TableRow key={raffle.id} hover>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="subtitle2">{raffle.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {raffle.description || '-'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{raffle.prizeName || '-'}</TableCell>
                        <TableCell>{raffleModeLabel(raffle.mode)}</TableCell>
                        <TableCell>{raffle.winnerCount || 1}</TableCell>
                        <TableCell>{raffleStatusLabel(raffle.raffleStatus)}</TableCell>
                        <TableCell>{raffle.drawSeed || '-'}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                            <Button size="small" variant="outlined" onClick={() => openEditRaffle(raffle)}>
                              {t('actions.edit')}
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => handleFreezeAudience(raffle.id)}>
                              {t('raffles.actions.freeze')}
                            </Button>
                            <Button size="small" variant="contained" onClick={() => handleDraw(raffle.id)}>
                              {t('raffles.actions.draw')}
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => handleViewEntries(raffle.id)}>
                              {t('raffles.actions.entries')}
                            </Button>
                            <Button size="small" variant="outlined" onClick={() => handleViewWinners(raffle.id)}>
                              {t('raffles.actions.winners')}
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && raffles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          {t('raffles.table.empty')}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalRaffles}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </Stack>
          )}
        </Stack>
      </MainCard>

      <Dialog open={templateDialog.open} onClose={() => setTemplateDialog({ open: false, form: { ...emptyTemplate } })} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={() => setTemplateDialog({ open: false, form: { ...emptyTemplate } })}>
          {t('raffles.dialogs.templateTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <TextField
              label={t('raffles.dialogs.name')}
              value={templateDialog.form.name}
              onChange={(event) => setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, name: event.target.value } }))}
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label={t('raffles.dialogs.description')}
              value={templateDialog.form.description}
              onChange={(event) => setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, description: event.target.value } }))}
              fullWidth
              multiline
              minRows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(templateDialog.form.active)}
                  onChange={(event) =>
                    setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, active: event.target.checked } }))
                  }
                />
              }
              label={t('raffles.dialogs.activeTemplate')}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel>{t('raffles.dialogs.customerStatus')}</InputLabel>
                <Select
                  label={t('raffles.dialogs.customerStatus')}
                  value={templateDialog.form.filters.status || ''}
                  onChange={(event) =>
                    setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, status: event.target.value } } }))
                  }
                >
                  <MenuItem value="">{t('raffles.filters.all')}</MenuItem>
                  <MenuItem value="ACTIVE">{customerStatusLabel('ACTIVE')}</MenuItem>
                  <MenuItem value="INACTIVE">{customerStatusLabel('INACTIVE')}</MenuItem>
                  <MenuItem value="SUSPENDED">{customerStatusLabel('SUSPENDED')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t('raffles.dialogs.channel')}
                value={templateDialog.form.filters.channel || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, channel: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('raffles.dialogs.minSeniority')}
                value={templateDialog.form.filters.minimumSeniorityDays || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumSeniorityDays: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minPaidBilling')}
                value={templateDialog.form.filters.minimumPaidBilling || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumPaidBilling: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('raffles.dialogs.minPaidInvoices')}
                value={templateDialog.form.filters.minimumPaidInvoices || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumPaidInvoices: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minActiveSubscriptions')}
                value={templateDialog.form.filters.minimumActiveSubscriptions || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumActiveSubscriptions: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minTotalSubscriptions')}
                value={templateDialog.form.filters.minimumTotalSubscriptions || ''}
                onChange={(event) =>
                  setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumTotalSubscriptions: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(templateDialog.form.filters.referredOnly)}
                  onChange={(event) =>
                    setTemplateDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, referredOnly: event.target.checked } } }))
                  }
                />
              }
              label={t('raffles.dialogs.referredOnly')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog({ open: false, form: { ...emptyTemplate } })}>{t('actions.cancel')}</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveTemplate} disabled={saving}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={raffleDialog.open} onClose={() => setRaffleDialog({ open: false, form: { ...emptyRaffle }, preview: null })} fullWidth maxWidth="lg">
        <DialogTitleWithClose onClose={() => setRaffleDialog({ open: false, form: { ...emptyRaffle }, preview: null })}>
          {t('raffles.dialogs.raffleTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label={t('raffles.dialogs.name')}
                value={raffleDialog.form.name}
                onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, name: event.target.value } }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label={t('raffles.dialogs.prize')}
                value={raffleDialog.form.prizeName}
                onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, prizeName: event.target.value } }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <TextField
              label={t('raffles.dialogs.description')}
              value={raffleDialog.form.description}
              onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, description: event.target.value } }))}
              fullWidth
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel>{t('raffles.dialogs.mode')}</InputLabel>
                <Select
                  label={t('raffles.dialogs.mode')}
                  value={raffleDialog.form.mode}
                  onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, mode: event.target.value } }))}
                >
                  <MenuItem value="FILTERED">{raffleModeLabel('FILTERED')}</MenuItem>
                  <MenuItem value="MANUAL">{raffleModeLabel('MANUAL')}</MenuItem>
                  <MenuItem value="MIXED">{raffleModeLabel('MIXED')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{t('raffles.dialogs.template')}</InputLabel>
                <Select
                  label={t('raffles.dialogs.template')}
                  value={raffleDialog.form.templateId || ''}
                  onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, templateId: event.target.value } }))}
                >
                  <MenuItem value="">{t('raffles.dialogs.noTemplate')}</MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                label={t('raffles.dialogs.winnerCount')}
                value={raffleDialog.form.winnerCount}
                onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, winnerCount: event.target.value } }))}
                sx={{ ...fieldSx, minWidth: 220 }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <FormControl fullWidth>
                <InputLabel>{t('raffles.dialogs.customerStatus')}</InputLabel>
                <Select
                  label={t('raffles.dialogs.customerStatus')}
                  value={raffleDialog.form.filters.status || ''}
                  onChange={(event) =>
                    setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, status: event.target.value } } }))
                  }
                >
                  <MenuItem value="">{t('raffles.filters.all')}</MenuItem>
                  <MenuItem value="ACTIVE">{customerStatusLabel('ACTIVE')}</MenuItem>
                  <MenuItem value="INACTIVE">{customerStatusLabel('INACTIVE')}</MenuItem>
                  <MenuItem value="SUSPENDED">{customerStatusLabel('SUSPENDED')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t('raffles.dialogs.channel')}
                value={raffleDialog.form.filters.channel || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, channel: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('raffles.dialogs.minSeniority')}
                value={raffleDialog.form.filters.minimumSeniorityDays || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumSeniorityDays: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minPaidBilling')}
                value={raffleDialog.form.filters.minimumPaidBilling || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumPaidBilling: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minPaidInvoices')}
                value={raffleDialog.form.filters.minimumPaidInvoices || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumPaidInvoices: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('raffles.dialogs.minActiveSubscriptions')}
                value={raffleDialog.form.filters.minimumActiveSubscriptions || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumActiveSubscriptions: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('raffles.dialogs.minTotalSubscriptions')}
                value={raffleDialog.form.filters.minimumTotalSubscriptions || ''}
                onChange={(event) =>
                  setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, minimumTotalSubscriptions: event.target.value } } }))
                }
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(raffleDialog.form.filters.referredOnly)}
                  onChange={(event) =>
                    setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, filters: { ...prev.form.filters, referredOnly: event.target.checked } } }))
                  }
                />
              }
              label={t('raffles.dialogs.referredOnly')}
            />
            <TextField
              label={t('raffles.dialogs.manualCustomerIds')}
              value={raffleDialog.form.manualCustomerIdsText}
              onChange={(event) => setRaffleDialog((prev) => ({ ...prev, form: { ...prev.form, manualCustomerIdsText: event.target.value } }))}
              fullWidth
              multiline
              minRows={3}
              helperText={t('raffles.dialogs.manualCustomerIdsHelper')}
            />

            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} justifyContent="space-between">
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">{t('raffles.dialogs.previewTitle')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('raffles.dialogs.previewHelper')}
                  </Typography>
                </Stack>
                <Button variant="outlined" onClick={handlePreviewRaffle} disabled={saving}>
                  {t('raffles.actions.preview')}
                </Button>
              </Stack>
              {raffleDialog.preview ? (
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Alert severity="success">
                    {t('raffles.dialogs.previewAlert', {
                      eligible: raffleDialog.preview.totalEligible || 0,
                      filtered: raffleDialog.preview.filteredCount || 0,
                      manual: raffleDialog.preview.manualCount || 0
                    })}
                  </Alert>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('raffles.dialogs.id')}</TableCell>
                          <TableCell>{t('raffles.dialogs.customer')}</TableCell>
                          <TableCell>{t('raffles.dialogs.channel')}</TableCell>
                          <TableCell>{t('raffles.dialogs.billing')}</TableCell>
                          <TableCell>{t('raffles.dialogs.subscriptions')}</TableCell>
                          <TableCell>{t('raffles.dialogs.source')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(raffleDialog.preview.data || []).map((row) => (
                          <TableRow key={row.customerId}>
                            <TableCell>{row.customerId}</TableCell>
                            <TableCell>{row.customerFullname || '-'}</TableCell>
                            <TableCell>{channelLabel(row.channel)}</TableCell>
                            <TableCell>{row.totalPaidAmount || 0}</TableCell>
                            <TableCell>
                              {row.activeSubscriptions || 0} / {row.totalSubscriptions || 0}
                            </TableCell>
                            <TableCell>{raffleModeLabel(row.entrySource)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              ) : null}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRaffleDialog({ open: false, form: { ...emptyRaffle }, preview: null })}>{t('actions.cancel')}</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveRaffle} disabled={saving}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={entriesDialog.open} onClose={() => setEntriesDialog({ open: false, title: '', rows: [] })} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={() => setEntriesDialog({ open: false, title: '', rows: [] })}>{entriesDialog.title}</DialogTitleWithClose>
        <DialogContent dividers>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('raffles.dialogs.id')}</TableCell>
                    <TableCell>{t('raffles.dialogs.customer')}</TableCell>
                    <TableCell>{t('raffles.table.status')}</TableCell>
                    <TableCell>{t('raffles.dialogs.channel')}</TableCell>
                    <TableCell>{t('raffles.dialogs.source')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entriesDialog.rows.map((row) => (
                    <TableRow key={row.entryId}>
                      <TableCell>{row.customerId}</TableCell>
                      <TableCell>{row.customerFullname || '-'}</TableCell>
                      <TableCell>{customerStatusLabel(row.customerStatus)}</TableCell>
                      <TableCell>{channelLabel(row.channel)}</TableCell>
                      <TableCell>{raffleModeLabel(row.entrySource)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog open={winnersDialog.open} onClose={() => setWinnersDialog({ open: false, rows: [] })} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => setWinnersDialog({ open: false, rows: [] })}>{t('raffles.dialogs.winnersTitle')}</DialogTitleWithClose>
        <DialogContent dividers>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('raffles.dialogs.rank')}</TableCell>
                  <TableCell>{t('raffles.dialogs.id')}</TableCell>
                  <TableCell>{t('raffles.dialogs.customer')}</TableCell>
                  <TableCell>{t('raffles.dialogs.contact')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {winnersDialog.rows.map((row) => (
                  <TableRow key={row.winnerId}>
                    <TableCell>{row.winnerRank}</TableCell>
                    <TableCell>{row.customerId}</TableCell>
                    <TableCell>{row.customerFullname || '-'}</TableCell>
                    <TableCell>{row.customerPhone || row.customerMail || '-'}</TableCell>
                  </TableRow>
                ))}
                {!winnersDialog.rows.length ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      {t('raffles.messages.winnersEmpty')}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
