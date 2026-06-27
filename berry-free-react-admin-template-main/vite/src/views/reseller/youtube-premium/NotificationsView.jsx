import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EmptyState from './components/EmptyState';
import StatusBadge from './components/StatusBadge';
import { displayDate, rowsOf } from './constants';
import { colors, surfaceSx } from './styles';

export default function NotificationsView({ notifications, onMarkRead }) {
  const rows = rowsOf(notifications);

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...surfaceSx, p: 2 }}>
        <Typography variant="h2" sx={{ color: colors.text }}>
          Notificaciones
        </Typography>
        <Typography sx={{ color: colors.muted }}>Mensajes operativos enviados por el administrador del producto.</Typography>
      </Paper>

      {rows.length ? (
        <Stack spacing={1.5}>
          {rows.map((item) => {
            const read = item.read === true || String(item.status || '').toUpperCase() === 'READ';
            return (
              <Paper key={item.id || item.notificationId} sx={{ ...surfaceSx, p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}>
                  <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
                    <Box sx={{ width: 38, height: 38, display: 'grid', placeItems: 'center', color: colors.text, bgcolor: colors.surface2, borderRadius: '8px' }}>
                      <NotificationsRoundedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="h4" sx={{ color: colors.text }}>
                          {item.title || 'Notificación'}
                        </Typography>
                        <StatusBadge status={read ? 'READ' : 'UNREAD'} />
                      </Stack>
                      <Typography sx={{ color: colors.muted, mt: 0.5 }}>{item.message || item.body || '-'}</Typography>
                      <Typography sx={{ color: colors.dim, mt: 1, fontSize: 12 }}>{displayDate(item.createdAt || item.sentAt)}</Typography>
                    </Box>
                  </Stack>
                  {!read ? (
                    <Button variant="outlined" startIcon={<MarkEmailReadRoundedIcon />} onClick={() => onMarkRead(item)}>
                      Marcar leída
                    </Button>
                  ) : null}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <EmptyState title="Inbox vacío" text="Las notificaciones enviadas desde Sales Admin aparecerán aquí." />
      )}
    </Stack>
  );
}
