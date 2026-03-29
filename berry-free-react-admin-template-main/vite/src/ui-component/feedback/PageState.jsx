import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

export function PageLoadingState({ label }) {
  const { t } = useTranslation();
  const resolvedLabel = label || t('pageState.loading');

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
          {resolvedLabel}
        </Typography>
      </Stack>
    </Box>
  );
}

PageLoadingState.propTypes = {
  label: PropTypes.string
};

export function PageErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  const resolvedMessage = message || t('pageState.error');

  return (
    <Stack spacing={1.5}>
      <Alert severity="error" variant="outlined">
        {resolvedMessage}
      </Alert>
      {onRetry ? (
        <Box>
          <Button variant="outlined" size="small" onClick={onRetry}>
            {t('pageState.retry')}
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

export function PageEmptyState({ message }) {
  const { t } = useTranslation();
  const resolvedMessage = message || t('pageState.empty');

  return (
    <Alert severity="info" variant="outlined">
      {resolvedMessage}
    </Alert>
  );
}

PageEmptyState.propTypes = {
  message: PropTypes.string
};
