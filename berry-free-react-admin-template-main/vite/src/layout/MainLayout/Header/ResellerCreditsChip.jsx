import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import useAuth from 'hooks/useAuth';
import { hasPermissionExact } from 'utils/rbac';
import { getResellerWalletSummary } from 'api/liontv-reseller-wallet';

export default function ResellerCreditsChip() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  const canViewWallet = hasPermissionExact(user, {
    any: ['LIONTV_RESELLER_WALLET_VIEW', 'ROLE_LIONTV_RESELLER_WALLET_VIEW', 'ROLE_ADMIN', 'ADMIN']
  });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!canViewWallet) {
      setSummary(null);
      return;
    }

    setLoading(true);
    try {
      const payload = await getResellerWalletSummary({ skipAuthRedirect: true });
      setSummary(payload);
    } catch (_error) {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [canViewWallet]);

  useEffect(() => {
    loadSummary();
    if (!canViewWallet) return undefined;

    const intervalId = window.setInterval(loadSummary, 60000);
    return () => window.clearInterval(intervalId);
  }, [loadSummary, canViewWallet]);

  if (!canViewWallet) return null;

  if (loading && !summary) {
    return <CircularProgress size={20} thickness={5} />;
  }

  const availableCredits = Number(summary?.availableCredits || 0);
  const lowBalance = Boolean(summary?.lowBalance);
  const label = downSM
    ? t('headerCredits.shortLabel', { count: availableCredits, defaultValue: '{{count}} cr' })
    : t('headerCredits.label', { count: availableCredits, defaultValue: '{{count}} créditos' });

  return (
    <Tooltip title={t('headerCredits.tooltip', 'Abre el wallet para solicitar o revisar créditos.')}>
      <Chip
        clickable
        onClick={() => navigate('/liontv/reseller-wallet')}
        icon={<WorkspacePremiumOutlinedIcon />}
        color={lowBalance ? 'warning' : 'primary'}
        variant={lowBalance ? 'filled' : 'outlined'}
        label={label}
        sx={{
          fontWeight: 700,
          borderRadius: 2.5,
          px: downSM ? 0.15 : 0.5,
          minWidth: downSM ? 'auto' : 112,
          maxWidth: downSM ? 94 : 170,
          flexShrink: 0,
          '& .MuiChip-label': {
            px: downSM ? 0.75 : 1.1
          }
        }}
      />
    </Tooltip>
  );
}
