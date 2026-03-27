import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const providerStatusOptions = ['ACTIVE', 'INACTIVE'];
const accountStatusOptions = ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING', 'CANCELLED'];
const retryModes = ['FORWARD_ALL', 'FORWARD_SUMMARY', 'FORWARD_EXTRACTED_TEXT', 'STORE_ONLY'];

const defaultProviderForm = { id: null, code: '', name: '', description: '' };
const defaultAccountForm = {
  id: null,
  accountCode: '',
  displayName: '',
  providerId: '',
  customerId: '',
  principalReference: '',
  aliasEmail: '',
  expirationDate: '',
  renewalDate: '',
  accountStatus: 'ACTIVE',
  allowDistribution: true,
  notes: ''
};
const defaultInboundForm = {
  mailboxAccount: 'principal@gmail.com',
  rawMessageId: '',
  gmailMessageId: '',
  internetMessageId: '',
  fromEmail: '',
  toEmail: 'principal@gmail.com',
  subject: '',
  bodyPlain: '',
  bodyHtml: '',
  rawHeaders: '',
  receivedAt: new Date().toISOString().slice(0, 19)
};

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

function statusColor(status) {
  const value = String(status || '').toUpperCase();
  if (['ACTIVE', 'SENT', 'DISTRIBUTED'].includes(value)) return 'success';
  if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(value)) return 'error';
  if (['PENDING', 'ALIAS_RESOLVED', 'ACCOUNT_MATCHED'].includes(value)) return 'warning';
  return 'default';
}

export default function ManagedAccountsLionTv() {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [events, setEvents] = useState([]);

  const [inboundSummary, setInboundSummary] = useState(null);
  const [distributionSummary, setDistributionSummary] = useState(null);
  const [providerSummary, setProviderSummary] = useState([]);
  const [aliasSummary, setAliasSummary] = useState([]);

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [providerForm, setProviderForm] = useState(defaultProviderForm);
  const [providerSaving, setProviderSaving] = useState(false);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState(defaultAccountForm);
  const [accountSaving, setAccountSaving] = useState(false);

  const [inboundForm, setInboundForm] = useState(defaultInboundForm);
  const [inboundProcessing, setInboundProcessing] = useState(false);
  const [lastProcessResult, setLastProcessResult] = useState(null);
  const [retryModeById, setRetryModeById] = useState({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const onError = useCallback(
    (error, fallback) => {
      if ((error?.response?.status || error?.request?.status) === 401) return;
      enqueueSnackbar(error?.response?.data?.message || error?.message || fallback, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const loadProviders = useCallback(async () => {
    const res = await lionTvApi.get('/providers/v1', { headers, params: { index: 0, size: 300 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setProviders(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadAccounts = useCallback(async () => {
    const res = await lionTvApi.get('/managed-accounts/v1', { headers, params: { index: 0, size: 300 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setAccounts(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadCustomers = useCallback(async () => {
    const res = await lionTvApi.get('/customers/v1', { headers, params: { index: 0, size: 5000 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const normalized = rows.map((row) => ({
      customerId: row.customerId || row.customer_id || row.id,
      customerFullname: row.customerFullname || row.customer_fullname || row.displayName || row.name || ''
    }));
    setCustomers(normalized);
  }, [headers]);

  const loadEvents = useCallback(async () => {
    const res = await lionTvApi.get('/inbound-emails/v1', { headers, params: { index: 0, size: 100 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setEvents(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadReports = useCallback(async () => {
    const [inboundRes, distributionRes, providerRes, aliasRes] = await Promise.all([
      lionTvApi.get('/reports/v1/inbound-emails/summary', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/distribution/summary', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/inbound-emails/by-provider', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/inbound-emails/by-alias', { headers, skipAuthRedirect: true })
    ]);
    setInboundSummary(unwrap(inboundRes));
    setDistributionSummary(unwrap(distributionRes));
    setProviderSummary(Array.isArray(unwrap(providerRes)) ? unwrap(providerRes) : []);
    setAliasSummary(Array.isArray(unwrap(aliasRes)) ? unwrap(aliasRes) : []);
  }, [headers]);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      if (tab === 0) await loadProviders();
      if (tab === 1) await Promise.all([loadProviders(), loadAccounts(), loadCustomers()]);
      if (tab === 2) await loadEvents();
      if (tab === 3) await loadReports();
    } catch (error) {
      onError(error, 'No se pudo cargar el módulo');
    } finally {
      setLoading(false);
    }
  }, [accessToken, tab, loadProviders, loadAccounts, loadCustomers, loadEvents, loadReports, onError]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveProvider = async () => {
    if (!providerForm.code || !providerForm.name) {
      enqueueSnackbar('Code y Name son requeridos', { variant: 'warning' });
      return;
    }
    setProviderSaving(true);
    try {
      const payload = { code: providerForm.code, name: providerForm.name, description: providerForm.description || null };
      if (providerForm.id) {
        await lionTvApi.put(`/providers/v1/${providerForm.id}`, payload, { headers, skipAuthRedirect: true });
      } else {
        await lionTvApi.post('/providers/v1', payload, { headers, skipAuthRedirect: true });
      }
      setProviderModalOpen(false);
      setProviderForm(defaultProviderForm);
      enqueueSnackbar('Provider guardado', { variant: 'success' });
      await loadProviders();
    } catch (error) {
      onError(error, 'No se pudo guardar provider');
    } finally {
      setProviderSaving(false);
    }
  };

  const patchProviderStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/providers/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadProviders();
    } catch (error) {
      onError(error, 'No se pudo cambiar estado del provider');
    }
  };

  const saveAccount = async () => {
    if (!accountForm.accountCode || !accountForm.displayName || !accountForm.providerId || !accountForm.customerId || !accountForm.aliasEmail || !accountForm.expirationDate) {
      enqueueSnackbar('Completa campos obligatorios', { variant: 'warning' });
      return;
    }
    setAccountSaving(true);
    try {
      const payload = {
        accountCode: accountForm.accountCode,
        displayName: accountForm.displayName,
        providerId: Number(accountForm.providerId),
        customerId: Number(accountForm.customerId),
        principalReference: accountForm.principalReference || null,
        aliasEmail: accountForm.aliasEmail,
        expirationDate: accountForm.expirationDate,
        renewalDate: accountForm.renewalDate || null,
        accountStatus: accountForm.accountStatus,
        allowDistribution: Boolean(accountForm.allowDistribution),
        notes: accountForm.notes || null
      };
      if (accountForm.id) {
        await lionTvApi.put(`/managed-accounts/v1/${accountForm.id}`, payload, { headers, skipAuthRedirect: true });
      } else {
        await lionTvApi.post('/managed-accounts/v1', payload, { headers, skipAuthRedirect: true });
      }
      setAccountModalOpen(false);
      setAccountForm(defaultAccountForm);
      enqueueSnackbar('Cuenta guardada', { variant: 'success' });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo guardar cuenta gestionada');
    } finally {
      setAccountSaving(false);
    }
  };

  const patchAccountStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo cambiar estado de la cuenta');
    }
  };

  const patchDistribution = async (id, allowDistribution) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/distribution`, { allowDistribution }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo cambiar distribución');
    }
  };

  const processInbound = async () => {
    if (!inboundForm.mailboxAccount || !inboundForm.rawMessageId || !inboundForm.fromEmail || !inboundForm.receivedAt) {
      enqueueSnackbar('mailboxAccount, rawMessageId, fromEmail y receivedAt son obligatorios', { variant: 'warning' });
      return;
    }
    setInboundProcessing(true);
    try {
      const payload = { ...inboundForm, receivedAt: inboundForm.receivedAt.includes('T') ? inboundForm.receivedAt : inboundForm.receivedAt.replace(' ', 'T') };
      const res = await lionTvApi.post('/internal/inbound-emails/v1/process', payload, { headers, skipAuthRedirect: true });
      setLastProcessResult(unwrap(res));
      enqueueSnackbar('Inbound procesado', { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, 'No se pudo procesar inbound');
    } finally {
      setInboundProcessing(false);
    }
  };

  const retryDistribution = async (eventId) => {
    try {
      const mode = retryModeById[eventId] || 'FORWARD_ALL';
      const res = await lionTvApi.post(`/inbound-emails/v1/${eventId}/retry-distribution`, { mode }, { headers, skipAuthRedirect: true });
      setLastProcessResult(unwrap(res));
      enqueueSnackbar('Retry ejecutado', { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, 'No se pudo reintentar distribución');
    }
  };

  return (
    <MainCard title="Managed Accounts + Inbound Emails" secondary={<Button variant="contained" onClick={reload}>Refrescar</Button>}>
      <Stack spacing={2}>
        <Alert severity="info">Flujo completo: providers, cuentas por alias, inbound processing y reportes de distribución.</Alert>
        <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="scrollable" scrollButtons="auto">
          <Tab label="Providers" />
          <Tab label="Managed Accounts" />
          <Tab label="Inbound" />
          <Tab label="Reports" />
        </Tabs>
        {loading ? <LinearProgress /> : null}

        {tab === 0 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => { setProviderForm(defaultProviderForm); setProviderModalOpen(true); }}>Nuevo Provider</Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Card}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Code</TableCell><TableCell>Name</TableCell><TableCell>Status</TableCell><TableCell>Created By</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
                  <TableBody>
                    {providers.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell><Chip size="small" color={statusColor(row.status)} label={row.status} /></TableCell>
                        <TableCell>{row.createdBy || '-'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" onClick={() => { setProviderForm({ id: row.id, code: row.code, name: row.name, description: row.description || '' }); setProviderModalOpen(true); }}>Editar</Button>
                            <TextField select size="small" value={row.status || 'ACTIVE'} onChange={(event) => patchProviderStatus(row.id, event.target.value)} sx={{ minWidth: 140 }}>
                              {providerStatusOptions.map((it) => <MenuItem key={it} value={it}>{it}</MenuItem>)}
                            </TextField>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!providers.length ? <TableRow><TableCell colSpan={6}>Sin datos</TableCell></TableRow> : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        ) : null}

        {tab === 1 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => {
                  setAccountForm({ ...defaultAccountForm, providerId: providers[0]?.id || '', customerId: customers[0]?.customerId || '' });
                  setAccountModalOpen(true);
                }}>Nueva Cuenta</Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Card}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Code</TableCell><TableCell>Name</TableCell><TableCell>Provider</TableCell><TableCell>Customer</TableCell><TableCell>Alias</TableCell><TableCell>Status</TableCell><TableCell>Distribution</TableCell><TableCell>Created By</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
                  <TableBody>
                    {accounts.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.accountCode}</TableCell>
                        <TableCell>{row.displayName}</TableCell>
                        <TableCell>{row.providerCode || row.providerId}</TableCell>
                        <TableCell>{row.customerFullname || row.customerId || '-'}</TableCell>
                        <TableCell>{row.aliasEmail}</TableCell>
                        <TableCell><Chip size="small" color={statusColor(row.accountStatus)} label={row.accountStatus} /></TableCell>
                        <TableCell>
                          <FormControlLabel control={<Switch checked={Boolean(row.allowDistribution)} onChange={(_, checked) => patchDistribution(row.id, checked)} />} label={row.allowDistribution ? 'ON' : 'OFF'} />
                        </TableCell>
                        <TableCell>{row.createdBy || '-'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" onClick={() => { setAccountForm({ ...row, providerId: row.providerId, customerId: row.customerId || '', expirationDate: row.expirationDate || '', renewalDate: row.renewalDate || '' }); setAccountModalOpen(true); }}>Editar</Button>
                            <TextField select size="small" value={row.accountStatus || 'ACTIVE'} onChange={(event) => patchAccountStatus(row.id, event.target.value)} sx={{ minWidth: 150 }}>
                              {accountStatusOptions.map((it) => <MenuItem key={it} value={it}>{it}</MenuItem>)}
                            </TextField>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!accounts.length ? <TableRow><TableCell colSpan={10}>Sin datos</TableCell></TableRow> : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        ) : null}

        {tab === 2 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={5}>
              <Card><CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h4">Process Inbound</Typography>
                  <TextField label="Mailbox" value={inboundForm.mailboxAccount} onChange={(event) => setInboundForm((prev) => ({ ...prev, mailboxAccount: event.target.value }))} />
                  <TextField label="Raw Message ID" value={inboundForm.rawMessageId} onChange={(event) => setInboundForm((prev) => ({ ...prev, rawMessageId: event.target.value }))} />
                  <TextField label="From Email" value={inboundForm.fromEmail} onChange={(event) => setInboundForm((prev) => ({ ...prev, fromEmail: event.target.value }))} />
                  <TextField label="Subject" value={inboundForm.subject} onChange={(event) => setInboundForm((prev) => ({ ...prev, subject: event.target.value }))} />
                  <TextField label="Received At" type="datetime-local" value={inboundForm.receivedAt} onChange={(event) => setInboundForm((prev) => ({ ...prev, receivedAt: event.target.value }))} InputLabelProps={{ shrink: true }} />
                  <TextField label="Raw Headers" multiline minRows={5} value={inboundForm.rawHeaders} onChange={(event) => setInboundForm((prev) => ({ ...prev, rawHeaders: event.target.value }))} />
                  <TextField label="Body Plain" multiline minRows={4} value={inboundForm.bodyPlain} onChange={(event) => setInboundForm((prev) => ({ ...prev, bodyPlain: event.target.value }))} />
                  <Button variant="contained" onClick={processInbound} disabled={inboundProcessing}>{inboundProcessing ? 'Procesando...' : 'Procesar'}</Button>
                </Stack>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card><CardContent>
                <Typography variant="h4">Inbound Events</Typography>
                <Divider sx={{ my: 1.5 }} />
                {lastProcessResult ? <Alert severity={lastProcessResult.processingStatus === 'FAILED' ? 'error' : 'success'} sx={{ mb: 2 }}>{lastProcessResult.message}</Alert> : null}
                <Table size="small">
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Alias</TableCell><TableCell>Status</TableCell><TableCell>Retry Mode</TableCell><TableCell>Retry</TableCell></TableRow></TableHead>
                  <TableBody>
                    {events.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.resolvedAlias || 'UNRESOLVED'}</TableCell>
                        <TableCell><Chip size="small" color={statusColor(row.processingStatus)} label={row.processingStatus} /></TableCell>
                        <TableCell>
                          <TextField select size="small" value={retryModeById[row.id] || 'FORWARD_ALL'} onChange={(event) => setRetryModeById((prev) => ({ ...prev, [row.id]: event.target.value }))} sx={{ minWidth: 170 }}>
                            {retryModes.map((it) => <MenuItem key={it} value={it}>{it}</MenuItem>)}
                          </TextField>
                        </TableCell>
                        <TableCell><Button size="small" disabled={row.processingStatus !== 'FAILED'} onClick={() => retryDistribution(row.id)}>Retry</Button></TableCell>
                      </TableRow>
                    ))}
                    {!events.length ? <TableRow><TableCell colSpan={5}>Sin eventos</TableCell></TableRow> : null}
                  </TableBody>
                </Table>
              </CardContent></Card>
            </Grid>
          </Grid>
        ) : null}

        {tab === 3 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={3}><Card><CardContent><Typography variant="subtitle2">Inbound Total</Typography><Typography variant="h3">{inboundSummary?.total || 0}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography variant="subtitle2">Distributed</Typography><Typography variant="h3">{inboundSummary?.distributed || 0}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography variant="subtitle2">Sent</Typography><Typography variant="h3">{distributionSummary?.sent || 0}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card><CardContent><Typography variant="subtitle2">Failed</Typography><Typography variant="h3">{distributionSummary?.failed || 0}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent><Typography variant="h4">By Provider</Typography><Table size="small"><TableBody>{providerSummary.map((it, idx) => <TableRow key={`${it.providerId || idx}-${it.providerCode || 'x'}`}><TableCell>{it.providerCode || 'UNASSIGNED'}</TableCell><TableCell align="right">{it.totalInbound}</TableCell></TableRow>)}{!providerSummary.length ? <TableRow><TableCell colSpan={2}>Sin datos</TableCell></TableRow> : null}</TableBody></Table></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent><Typography variant="h4">By Alias</Typography><Table size="small"><TableBody>{aliasSummary.map((it, idx) => <TableRow key={`${it.resolvedAlias || idx}`}><TableCell>{it.resolvedAlias}</TableCell><TableCell align="right">{it.totalInbound}</TableCell></TableRow>)}{!aliasSummary.length ? <TableRow><TableCell colSpan={2}>Sin datos</TableCell></TableRow> : null}</TableBody></Table></CardContent></Card>
            </Grid>
          </Grid>
        ) : null}
      </Stack>

      <Dialog open={providerModalOpen} onClose={() => setProviderModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{providerForm.id ? 'Editar Provider' : 'Nuevo Provider'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={0.5}>
            <TextField label="Code" value={providerForm.code} onChange={(event) => setProviderForm((prev) => ({ ...prev, code: event.target.value }))} />
            <TextField label="Name" value={providerForm.name} onChange={(event) => setProviderForm((prev) => ({ ...prev, name: event.target.value }))} />
            <TextField label="Description" multiline minRows={3} value={providerForm.description} onChange={(event) => setProviderForm((prev) => ({ ...prev, description: event.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProviderModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveProvider} disabled={providerSaving}>{providerSaving ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={accountModalOpen} onClose={() => setAccountModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{accountForm.id ? 'Editar Cuenta Gestionada' : 'Nueva Cuenta Gestionada'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Account Code" value={accountForm.accountCode} onChange={(event) => setAccountForm((prev) => ({ ...prev, accountCode: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Display Name" value={accountForm.displayName} onChange={(event) => setAccountForm((prev) => ({ ...prev, displayName: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth select label="Provider" value={accountForm.providerId} onChange={(event) => setAccountForm((prev) => ({ ...prev, providerId: event.target.value }))}>
                {providers.map((p) => <MenuItem key={p.id} value={p.id}>{p.code} - {p.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Principal Reference" value={accountForm.principalReference} onChange={(event) => setAccountForm((prev) => ({ ...prev, principalReference: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth select label="Customer" value={accountForm.customerId} onChange={(event) => setAccountForm((prev) => ({ ...prev, customerId: event.target.value }))}>
                {customers.map((c) => <MenuItem key={c.customerId} value={c.customerId}>{c.customerId} - {c.customerFullname}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Alias Email" value={accountForm.aliasEmail} onChange={(event) => setAccountForm((prev) => ({ ...prev, aliasEmail: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth select label="Status" value={accountForm.accountStatus} onChange={(event) => setAccountForm((prev) => ({ ...prev, accountStatus: event.target.value }))}>
                {accountStatusOptions.map((it) => <MenuItem key={it} value={it}>{it}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label="Expiration Date" InputLabelProps={{ shrink: true }} value={accountForm.expirationDate} onChange={(event) => setAccountForm((prev) => ({ ...prev, expirationDate: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label="Renewal Date" InputLabelProps={{ shrink: true }} value={accountForm.renewalDate} onChange={(event) => setAccountForm((prev) => ({ ...prev, renewalDate: event.target.value }))} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={Boolean(accountForm.allowDistribution)} onChange={(_, checked) => setAccountForm((prev) => ({ ...prev, allowDistribution: checked }))} />} label="Allow Distribution" /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Notes" value={accountForm.notes} onChange={(event) => setAccountForm((prev) => ({ ...prev, notes: event.target.value }))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccountModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveAccount} disabled={accountSaving}>{accountSaving ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
