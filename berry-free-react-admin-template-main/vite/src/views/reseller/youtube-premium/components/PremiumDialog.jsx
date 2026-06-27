import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '../styles';

export default function PremiumDialog({
  open,
  title,
  subtitle,
  children,
  actions,
  onClose,
  maxWidth = 'sm',
  fullScreen = false,
  mobileFullScreen = true
}) {
  const mobileDialog = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const effectiveFullScreen = fullScreen || (mobileFullScreen && mobileDialog);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={effectiveFullScreen}
      PaperProps={{
        sx: {
          bgcolor: colors.surface,
          color: colors.text,
          borderRadius: effectiveFullScreen ? 0 : '8px',
          border: `1px solid ${colors.border}`,
          backgroundImage: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: effectiveFullScreen ? '100dvh' : 'auto',
          maxHeight: effectiveFullScreen ? '100dvh' : 'calc(100% - 48px)',
          m: effectiveFullScreen ? 0 : 2
        }
      }}
      BackdropProps={{
        sx: {
          bgcolor: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(6px)'
        }
      }}
    >
      <DialogTitle sx={{ p: 0, flexShrink: 0, bgcolor: colors.surface }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            minHeight: { xs: 64, sm: 72 },
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h3"
              sx={{
                color: colors.text,
                lineHeight: 1.15,
                fontSize: { xs: 19, sm: 22 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                sx={{
                  color: colors.muted,
                  mt: 0.5,
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            sx={{
              color: colors.text,
              bgcolor: colors.surface2,
              border: `1px solid ${colors.border}`,
              minWidth: 44,
              width: 44,
              height: 44,
              flexShrink: 0,
              '&:hover': { bgcolor: colors.surface3 }
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: { xs: 2, sm: 2.5 },
          bgcolor: colors.surface,
          overscrollBehavior: 'contain'
        }}
      >
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions
          sx={{
            flexShrink: 0,
            p: { xs: 2, sm: 2.5 },
            pt: { xs: 1.5, sm: 2 },
            pb: { xs: 'calc(env(safe-area-inset-bottom) + 16px)', sm: 2.5 },
            bgcolor: 'rgba(16,16,16,0.96)',
            backdropFilter: 'blur(12px)',
            borderTop: `1px solid ${colors.border}`,
            '& .MuiButton-root': {
              minHeight: 44,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 900
            }
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
