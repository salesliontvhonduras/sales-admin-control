import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';

import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const countryOptions = [
  { code: 'GLOBAL', label: 'Global' },
  { code: 'HN', label: 'Honduras' },
  { code: 'SV', label: 'El Salvador' },
  { code: 'GT', label: 'Guatemala' },
  { code: 'NI', label: 'Nicaragua' },
  { code: 'BZ', label: 'Belice' },
  { code: 'PA', label: 'Panamá' },
  { code: 'CR', label: 'Costa Rica' },
  { code: 'MX', label: 'México' },
  { code: 'AR', label: 'Argentina' },
  { code: 'CA', label: 'Canadá' },
  { code: 'US', label: 'Estados Unidos' },
  { code: 'ES', label: 'España' },
  { code: 'CO', label: 'Colombia' }
];

const statusIcon = {
  ACTIVE: <CheckCircleOutlineIcon fontSize="small" color="success" />,
  ACTIVATED: <CheckCircleOutlineIcon fontSize="small" color="success" />,
  PENDING: <PendingActionsIcon fontSize="small" color="warning" />,
  EXPIRED: <CancelIcon fontSize="small" color="error" />,
  CANCELLED: <CancelIcon fontSize="small" color="error" />
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary.light}24 0%, ${theme.palette.secondary.main}12 45%, #ffffff 100%)`
      : theme.palette.background.default
});

const flagFromCountry = (code = '') => {
  const c = (code || '').toUpperCase();
  const map = {
    HN: '🇭🇳', SV: '🇸🇻', GT: '🇬🇹', NI: '🇳🇮', BZ: '🇧🇿', PA: '🇵🇦', CR: '🇨🇷', MX: '🇲🇽',
    AR: '🇦🇷', CA: '🇨🇦', US: '🇺🇸', ES: '🇪🇸', CO: '🇨🇴'
  };
  return map[c] || '🌐';
};

const countryLabel = (code) => countryOptions.find((c) => c.code === code)?.label || code || 'Global';

export default function PlusLinesSubscriptions() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/plus-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          search: search || undefined,
          country: country || undefined
        },
        skipAuthRedirect: true
      });
      const list = res?.data?.data ?? [];
      setRows(Array.isArray(list) ? list : []);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las líneas plus.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, country, enqueueSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  const grouped = useMemo(() => {
    const map = new Map();
    rows.forEach((item) => {
      const key = item.linePlusId;
      if (!map.has(key)) {
        map.set(key, { linePlusId: key, lineCountry: item.lineCountry, subs: [] });
      }
      map.get(key).subs.push(item);
    });
    return Array.from(map.values());
  }, [rows]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('plusLines.title', 'Líneas Plus y suscripciones')}
        secondary={
          <Stack direction="row" spacing={1.25}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)} sx={{ borderRadius: 2 }}>
              {t('actions.refresh')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[{ label: 'Total líneas plus', value: grouped.length, color: 'primary.main' }, { label: 'Total suscripciones', value: rows.length, color: 'secondary.main' }].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={(theme) => ({
                  ...glassCard(theme),
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                })}
              >
                <Avatar sx={{ bgcolor: item.color, color: '#fff', width: 40, height: 40 }}>{idx === 0 ? '＋' : '∞'}</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard
        title={t('plusLines.filters', 'Buscar')}
        secondary={
          <Paper
            elevation={0}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 520 },
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              background:
                theme.palette.mode === 'light'
                  ? `linear-gradient(120deg, ${theme.palette.primary.light}12 0%, ${theme.palette.secondary.light}12 100%)`
                  : theme.palette.background.paper
            })}
          >
            <TextField
              size="small"
              placeholder={t('plusLines.search', 'Buscar línea plus o cliente')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}>
              <InputLabel>{t('plusLines.country', 'País')}</InputLabel>
              <Select
                value={country}
                label={t('plusLines.country', 'País')}
                onChange={(e) => setCountry(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PublicIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'Todos')}</em>
                </MenuItem>
                {countryOptions.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {flagFromCountry(c.code)} {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        }
      >
        <Grid container spacing={gridSpacing}>
          {loading && (
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="rectangular" height={120} />
              </Stack>
            </Grid>
          )}

          {!loading && grouped.map((group) => (
            <Grid item xs={12} md={6} key={group.linePlusId}>
              <Card
                sx={(theme) => ({
                  ...glassCard(theme),
                  p: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 42, height: 42 }}>{flagFromCountry(group.lineCountry)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {group.linePlusId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {countryLabel(group.lineCountry || 'GLOBAL')}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`${group.subs.length} suscripciones`}
                    color="secondary"
                    sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
                  />
                </Stack>

                <Divider sx={{ mb: 1 }} />

                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('subscriptions.headers.id', 'ID')}</TableCell>
                        <TableCell>{t('subscriptions.headers.customer', 'Cliente')}</TableCell>
                        <TableCell>{t('subscriptions.headers.status', 'Estado')}</TableCell>
                        <TableCell>{t('subscriptions.headers.start', 'Inicio')}</TableCell>
                        <TableCell>{t('subscriptions.headers.renewal', 'Renovación')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.subs.map((sub) => (
                        <TableRow key={sub.subscriptionId} hover>
                          <TableCell>#{sub.subscriptionId}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2">{sub.customerId}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={statusIcon[sub.status] || <PendingActionsIcon fontSize="small" />}
                              label={sub.status}
                              sx={{ fontWeight: 700, borderRadius: 1.5 }}
                            />
                          </TableCell>
                          <TableCell>{sub.startDate || '-'}</TableCell>
                          <TableCell>{sub.renewalDate || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          ))}

          {!loading && grouped.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <LinkIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t('plusLines.empty', 'No hay suscripciones con línea plus')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('plusLines.emptyHint', 'Crea o asigna líneas plus para verlas aquí.')}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
      </MainCard>
    </Box>
  );
}

