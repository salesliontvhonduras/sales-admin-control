import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

import LionMetricCard from 'ui-component/cards/LionMetricCard';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveListSection from 'ui-component/responsive/ResponsiveListSection';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';

function buildInitialForm(fields) {
  return fields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
      acc[field.name] = field.defaultValue;
      return acc;
    }

    acc[field.name] = field.type === 'switch' ? false : '';
    return acc;
  }, {});
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  return String(value);
}

function normalizePayload(fields, formState) {
  return fields.reduce((acc, field) => {
    const value = formState[field.name];

    if (field.type === 'switch') {
      acc[field.name] = Boolean(value);
      return acc;
    }

    if (field.type === 'number') {
      acc[field.name] = value === '' || value === null || value === undefined ? null : Number(value);
      return acc;
    }

    acc[field.name] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {});
}

function mapRowToForm(fields, row) {
  return fields.reduce((acc, field) => {
    acc[field.name] = row?.[field.name] ?? (field.type === 'switch' ? false : '');
    return acc;
  }, {});
}

function matchesSearch(row, searchFields, term) {
  if (!term) return true;

  return searchFields.some((field) => {
    const value = typeof field === 'function' ? field(row) : row?.[field];
    return String(value ?? '')
      .toLowerCase()
      .includes(term);
  });
}

export default function CatalogCrudPage({
  title,
  subtitle,
  helperText,
  entityLabel,
  createLabel,
  searchPlaceholder,
  api,
  idField,
  titleField,
  subtitleField,
  searchFields,
  fields,
  columns,
  summaryFields = [],
  sortRows,
  metricCards,
  statusField = null,
  statusLabel = 'Estado',
  dialogMaxWidth = 'md'
}) {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const requestConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${accessToken}` } }), [accessToken]);
  const initialFormState = useMemo(() => buildInitialForm(fields), [fields]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogState, setDialogState] = useState({ open: false, row: null });
  const [deleteState, setDeleteState] = useState({ open: false, row: null });
  const [formState, setFormState] = useState(initialFormState);

  const loadRows = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await api.list(requestConfig);
      const items = Array.isArray(response) ? response : [];
      setRows(items);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || `No se pudo cargar ${entityLabel}.`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, api, enqueueSnackbar, entityLabel, requestConfig]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const sortedRows = useMemo(() => {
    const items = [...rows];
    if (typeof sortRows === 'function') {
      items.sort(sortRows);
      return items;
    }

    items.sort((a, b) => String(a?.[titleField] || '').localeCompare(String(b?.[titleField] || '')));
    return items;
  }, [rows, sortRows, titleField]);

  const filteredRows = useMemo(() => {
    const term = String(search || '').trim().toLowerCase();

    return sortedRows.filter((row) => {
      if (statusField && statusFilter === 'ACTIVE' && !row?.[statusField]) return false;
      if (statusField && statusFilter === 'INACTIVE' && row?.[statusField]) return false;
      return matchesSearch(row, searchFields, term);
    });
  }, [rows, search, searchFields, sortedRows, statusField, statusFilter]);

  const metrics = useMemo(() => {
    if (typeof metricCards === 'function') {
      return metricCards(rows);
    }

    if (statusField) {
      const active = rows.filter((row) => Boolean(row?.[statusField])).length;
      return [
        { title: 'Total', value: rows.length, helper: `${entityLabel} registrados`, color: 'primary' },
        { title: 'Activos', value: active, helper: 'Disponibles', color: 'success' },
        { title: 'Inactivos', value: rows.length - active, helper: 'Ocultos o deshabilitados', color: 'default' }
      ];
    }

    return [{ title: 'Total', value: rows.length, helper: `${entityLabel} registrados`, color: 'primary' }];
  }, [entityLabel, metricCards, rows, statusField]);

  const openCreate = () => {
    setFormState(initialFormState);
    setDialogState({ open: true, row: null });
  };

  const openEdit = (row) => {
    setFormState(mapRowToForm(fields, row));
    setDialogState({ open: true, row });
  };

  const closeDialog = () => {
    setDialogState({ open: false, row: null });
    setFormState(initialFormState);
  };

  const handleChange = (field, value) => {
    setFormState((current) => ({ ...current, [field.name]: value }));
  };

  const handleSubmit = async () => {
    const payload = normalizePayload(fields, formState);

    setSaving(true);
    try {
      if (dialogState.row) {
        await api.update(dialogState.row[idField], payload, requestConfig);
        enqueueSnackbar(`${entityLabel} actualizado correctamente.`, { variant: 'success' });
      } else {
        await api.create(payload, requestConfig);
        enqueueSnackbar(`${entityLabel} creado correctamente.`, { variant: 'success' });
      }

      closeDialog();
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || `No se pudo guardar ${entityLabel}.`, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteState.row) return;

    setSaving(true);
    try {
      await api.remove(deleteState.row[idField], requestConfig);
      enqueueSnackbar(`${entityLabel} eliminado correctamente.`, { variant: 'success' });
      setDeleteState({ open: false, row: null });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || `No se pudo eliminar ${entityLabel}.`, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1440, mx: 'auto' }}>
      <MainCard
        title={title}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openCreate}>
              {createLabel || `Nuevo ${entityLabel}`}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2}>
          {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
          {helperText ? <Alert severity="info">{helperText}</Alert> : null}

          <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: Math.min(4, Math.max(1, metrics.length)) }}>
            {metrics.map((metric) => (
              <LionMetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                helper={metric.helper}
                color={metric.color || 'primary'}
              />
            ))}
          </ResponsiveMetricGrid>
        </Stack>
      </MainCard>

      <MainCard title={null}>
        <ResponsiveFilters paperSx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
          />
          {statusField ? (
            <TextField
              select
              size="small"
              label={statusLabel}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ACTIVE">Activos</MenuItem>
              <MenuItem value="INACTIVE">Inactivos</MenuItem>
            </TextField>
          ) : null}
        </ResponsiveFilters>

        {loading ? <LinearProgress sx={{ mb: 2 }} /> : null}

        <ResponsiveListSection
          isMobile={isMobile}
          desktopContent={
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align || 'left'}>
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.length ? (
                    filteredRows.map((row) => (
                      <TableRow hover key={row[idField]}>
                        {columns.map((column) => (
                          <TableCell key={column.key} align={column.align || 'left'}>
                            {column.render ? column.render(row) : formatValue(row[column.key])}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          <ResponsiveActionBar justifyContent="flex-end" sx={{ '& > .MuiButton-root': { minWidth: 0 } }}>
                            <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEdit(row)}>
                              Editar
                            </Button>
                            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setDeleteState({ open: true, row })}>
                              Eliminar
                            </Button>
                          </ResponsiveActionBar>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1}>
                        <Typography color="text.secondary">No hay registros para mostrar.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          }
          mobileContent={
            <Stack spacing={1.5}>
              {filteredRows.length ? (
                filteredRows.map((row) => (
                  <MobileSummaryCard
                    key={row[idField]}
                    title={row[titleField]}
                    subtitle={typeof subtitleField === 'function' ? subtitleField(row) : formatValue(row?.[subtitleField])}
                    chips={(typeof columns.find((column) => column.key === statusField)?.render === 'function' &&
                      statusField &&
                      [columns.find((column) => column.key === statusField).render(row)]) ||
                      []}
                    actions={
                      <ResponsiveActionBar justifyContent="flex-start">
                        <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => openEdit(row)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setDeleteState({ open: true, row })}>
                          Eliminar
                        </Button>
                      </ResponsiveActionBar>
                    }
                  >
                    {summaryFields.length ? (
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
                        {summaryFields.map((field) => (
                          <Box key={field.label} sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary">
                              {field.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                              {field.render ? field.render(row) : formatValue(row[field.key])}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : null}
                  </MobileSummaryCard>
                ))
              ) : (
                <Alert severity="info">No hay registros para mostrar.</Alert>
              )}
            </Stack>
          }
        />
      </MainCard>

      <Dialog open={dialogState.open} onClose={closeDialog} fullScreen={isMobile} fullWidth maxWidth={dialogMaxWidth}>
        <DialogTitleWithClose onClose={closeDialog}>
          <Stack spacing={0.35}>
            <Typography variant="h3">{dialogState.row ? `Editar ${entityLabel}` : createLabel || `Nuevo ${entityLabel}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              Completa la información del catálogo.
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              '& .MuiTextField-root': {
                width: '100%'
              }
            }}
          >
            {fields.map((field) => {
              const value = formState[field.name];
              const fullWidth = field.fullWidth || field.type === 'switch';

              if (field.type === 'switch') {
                return (
                  <Box key={field.name} sx={{ gridColumn: '1 / -1' }}>
                    <FormControlLabel
                      control={<Switch checked={Boolean(value)} onChange={(event) => handleChange(field, event.target.checked)} />}
                      label={field.label}
                    />
                  </Box>
                );
              }

              if (field.type === 'select') {
                return (
                  <TextField
                    key={field.name}
                    select
                    size="small"
                    label={field.label}
                    value={value ?? ''}
                    onChange={(event) => handleChange(field, event.target.value)}
                    required={field.required}
                    helperText={field.helperText}
                    disabled={Boolean(dialogState.row && field.disabledOnEdit)}
                    sx={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}
                  >
                    {(field.options || []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }

              return (
                <TextField
                  key={field.name}
                  size="small"
                  type={field.type === 'number' ? 'number' : 'text'}
                  label={field.label}
                  value={value ?? ''}
                  onChange={(event) => handleChange(field, event.target.value)}
                  required={field.required}
                  helperText={field.helperText}
                  multiline={Boolean(field.multiline)}
                  minRows={field.multiline ? 3 : undefined}
                  disabled={Boolean(dialogState.row && field.disabledOnEdit)}
                  sx={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            borderTop: '1px solid',
            borderColor: 'divider',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > .MuiButton-root': {
              width: { xs: '100%', sm: 'auto' }
            }
          }}
        >
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : dialogState.row ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteState.open} onClose={() => setDeleteState({ open: false, row: null })} fullWidth maxWidth="xs">
        <DialogTitleWithClose onClose={() => setDeleteState({ open: false, row: null })}>
          <Typography variant="h3">Eliminar {entityLabel}</Typography>
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography color="text.secondary">
            {`¿Eliminar ${deleteState.row?.[titleField] || entityLabel}? Esta acción no se puede deshacer.`}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > .MuiButton-root': { width: { xs: '100%', sm: 'auto' } }
          }}
        >
          <Button onClick={() => setDeleteState({ open: false, row: null })}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
            {saving ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
