import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useAuth from 'hooks/useAuth';

export default function ResellerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: '#050505', color: '#fff' }}>
      <Stack
        direction="row"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 1.5,
          bgcolor: 'rgba(5,5,5,0.94)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <Stack spacing={0}>
          <Typography variant="h3" sx={{ color: '#fff', lineHeight: 1 }}>
            Reseller Portal
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
            {user?.email || user?.name || 'Reseller'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/liontv/dashboard')}>
            Sales Admin
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Salir
          </Button>
        </Stack>
      </Stack>
      <Outlet />
    </Box>
  );
}
