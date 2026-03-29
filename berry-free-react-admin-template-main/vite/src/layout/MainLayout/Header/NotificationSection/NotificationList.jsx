import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

function ListItemWrapper({ children, onClick }) {
  const theme = useTheme();

  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Box
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

function severityMeta(level, t) {
  const value = String(level || '').toUpperCase();
  if (value === 'CRITICAL') return { label: t('headerNotifications.severity.critical'), color: 'error' };
  if (value === 'HIGH') return { label: t('headerNotifications.severity.high'), color: 'warning' };
  if (value === 'MEDIUM') return { label: t('headerNotifications.severity.medium'), color: 'info' };
  if (value === 'LOW') return { label: t('headerNotifications.severity.low'), color: 'default' };
  return { label: t('headerNotifications.severity.info'), color: 'default' };
}

function typeAvatar(type) {
  const value = String(type || '').toUpperCase();
  if (value.includes('LICENCIA')) {
    return { icon: <VpnKeyOutlinedIcon fontSize="small" />, color: 'primary.dark', bg: 'primary.light' };
  }
  if (value.includes('SUSCRIP')) {
    return { icon: <ReceiptLongOutlinedIcon fontSize="small" />, color: 'success.dark', bg: 'success.light' };
  }
  if (value.includes('LÍNEA') || value.includes('LINEA') || value.includes('LINE')) {
    return { icon: <RouterOutlinedIcon fontSize="small" />, color: 'info.dark', bg: 'info.light' };
  }
  if (value.includes('MANAGED')) {
    return { icon: <MailOutlineOutlinedIcon fontSize="small" />, color: 'secondary.dark', bg: 'secondary.light' };
  }
  if (value.includes('FACTURA') || value.includes('COMPROMISO')) {
    return { icon: <PriceCheckOutlinedIcon fontSize="small" />, color: 'warning.dark', bg: 'warning.light' };
  }
  return { icon: <WarningAmberOutlinedIcon fontSize="small" />, color: 'text.primary', bg: 'grey.200' };
}

function LoadingRows() {
  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Stack key={`loading-${index}`} spacing={0.8}>
          <Skeleton variant="text" width="78%" />
          <Skeleton variant="text" width="56%" />
          <Skeleton variant="rounded" height={26} />
        </Stack>
      ))}
    </Stack>
  );
}

export default function NotificationList({ notifications, loading, onOpenItem }) {
  const { t } = useTranslation();
  const containerSX = { gap: 1, pl: 7 };

  if (loading && notifications.length === 0) {
    return <LoadingRows />;
  }

  if (!loading && notifications.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="success" variant="outlined">
          {t('headerNotifications.empty')}
        </Alert>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', maxWidth: { xs: '100%', md: 420 }, py: 0 }}>
      {notifications.map((item) => {
        const severity = severityMeta(item.severity, t);
        const avatar = typeAvatar(item.type);
        return (
          <ListItemWrapper key={item.key || `${item.type}-${item.entityId}`} onClick={() => onOpenItem?.(item)}>
            <ListItem alignItems="center" disablePadding>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: avatar.color,
                    bgcolor: avatar.bg
                  }}
                >
                  {avatar.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                    {item.reference || `${item.type} #${item.entityId ?? '-'}`}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {t('headerNotifications.labels.customer')}: {item.customerName || '-'}
                  </Typography>
                }
              />
            </ListItem>
            <Stack sx={containerSX}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={item.type || t('headerNotifications.labels.alert')} color="primary" variant="outlined" size="small" />
                <Chip label={severity.label} color={severity.color} variant="outlined" size="small" />
                {item.status ? <Chip label={item.status} color="default" variant="outlined" size="small" /> : null}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                {item.detail || t('headerNotifications.labels.reviewPending')}
              </Typography>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenItem?.(item);
                  }}
                >
                  {t('headerNotifications.labels.open')}
                </Button>
              </Stack>
            </Stack>
          </ListItemWrapper>
        );
      })}
    </List>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.string,
      route: PropTypes.string,
      entityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reference: PropTypes.string,
      customerName: PropTypes.string,
      status: PropTypes.string,
      detail: PropTypes.string,
      severity: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  onOpenItem: PropTypes.func
};

NotificationList.defaultProps = {
  notifications: [],
  loading: false,
  onOpenItem: null
};

ListItemWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

ListItemWrapper.defaultProps = {
  onClick: null
};
