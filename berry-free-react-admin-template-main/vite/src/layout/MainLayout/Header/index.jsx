// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import ResellerCreditsChip from './ResellerCreditsChip';
import ThemeModeSwitcher from 'ui-component/ThemeModeSwitcher';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0, flexShrink: 0 }}>
        <Box component="span" sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .15s ease-in-out',
            color: theme.vars.palette.primary.main,
            background: theme.palette.mode === 'dark' ? theme.vars.palette.surface.muted : theme.vars.palette.surface.sunken,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              color: theme.vars.palette.primary.contrastText,
              background: theme.vars.palette.primary.main
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
        <SearchSection />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: { xs: 0.75, sm: 1 }, minWidth: 0, flexShrink: 0 }}>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ResellerCreditsChip />
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ThemeModeSwitcher compact />
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NotificationSection />
        </Box>
        <ProfileSection />
      </Box>
    </Box>
  );
}
