import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import {
  getCustomerOption,
  getCustomerOptionId,
  getCustomerOptionLabel,
  listCustomerOptions,
  normalizeCustomerOption
} from 'api/liontv-customers';

function mergeSelectedOption(options, selectedOption) {
  if (!selectedOption) return options;
  const selectedId = getCustomerOptionId(selectedOption);
  if (!selectedId) return options;
  if (options.some((option) => String(getCustomerOptionId(option)) === String(selectedId))) {
    return options;
  }
  return [selectedOption, ...options];
}

export default function CustomerAutocomplete({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  error = false,
  size = 'small',
  sx,
  textFieldSx,
  fullWidth = true,
  headers,
  initialOption,
  excludeCustomerId,
  allowClear = true,
  pageSize = 25
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(initialOption ? normalizeCustomerOption(initialOption) : null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const normalizedOptions = useMemo(() => {
    const filtered = excludeCustomerId
      ? options.filter((option) => String(getCustomerOptionId(option)) !== String(excludeCustomerId))
      : options;
    return mergeSelectedOption(filtered, selectedOption);
  }, [excludeCustomerId, options, selectedOption]);

  useEffect(() => {
    if (!initialOption) return;
    const normalized = normalizeCustomerOption(initialOption);
    setSelectedOption(normalized);
    setOptions((prev) => mergeSelectedOption(prev, normalized));
  }, [initialOption]);

  useEffect(() => {
    const selectedId = getCustomerOptionId(selectedOption);
    if (!value) {
      if (selectedOption) setSelectedOption(null);
      return;
    }
    if (selectedId && String(selectedId) === String(value)) return;

    const found = options.find((option) => String(getCustomerOptionId(option)) === String(value));
    if (found) {
      setSelectedOption(found);
      return;
    }

    const controller = new AbortController();
    getCustomerOption(value, { headers, signal: controller.signal })
      .then((customer) => {
        if (!customer) return;
        setSelectedOption(customer);
        setOptions((prev) => mergeSelectedOption(prev, customer));
      })
      .catch(() => {
        // The selector still works when the selected customer cannot be hydrated.
      });

    return () => controller.abort();
  }, [headers, options, selectedOption, value]);

  useEffect(() => {
    if (disabled) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setLoadError('');
      listCustomerOptions({
        search: inputValue.trim(),
        index: 0,
        size: pageSize,
        headers,
        signal: controller.signal
      })
        .then((payload) => {
          setOptions(payload.data || []);
        })
        .catch((err) => {
          if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
          setLoadError(t('customerAutocomplete.loadError', 'No se pudieron cargar los clientes.'));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [disabled, headers, inputValue, pageSize, t]);

  const handleChange = (_, option) => {
    setSelectedOption(option || null);
    const id = option ? getCustomerOptionId(option) : '';
    onChange?.(option || null, id || '');
  };

  return (
    <Autocomplete
      fullWidth={fullWidth}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={normalizedOptions}
      value={selectedOption}
      loading={loading}
      disabled={disabled}
      clearOnBlur={false}
      clearOnEscape={allowClear}
      disableClearable={!allowClear}
      inputValue={inputValue}
      onInputChange={(_, nextValue, reason) => {
        if (reason === 'reset') return;
        setInputValue(nextValue);
      }}
      onChange={handleChange}
      getOptionLabel={getCustomerOptionLabel}
      isOptionEqualToValue={(option, selected) => String(getCustomerOptionId(option)) === String(getCustomerOptionId(selected))}
      filterOptions={(items) => items}
      noOptionsText={
        loadError ||
        (inputValue
          ? t('customerAutocomplete.noResults', 'No hay clientes con esa búsqueda.')
          : t('customerAutocomplete.typeToSearch', 'Escribe para buscar clientes.'))
      }
      sx={sx}
      renderOption={(props, option) => {
        const id = getCustomerOptionId(option);
        const name = option.customerFullname || option.fullName || getCustomerOptionLabel(option);
        const mail = option.customerMail || option.mail;
        const phone = option.customerPhone || option.phone;
        return (
          <Box component="li" {...props} key={id || name}>
            <Stack spacing={0.4} sx={{ minWidth: 0, py: 0.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>
                  {name || t('customerAutocomplete.customerFallback', 'Cliente')}
                </Typography>
                {id ? <Chip size="small" variant="outlined" label={`#${id}`} /> : null}
                {option.status || option.customerStatus ? (
                  <Chip size="small" color="primary" variant="outlined" label={option.status || option.customerStatus} />
                ) : null}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                {[mail, phone].filter(Boolean).join(' · ') || t('customerAutocomplete.noContact', 'Sin correo o teléfono registrado')}
              </Typography>
            </Stack>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label || t('customerAutocomplete.label', 'Buscar cliente')}
          placeholder={placeholder || t('customerAutocomplete.placeholder', 'Nombre, correo, teléfono o ID')}
          size={size}
          error={error}
          helperText={
            loadError ||
            helperText ||
            t('customerAutocomplete.helper', 'Buscar cliente por nombre, correo, teléfono o ID.')
          }
          sx={textFieldSx}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <PersonSearchIcon fontSize="small" color="primary" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
}
