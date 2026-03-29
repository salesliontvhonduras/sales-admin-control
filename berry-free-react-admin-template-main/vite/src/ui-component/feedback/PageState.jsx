import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

export function PageLoadingState({ label = 'Cargando datos...' }) {
  return (
    <Box
      sx={{
        minHeight: 220,
        borderRadius: 2.5,
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center">
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}

PageLoadingState.propTypes = {
  label: PropTypes.string
};

export function PageErrorState({ message = 'No se pudo cargar la información.', onRetry }) {
  return (
    <Stack spacing={1.5}>
      <Alert severity="error" variant="outlined">
        {message}
      </Alert>
      {onRetry ? (
        <Box>
          <Button variant="outlined" size="small" onClick={onRetry}>
            Reintentar
          </Button>
        </Box>
      ) : null}
    </Stack>
  );
}

PageErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func
};

export function PageEmptyState({ message = 'No hay datos disponibles para mostrar.' }) {
  return (
    <Alert severity="info" variant="outlined">
      {message}
    </Alert>
  );
}

PageEmptyState.propTypes = {
  message: PropTypes.string
};
