import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutocompleteIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RefreshIcon from '@mui/icons-material/Refresh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import {
  executeActivation,
  executeRenewal,
  lookupSalesWorkflow,
  previewActivation,
  previewRenewal
} from 'api/liontv-sales-workflow';

const today = () => new Date().toISOString().slice(0, 10);

const plusMonths = (date, months = 1) => {
  const parsed = new Date(`${date || today()}T00:00:00`);
  parsed.setMonth(parsed.getMonth() + months);
  return parsed.toISOString().slice(0, 10);
};

const nowForInput = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const newIdempotencyKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const sectionSx = {
  p: 2,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper'
};

const defaultActivation = () => ({
  customer: {
    customerFullname: '',
    customerMail: '',
    customerPhone: '',
    customerStatus: 'ACTIVE',
    openingDate: today(),
    channel: 'SALES_WORKFLOW'
  },
  line: {
    lineId: '',
    username: '',
    password: '',
    packageId: '',
    packageName: '',
    expDate: plusMonths(today()),
    enabled: true,
    maxConnections: 1,
    provider: 'LION_TV',
    lineCountry: 'GLOBAL'
  },
  linePlus: {
    lineId: '',
    username: '',
    password: '',
    packageId: '',
    packageName: '',
    expDate: plusMonths(today()),
    enabled: true,
    maxConnections: 1,
    provider: 'LION_TV',
    lineCountry: 'GLOBAL'
  },
  subscription: {
    billing: 'MONTHLY',
    amount: '',
    discount: 0,
    status: 'ACTIVE',
    startDate: today(),
    renewalDate: plusMonths(today()),
    packageId: '',
    automaticPay: false,
    linkAutomatic: ''
  },
  invoice: {
    serviceId: 1,
    paymentDate: nowForInput(),
    amountPaid: '',
    amountDiscount: 0,
    loyaltyPointsUsed: 0,
    loyaltyAmountRedeemed: 0,
    status: 'PAID',
    packageId: '',
    paymentMethod: 'Ecommerce',
    bankId: '',
    notes: ''
  },
  licenseCount: 1
});

const defaultRenewal = () => ({
  subscriptionId: '',
  currentDeviceCount: 0,
  desiredDeviceCount: 1,
  renewalBaseMode: '',
  subscription: {
    billing: 'MONTHLY',
    amount: '',
    discount: 0,
    status: 'ACTIVE',
    renewalDate: '',
    packageId: '',
    automaticPay: false,
    linkAutomatic: ''
  },
  invoice: {
    serviceId: 1,
    paymentDate: nowForInput(),
    amountPaid: '',
    amountDiscount: 0,
    loyaltyPointsUsed: 0,
    loyaltyAmountRedeemed: 0,
    status: 'PAID',
    packageId: '',
    paymentMethod: 'Ecommerce',
    bankId: '',
    notes: ''
  }
});

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function cleanMoney(value) {
  const parsed = toNumberOrNull(value);
  return parsed === null ? null : parsed;
}

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function setNestedValue(setState, section, field, value) {
  setState((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
  }));
}

function buildInvoice(invoice, packageId, amount) {
  return {
    ...invoice,
    serviceId: toNumberOrNull(invoice.serviceId) || 1,
    packageId: toNumberOrNull(invoice.packageId) || toNumberOrNull(packageId),
    amountPaid: cleanMoney(invoice.amountPaid) ?? cleanMoney(amount) ?? 0,
    amountDiscount: cleanMoney(invoice.amountDiscount) ?? 0,
    loyaltyPointsUsed: toNumberOrNull(invoice.loyaltyPointsUsed) || 0,
    loyaltyAmountRedeemed: cleanMoney(invoice.loyaltyAmountRedeemed) ?? 0,
    bankId: invoice.paymentMethod === 'Bank Transfer' ? toNumberOrNull(invoice.bankId) : null
  };
}

function buildActivationPayload(form, withIdempotency = false) {
  const packageId = toNumberOrNull(form.subscription.packageId) || toNumberOrNull(form.line.packageId);
  const amount = cleanMoney(form.subscription.amount);
  const licenseCount = Math.max(Number(form.licenseCount || 0), 0);

  return {
    ...(withIdempotency ? { idempotencyKey: newIdempotencyKey() } : {}),
    customer: form.customer,
    line: {
      ...form.line,
      packageId: toNumberOrNull(form.line.packageId),
      maxConnections: toNumberOrNull(form.line.maxConnections) || 1,
      enabled: true
    },
    linePlus: form.linePlus.lineId
      ? {
          ...form.linePlus,
          packageId: toNumberOrNull(form.linePlus.packageId),
          maxConnections: toNumberOrNull(form.linePlus.maxConnections) || 1,
          enabled: true
        }
      : null,
    subscription: {
      ...form.subscription,
      packageId,
      amount: amount ?? 0,
      discount: cleanMoney(form.subscription.discount) ?? 0,
      automaticPay: Boolean(form.subscription.automaticPay)
    },
    invoice: buildInvoice(form.invoice, packageId, amount),
    licenses: Array.from({ length: licenseCount }).map((_, index) => ({
      randomLicense: true,
      name: `Dispositivo ${index + 1}`,
      status: 'ACTIVE',
      isPaid: true,
      price: 0,
      licensePeriod: form.subscription.billing || 'MONTHLY',
      typeLicense: 'STANDARD'
    }))
  };
}

function buildRenewalPayload(form, withIdempotency = false) {
  const packageId = toNumberOrNull(form.subscription.packageId);
  const amount = cleanMoney(form.subscription.amount);
  return {
    ...(withIdempotency ? { idempotencyKey: newIdempotencyKey() } : {}),
    subscriptionId: toNumberOrNull(form.subscriptionId),
    desiredDeviceCount: toNumberOrNull(form.desiredDeviceCount) || 0,
    renewalBaseMode: form.renewalBaseMode || null,
    subscription: {
      ...form.subscription,
      packageId,
      amount: amount ?? 0,
      discount: cleanMoney(form.subscription.discount) ?? 0,
      renewalDate: form.subscription.renewalDate || null,
      automaticPay: Boolean(form.subscription.automaticPay)
    },
    invoice: buildInvoice(form.invoice, packageId, amount),
    newLicenses: []
  };
}

function Section({ title, helper, children }) {
  return (
    <Box sx={sectionSx}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {helper ? (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Box>
  );
}

function PreviewCard({ preview }) {
  if (!preview) return null;

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>
              Resumen antes de confirmar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {preview.customerName || 'Cliente'} · Suscripción {preview.subscriptionId || 'nueva'}
            </Typography>
          </Box>
          <Chip color="primary" label={preview.workflowType === 'RENEWAL' ? 'Renovación' : 'Nueva cuenta'} />
        </Stack>
        <Divider />
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Línea
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {preview.lineId || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Fecha nueva
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {preview.newRenewalDate || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Dispositivos
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {preview.desiredDeviceCount ?? 0} deseados · {preview.additionalLicensesToCreate ?? 0} nuevas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">
              Monto
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {preview.invoiceAmount ?? preview.amount ?? 0}
            </Typography>
          </Grid>
        </Grid>
        {preview.warnings?.length ? (
          <Alert severity="warning">
            <Stack component="ul" sx={{ m: 0, pl: 2 }}>
              {preview.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </Stack>
          </Alert>
        ) : null}
      </Stack>
    </Card>
  );
}

function ResultCard({ result }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  if (!result) return null;

  const copyMessage = async () => {
    const summary = result.summary || {};
    const message = `Hola ${summary.customerName || ''}, tu ${result.workflowType === 'RENEWAL' ? 'renovación' : 'activación'} Lion TV Premium quedó registrada. Nueva fecha: ${summary.newRenewalDate || '-'}.`;
    await navigator.clipboard?.writeText(message);
    enqueueSnackbar('Mensaje copiado para WhatsApp.', { variant: 'success' });
  };

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'success.main' }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={800}>
          Flujo ejecutado
        </Typography>
        <Grid container spacing={1.5}>
          {[
            ['Cliente', result.customerId],
            ['Línea', result.lineId],
            ['Suscripción', result.subscriptionId],
            ['Factura', result.invoiceId],
            ['Licencias nuevas', result.createdLicenseIds?.length || 0]
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {value || '-'}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button size="small" onClick={() => navigate('/liontv/customers')}>
            Abrir clientes
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/subscriptions')}>
            Abrir suscripciones
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/invoices')}>
            Abrir facturas
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/licenses')}>
            Abrir licencias
          </Button>
          <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyMessage}>
            Copiar WhatsApp
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function SalesWorkflowLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [activation, setActivation] = useState(defaultActivation);
  const [renewal, setRenewal] = useState(defaultRenewal);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookup, setLookup] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const selectedSubscription = useMemo(
    () => lookup?.subscriptions?.find((item) => String(item.subscriptionId) === String(renewal.subscriptionId)),
    [lookup?.subscriptions, renewal.subscriptionId]
  );

  const handleLookup = async () => {
    if (!lookupQuery.trim()) return;
    setBusy(true);
    try {
      const response = await lookupSalesWorkflow(lookupQuery.trim());
      setLookup(response || { customers: [], subscriptions: [] });
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo buscar el cliente.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleSelectSubscription = (subscription) => {
    setRenewal({
      ...defaultRenewal(),
      subscriptionId: subscription.subscriptionId,
      currentDeviceCount: subscription.configuredDevices || 0,
      desiredDeviceCount: subscription.configuredDevices || 1,
      subscription: {
        billing: subscription.billing || 'MONTHLY',
        amount: subscription.amount ?? '',
        discount: subscription.discount ?? 0,
        status: 'ACTIVE',
        renewalDate: '',
        packageId: subscription.packageId || '',
        automaticPay: false,
        linkAutomatic: ''
      },
      invoice: {
        ...defaultRenewal().invoice,
        amountPaid: subscription.amount ?? '',
        amountDiscount: subscription.discount ?? 0,
        packageId: subscription.packageId || ''
      }
    });
    setPreview(null);
    setResult(null);
  };

  const handleActivationPreview = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response = await previewActivation(buildActivationPayload(activation));
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo generar el preview.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleActivationExecute = async () => {
    setBusy(true);
    try {
      const response = await executeActivation(buildActivationPayload(activation, true));
      setResult(response);
      setPreview(response?.summary || preview);
      enqueueSnackbar('Nueva cuenta creada correctamente.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo ejecutar la activación.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleRenewalPreview = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response = await previewRenewal(buildRenewalPayload(renewal));
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo generar el preview.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleRenewalExecute = async () => {
    setBusy(true);
    try {
      const response = await executeRenewal(buildRenewalPayload(renewal, true));
      setResult(response);
      setPreview(response?.summary || preview);
      enqueueSnackbar('Renovación ejecutada correctamente.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo ejecutar la renovación.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <MainCard
      title="Ventas y Renovaciones"
      secondary={
        <Button startIcon={<RefreshIcon />} onClick={() => setPreview(null)} disabled={busy}>
          Limpiar preview
        </Button>
      }
    >
      <Stack spacing={3}>
        <Alert severity="info">
          Este wizard simplifica el proceso operativo. El CRUD actual queda disponible para correcciones manuales o casos especiales.
        </Alert>
        <Tabs value={tab} onChange={(_, value) => { setTab(value); setPreview(null); setResult(null); }}>
          <Tab label="Nueva cuenta" icon={<AddCircleOutlineIcon />} iconPosition="start" />
          <Tab label="Renovar cliente" icon={<CreditScoreIcon />} iconPosition="start" />
        </Tabs>

        {tab === 0 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <Section title="Cliente" helper="Datos comerciales mínimos para crear el cliente.">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Nombre completo" sx={fieldSx} value={activation.customer.customerFullname} onChange={(e) => setNestedValue(setActivation, 'customer', 'customerFullname', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Correo" sx={fieldSx} value={activation.customer.customerMail} onChange={(e) => setNestedValue(setActivation, 'customer', 'customerMail', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Teléfono" sx={fieldSx} value={activation.customer.customerPhone} onChange={(e) => setNestedValue(setActivation, 'customer', 'customerPhone', e.target.value)} />
                  </Grid>
                </Grid>
              </Section>
            </Grid>
            <Grid item xs={12} md={6}>
              <Section title="Línea principal" helper="Credenciales y paquete de la línea que quedará asociada.">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Line ID" sx={fieldSx} value={activation.line.lineId} onChange={(e) => setNestedValue(setActivation, 'line', 'lineId', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Usuario línea" sx={fieldSx} value={activation.line.username} onChange={(e) => setNestedValue(setActivation, 'line', 'username', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Password" sx={fieldSx} value={activation.line.password} onChange={(e) => setNestedValue(setActivation, 'line', 'password', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Package ID" type="number" sx={fieldSx} value={activation.line.packageId} onChange={(e) => setNestedValue(setActivation, 'line', 'packageId', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Package name" sx={fieldSx} value={activation.line.packageName} onChange={(e) => setNestedValue(setActivation, 'line', 'packageName', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Expira" type="date" sx={fieldSx} value={activation.line.expDate} onChange={(e) => setNestedValue(setActivation, 'line', 'expDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                  </Grid>
                </Grid>
              </Section>
            </Grid>
            <Grid item xs={12} md={6}>
              <Section title="Plan, pago y factura" helper="Datos que alimentan suscripción y factura inicial.">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Billing" sx={fieldSx} value={activation.subscription.billing} onChange={(e) => setNestedValue(setActivation, 'subscription', 'billing', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Monto" type="number" sx={fieldSx} value={activation.subscription.amount} onChange={(e) => { setNestedValue(setActivation, 'subscription', 'amount', e.target.value); setNestedValue(setActivation, 'invoice', 'amountPaid', e.target.value); }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Package ID" type="number" sx={fieldSx} value={activation.subscription.packageId} onChange={(e) => { setNestedValue(setActivation, 'subscription', 'packageId', e.target.value); setNestedValue(setActivation, 'invoice', 'packageId', e.target.value); }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Inicio" type="date" sx={fieldSx} value={activation.subscription.startDate} onChange={(e) => setNestedValue(setActivation, 'subscription', 'startDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Renueva" type="date" sx={fieldSx} value={activation.subscription.renewalDate} onChange={(e) => { setNestedValue(setActivation, 'subscription', 'renewalDate', e.target.value); setNestedValue(setActivation, 'line', 'expDate', e.target.value); }} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Método de pago" sx={fieldSx} value={activation.invoice.paymentMethod} onChange={(e) => setNestedValue(setActivation, 'invoice', 'paymentMethod', e.target.value)} />
                  </Grid>
                </Grid>
              </Section>
            </Grid>
            <Grid item xs={12} md={6}>
              <Section title="Licencias" helper="Se crean como placeholders externos si todavía no tienes MAC/dispositivo.">
                <TextField fullWidth label="Dispositivos/licencias a crear" type="number" sx={fieldSx} value={activation.licenseCount} onChange={(e) => setActivation((prev) => ({ ...prev, licenseCount: e.target.value }))} />
              </Section>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" startIcon={<AutocompleteIcon />} onClick={handleActivationPreview} disabled={busy}>
                  Vista previa
                </Button>
                <Button variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleActivationExecute} disabled={busy}>
                  Crear todo
                </Button>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4}>
              <Section title="Buscar cliente" helper="Nombre, correo, teléfono, lineId o subscriptionId.">
                <Stack direction="row" spacing={1}>
                  <TextField fullWidth label="Buscar" sx={fieldSx} value={lookupQuery} onChange={(e) => setLookupQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(); }} />
                  <Button variant="contained" startIcon={<PersonSearchIcon />} onClick={handleLookup} disabled={busy}>
                    Buscar
                  </Button>
                </Stack>
                <List dense sx={{ maxHeight: 360, overflow: 'auto' }}>
                  {(lookup?.subscriptions || []).map((subscription) => (
                    <ListItemButton
                      key={subscription.subscriptionId}
                      selected={String(renewal.subscriptionId) === String(subscription.subscriptionId)}
                      onClick={() => handleSelectSubscription(subscription)}
                    >
                      <ListItemText
                        primary={`${subscription.customerName || 'Cliente'} · Sub ${subscription.subscriptionId}`}
                        secondary={`${subscription.lineId || '-'} · ${subscription.packageName || 'Paquete'} · ${subscription.renewalDate || '-'}`}
                      />
                    </ListItemButton>
                  ))}
                  {lookup && !lookup.subscriptions?.length ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      No se encontraron suscripciones para esa búsqueda.
                    </Typography>
                  ) : null}
                </List>
              </Section>
            </Grid>
            <Grid item xs={12} md={8}>
              <Section title="Renovar suscripción" helper="No crea cliente nuevo. Solo actualiza línea/suscripción, factura y licencias faltantes si suben dispositivos.">
                {selectedSubscription ? (
                  <Alert severity="info">
                    Seleccionado: {selectedSubscription.customerName || 'Cliente'} · plan {selectedSubscription.packageName || selectedSubscription.packageId || '-'} · fecha actual {selectedSubscription.renewalDate || '-'}
                  </Alert>
                ) : (
                  <Alert severity="warning">Busca y selecciona una suscripción para renovar.</Alert>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Subscription ID" sx={fieldSx} value={renewal.subscriptionId} disabled />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Dispositivos deseados" type="number" sx={fieldSx} value={renewal.desiredDeviceCount} onChange={(e) => setRenewal((prev) => ({ ...prev, desiredDeviceCount: e.target.value }))} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>Base si venció</InputLabel>
                      <Select label="Base si venció" value={renewal.renewalBaseMode} onChange={(e) => setRenewal((prev) => ({ ...prev, renewalBaseMode: e.target.value }))}>
                        <MenuItem value="">Usar fecha actual</MenuItem>
                        <MenuItem value="TODAY">Desde hoy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Billing" sx={fieldSx} value={renewal.subscription.billing} onChange={(e) => setNestedValue(setRenewal, 'subscription', 'billing', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Package ID" type="number" sx={fieldSx} value={renewal.subscription.packageId} onChange={(e) => { setNestedValue(setRenewal, 'subscription', 'packageId', e.target.value); setNestedValue(setRenewal, 'invoice', 'packageId', e.target.value); }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Renovación manual opcional" type="date" sx={fieldSx} value={renewal.subscription.renewalDate} onChange={(e) => setNestedValue(setRenewal, 'subscription', 'renewalDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Monto" type="number" sx={fieldSx} value={renewal.subscription.amount} onChange={(e) => { setNestedValue(setRenewal, 'subscription', 'amount', e.target.value); setNestedValue(setRenewal, 'invoice', 'amountPaid', e.target.value); }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Descuento" type="number" sx={fieldSx} value={renewal.subscription.discount} onChange={(e) => { setNestedValue(setRenewal, 'subscription', 'discount', e.target.value); setNestedValue(setRenewal, 'invoice', 'amountDiscount', e.target.value); }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Método de pago" sx={fieldSx} value={renewal.invoice.paymentMethod} onChange={(e) => setNestedValue(setRenewal, 'invoice', 'paymentMethod', e.target.value)} />
                  </Grid>
                </Grid>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button variant="outlined" startIcon={<AutocompleteIcon />} onClick={handleRenewalPreview} disabled={busy || !renewal.subscriptionId}>
                    Vista previa
                  </Button>
                  <Button variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleRenewalExecute} disabled={busy || !renewal.subscriptionId}>
                    Renovar
                  </Button>
                </Stack>
              </Section>
            </Grid>
          </Grid>
        )}

        <PreviewCard preview={preview} />
        <ResultCard result={result} />
      </Stack>
    </MainCard>
  );
}
