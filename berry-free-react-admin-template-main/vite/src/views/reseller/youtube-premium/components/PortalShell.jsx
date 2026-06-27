import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NAV_ITEMS, formatCreditsFromUnits, walletCreditUnits } from '../constants';
import { colors } from '../styles';

function NavButton({ item, selected, onClick, mobile = false }) {
  const Icon = item.icon;
  return (
    <Button
      onClick={onClick}
      startIcon={!mobile ? <Icon fontSize="small" /> : undefined}
      sx={{
        justifyContent: mobile ? 'center' : 'flex-start',
        flexDirection: mobile ? 'column' : 'row',
        gap: mobile ? 0.5 : 0,
        minWidth: mobile ? 86 : '100%',
        height: mobile ? 58 : 44,
        px: mobile ? 1 : 1.5,
        color: selected ? colors.text : colors.muted,
        bgcolor: selected ? 'rgba(255,255,255,0.09)' : 'transparent',
        border: selected ? `1px solid ${colors.strongBorder}` : '1px solid transparent',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: selected ? 900 : 700,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
      }}
    >
      {mobile ? <Icon fontSize="small" /> : null}
      <Typography component="span" sx={{ fontSize: mobile ? 11 : 13, lineHeight: 1.1, fontWeight: 'inherit' }}>
        {item.label}
      </Typography>
    </Button>
  );
}

export default function PortalShell({
  activeView,
  canSuper,
  children,
  loading,
  onCreateAccount,
  onRefresh,
  onViewChange,
  user,
  wallet
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navItems = NAV_ITEMS.filter((item) => !item.superOnly || canSuper);
  const activeItem = navItems.find((item) => item.value === activeView) || navItems[0];
  const availableCredits = formatCreditsFromUnits(walletCreditUnits(wallet));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.page,
        color: colors.text,
        display: { xs: 'block', md: 'grid' },
        gridTemplateColumns: { md: '264px minmax(0, 1fr)' }
      }}
    >
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          gap: 2,
          position: 'sticky',
          top: 0,
          height: '100vh',
          p: 2,
          bgcolor: colors.sidebar,
          borderRight: `1px solid ${colors.border}`
        }}
      >
        <Box sx={{ px: 1, py: 1 }}>
          <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
            Portal Reseller
          </Typography>
          <Typography variant="h2" sx={{ color: colors.text, fontSize: 22, mt: 0.5 }}>
            YouTube Premium
          </Typography>
        </Box>

        <Stack spacing={0.75}>
          {navItems.map((item) => (
            <NavButton key={item.value} item={item} selected={item.value === activeView} onClick={() => onViewChange(item.value)} />
          ))}
        </Stack>

        <Box sx={{ mt: 'auto', p: 1.5, borderRadius: '8px', bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.dim, fontSize: 12 }}>Saldo disponible</Typography>
          <Typography variant="h2" sx={{ color: colors.text, fontSize: 28 }}>
            {availableCredits}
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 12 }}>créditos</Typography>
        </Box>
      </Box>

      <Box sx={{ minWidth: 0, pb: { xs: 9, md: 0 } }}>
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'rgba(5,5,5,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${colors.border}`,
            px: { xs: 2, sm: 3, lg: 4 },
            py: 1.5
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                {activeItem.label}
              </Typography>
              <Typography variant="h1" sx={{ color: colors.text, fontSize: { xs: 24, sm: 30 }, lineHeight: 1.05 }}>
                Consola YouTube Premium
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
              <Box sx={{ px: 1.5, py: 0.75, borderRadius: '8px', bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
                <Typography sx={{ color: colors.dim, fontSize: 11 }}>Saldo</Typography>
                <Typography sx={{ color: colors.text, fontWeight: 900, lineHeight: 1 }}>{availableCredits}</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={onRefresh}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} /> : <RefreshRoundedIcon />}
                sx={{ color: colors.text, borderColor: colors.border, borderRadius: '8px', minHeight: 40 }}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                onClick={onCreateAccount}
                startIcon={<AddRoundedIcon />}
                sx={{
                  bgcolor: colors.accent,
                  borderRadius: '8px',
                  minHeight: 40,
                  fontWeight: 900,
                  '&:hover': { bgcolor: colors.accentDark }
                }}
              >
                Nueva cuenta
              </Button>
            </Stack>
          </Stack>
          <Typography sx={{ color: colors.dim, fontSize: 12, mt: 1 }}>
            {user?.name || user?.email || 'Reseller'} · sesión reseller aislada
          </Typography>
        </Box>

        <Box component="main" sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, lg: 3 } }}>
          {children}
        </Box>
      </Box>

      {isMobile ? (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            bgcolor: 'rgba(5,5,5,0.96)',
            borderTop: `1px solid ${colors.border}`,
            px: 1,
            py: 1,
            overflowX: 'auto'
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ minWidth: 'max-content' }}>
            {navItems.map((item) => (
              <NavButton
                key={item.value}
                item={item}
                mobile
                selected={item.value === activeView}
                onClick={() => onViewChange(item.value)}
              />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
