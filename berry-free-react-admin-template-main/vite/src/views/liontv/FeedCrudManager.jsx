import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import MainCard from 'ui-component/cards/MainCard';
import { lionTvApi } from 'utils/api';

function normalizeFeed(item = {}) {
  return {
    id: item.id ?? null,
    payloadJson: item.payloadJson ?? item.payload_json ?? '',
    publishedAt: item.publishedAt ?? item.published_at ?? null,
    active: Boolean(item.active ?? item.isActive ?? item.is_active ?? false),
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function toInputDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }
  return String(value).slice(0, 16);
}

function payloadPreview(payload) {
  const normalized = String(payload || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '-';
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}

function FeedRowActions({ row, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
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
            onEdit?.(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#1e88e5' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

const defaultForm = {
  id: null,
  payloadJson: '',
  publishedAt: '',
  active: true
};

export default function FeedCrudManager({
  title,
  endpointBase,
  createButtonLabel,
  emptyMessage,
  createSuccessMessage,
  updateSuccessMessage,
  deleteSuccessMessage
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadRows = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await lionTvApi.get(`${endpointBase}/v1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload?.data ?? payload?.items ?? payload?.content ?? [];
      const normalized = (Array.isArray(collection) ? collection : []).map(normalizeFeed);
      setRows(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo cargar la información.', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, endpointBase, enqueueSnackbar]);

  useEffect(() => {
    loadRows();
  }, [loadRows, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      return (
        String(row.id ?? '').toLowerCase().includes(term) ||
        String(row.payloadJson ?? '').toLowerCase().includes(term) ||
        String(row.publishedAt ?? '').toLowerCase().includes(term) ||
        String(row.active ?? '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const resetForm = () => setForm(defaultForm);

  const validatePayloadJson = (payloadJson) => {
    if (!payloadJson?.trim()) {
      enqueueSnackbar('payloadJson es obligatorio.', { variant: 'warning' });
      return false;
    }
    try {
      JSON.parse(payloadJson);
      return true;
    } catch (error) {
      enqueueSnackbar('payloadJson debe ser un JSON válido.', { variant: 'warning' });
      return false;
    }
  };

  const buildRequestPayload = (source) => {
    const publishedAt = source.publishedAt
      ? source.publishedAt.length === 16
        ? `${source.publishedAt}:00`
        : source.publishedAt
      : null;

    return {
      payloadJson: source.payloadJson.trim(),
      publishedAt,
      active: Boolean(source.active)
    };
  };

  const handleSave = async () => {
    if (!validatePayloadJson(form.payloadJson)) return;

    setSending(true);
    try {
      const payload = buildRequestPayload(form);
      if (form.id) {
        await lionTvApi.put(`${endpointBase}/v1/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(updateSuccessMessage, { variant: 'success' });
      } else {
        await lionTvApi.post(`${endpointBase}/v1`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(createSuccessMessage, { variant: 'success' });
      }

      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar el registro.', { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const id = openDelete.row?.id;
    if (!id) {
      setOpenDelete({ open: false, row: null });
      return;
    }

    setSending(true);
    try {
      await lionTvApi.delete(`${endpointBase}/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(deleteSuccessMessage, { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar el registro.', { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      payloadJson: row.payloadJson || '',
      publishedAt: toInputDateTime(row.publishedAt),
      active: Boolean(row.active)
    });
    setOpenModal(true);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={title}
        secondary={
          <Stack direction="row" spacing={1.25}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
            >
              {createButtonLabel}
            </Button>
          </Stack>
        }
      >
        <TextField
          size="small"
          placeholder="Search by ID, JSON content, date or active state"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Payload Preview</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    {Array.from({ length: 7 }).map((__, cidx) => (
                      <TableCell key={cidx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                paginatedRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{formatDateTime(row.publishedAt)}</TableCell>
                    <TableCell>
                      <Chip size="small" color={row.active ? 'success' : 'default'} label={row.active ? 'Yes' : 'No'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{payloadPreview(row.payloadJson)}</Typography>
                    </TableCell>
                    <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(row.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <FeedRowActions row={row} onEdit={handleEdit} onDelete={(selected) => setOpenDelete({ open: true, row: selected })} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </MainCard>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>{form.id ? 'Edit Record' : 'Create Record'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Payload JSON"
              value={form.payloadJson}
              onChange={(e) => setForm((prev) => ({ ...prev, payloadJson: e.target.value }))}
              multiline
              minRows={8}
              placeholder='{"draw":1,"recordsTotal":1,"recordsFiltered":1,"data":[[]]}'
              fullWidth
            />
            <TextField
              label="Published At"
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={Boolean(form.active)} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />}
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={sending}>
            {sending ? 'Saving...' : form.id ? 'Save changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} fullWidth maxWidth="xs">
        <DialogTitle>Delete Record</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Are you sure you want to delete this record? ID: <strong>{openDelete.row?.id ?? '-'}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={sending}>
            {sending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
