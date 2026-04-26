import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import useAuth from 'hooks/useAuth';
import { isResellerConsoleUser } from 'utils/rbac';
import { getResellerWalletSummary } from 'api/liontv-reseller-wallet';

export default function ResellerCreditsChip() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, lionTvViewMode } = useAuth();
  const resellerMode = isResellerConsoleUser(user, lionTvViewMode);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!resellerMode) {
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
  }, [resellerMode]);

  useEffect(() => {
    loadSummary();
    if (!resellerMode) return undefined;

    const intervalId = window.setInterval(loadSummary, 60000);
    return () => window.clearInterval(intervalId);
  }, [loadSummary, resellerMode]);

  if (!resellerMode) return null;

  if (loading && !summary) {
    return <CircularProgress size={22} thickness={5} />;
  }

  const availableCredits = Number(summary?.availableCredits || 0);
  const lowBalance = Boolean(summary?.lowBalance);

  return (
    <Tooltip title={t('headerCredits.tooltip', 'Abre el wallet para solicitar o revisar créditos.')}>
      <Chip
        clickable
        onClick={() => navigate('/liontv/reseller-wallet')}
        icon={<WorkspacePremiumOutlinedIcon />}
        color={lowBalance ? 'warning' : 'primary'}
        variant={lowBalance ? 'filled' : 'outlined'}
        label={t('headerCredits.label', { count: availableCredits, defaultValue: '{{count}} créditos' })}
        sx={{
          fontWeight: 700,
          borderRadius: 2.5,
          px: 0.5,
          maxWidth: { xs: 140, md: 'none' }
        }}
      />
    </Tooltip>
  );
}
