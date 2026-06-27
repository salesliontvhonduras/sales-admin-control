import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { getUserPermissions } from 'utils/rbac';
import {
  createYoutubePremiumAccount,
  getYoutubePremiumDashboard,
  getYoutubePremiumWallet,
  getYoutubePremiumWalletLedger,
  listYoutubePremiumAccounts,
  listYoutubePremiumChildResellers,
  listYoutubePremiumNotifications,
  listYoutubePremiumSessions,
  markYoutubePremiumNotificationRead,
  renewYoutubePremiumAccount,
  resetYoutubePremiumAccountPassword,
  revokeYoutubePremiumSession,
  transferYoutubePremiumCredits,
  updateYoutubePremiumAccountStatus,
  upsertYoutubePremiumChildReseller
} from 'api/reseller-youtube-premium';
import PortalShell from './components/PortalShell';
import AccountWizardDialog from './dialogs/AccountWizardDialog';
import ChildResellerDialog from './dialogs/ChildResellerDialog';
import ConfirmDialog from './dialogs/ConfirmDialog';
import PasswordDialog from './dialogs/PasswordDialog';
import RenewDialog from './dialogs/RenewDialog';
import TransferCreditsDialog from './dialogs/TransferCreditsDialog';
import CreditsView from './CreditsView';
import DashboardView from './DashboardView';
import NotificationsView from './NotificationsView';
import PremiumAccountsView from './PremiumAccountsView';
import ResellerNetworkView from './ResellerNetworkView';
import SessionsView from './SessionsView';
import { backendMessage, isSuperReseller } from './constants';

const initialAccountFilters = { search: '', status: '' };
const initialSessionFilters = { search: '', status: 'ACTIVE' };

function idempotencyKey(prefix) {
  const suffix = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now()}-${suffix}`;
}

export default function YoutubePremiumResellerPortal() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const permissions = useMemo(() => getUserPermissions(user), [user]);
  const canSuper = useMemo(() => isSuperReseller(permissions), [permissions]);

  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [network, setNetwork] = useState(null);
  const [accountFilters, setAccountFilters] = useState(initialAccountFilters);
  const [sessionFilters, setSessionFilters] = useState(initialSessionFilters);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [renewAccount, setRenewAccount] = useState(null);
  const [passwordAccount, setPasswordAccount] = useState(null);
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [transferReseller, setTransferReseller] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (activeView === 'network' && !canSuper) setActiveView('dashboard');
  }, [activeView, canSuper]);

  const loadWallet = useCallback(async () => {
    const payload = await getYoutubePremiumWallet();
    setWallet(payload);
    return payload;
  }, []);

  const loadView = useCallback(
    async (view = activeView, options = {}) => {
      const showLoading = options.showLoading !== false;
      if (showLoading) setLoading(true);
      try {
        if (view === 'dashboard') {
          const payload = await getYoutubePremiumDashboard();
          setDashboard(payload);
          if (payload?.wallet || payload?.walletSummary) {
            setWallet(payload.wallet || payload.walletSummary);
          } else {
            await loadWallet();
          }
        }

        if (view === 'accounts') {
          setAccounts(await listYoutubePremiumAccounts({ ...accountFilters, index: 0, size: 80 }));
          await loadWallet();
        }

        if (view === 'sessions') {
          setSessions(await listYoutubePremiumSessions({ ...sessionFilters, index: 0, size: 80 }));
        }

        if (view === 'credits') {
          const [walletPayload, ledgerPayload] = await Promise.all([
            getYoutubePremiumWallet(),
            getYoutubePremiumWalletLedger({ index: 0, size: 80 })
          ]);
          setWallet(walletPayload);
          setLedger(ledgerPayload);
        }

        if (view === 'notifications') {
          setNotifications(await listYoutubePremiumNotifications({ index: 0, size: 80 }));
        }

        if (view === 'network' && canSuper) {
          const [walletPayload, networkPayload] = await Promise.all([
            getYoutubePremiumWallet(),
            listYoutubePremiumChildResellers({ index: 0, size: 80 })
          ]);
          setWallet(walletPayload);
          setNetwork(networkPayload);
        }
      } catch (error) {
        enqueueSnackbar(backendMessage(error, 'No se pudo cargar el portal reseller.'), { variant: 'error' });
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [accountFilters, activeView, canSuper, enqueueSnackbar, loadWallet, sessionFilters]
  );

  useEffect(() => {
    const timer = setTimeout(() => loadView(activeView), activeView === 'accounts' || activeView === 'sessions' ? 250 : 0);
    return () => clearTimeout(timer);
  }, [activeView, loadView]);

  const refreshCurrent = useCallback(() => loadView(activeView), [activeView, loadView]);

  const handleCreateAccount = async (form) => {
    setSaving(true);
    try {
      await createYoutubePremiumAccount(form, idempotencyKey(`ytp-create-${form.email}`));
      enqueueSnackbar('Cuenta Premium creada correctamente.', { variant: 'success' });
      setAccountDialogOpen(false);
      setActiveView('accounts');
      await loadView('accounts', { showLoading: false });
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo crear la cuenta Premium.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRenew = async (form) => {
    if (!renewAccount) return;
    setSaving(true);
    try {
      await renewYoutubePremiumAccount(renewAccount.userId || renewAccount.id || renewAccount.accountId, form, idempotencyKey(`ytp-renew-${renewAccount.userId || renewAccount.id}`));
      enqueueSnackbar('Cuenta renovada correctamente.', { variant: 'success' });
      setRenewAccount(null);
      await loadView(activeView, { showLoading: false });
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo renovar la cuenta.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (password) => {
    if (!passwordAccount) return;
    setSaving(true);
    try {
      await resetYoutubePremiumAccountPassword(passwordAccount.userId || passwordAccount.id || passwordAccount.accountId, password);
      enqueueSnackbar('Contraseña actualizada. Ya puedes copiarla y entregarla al cliente.', { variant: 'success' });
      setPasswordAccount(null);
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo actualizar la contraseña.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const requestToggleAccount = (account) => {
    const active = account?.active !== false;
    setConfirmAction({
      title: active ? 'Suspender cuenta Premium' : 'Activar cuenta Premium',
      message: active
        ? 'La cuenta dejará de poder iniciar sesión hasta que vuelva a activarse.'
        : 'La cuenta volverá a estar disponible para el cliente.',
      confirmLabel: active ? 'Suspender' : 'Activar',
      confirmColor: active ? 'warning' : 'success',
      run: async () => {
        await updateYoutubePremiumAccountStatus(account.userId || account.id || account.accountId, !active);
        enqueueSnackbar('Estado de cuenta actualizado.', { variant: 'success' });
        await loadView(activeView, { showLoading: false });
      }
    });
  };

  const requestDisconnectSession = (session) => {
    setConfirmAction({
      title: 'Desconectar sesión',
      message: 'Esta acción corta la sesión activa, pero no desvincula el dispositivo de la licencia.',
      confirmLabel: 'Desconectar',
      confirmColor: 'error',
      run: async () => {
        await revokeYoutubePremiumSession(session.sessionId || session.id);
        enqueueSnackbar('Sesión desconectada.', { variant: 'success' });
        await loadView(activeView, { showLoading: false });
      }
    });
  };

  const runConfirmAction = async () => {
    if (!confirmAction?.run) return;
    setSaving(true);
    try {
      await confirmAction.run();
      setConfirmAction(null);
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo completar la acción.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkNotificationRead = async (notification) => {
    const id = notification.notificationId || notification.id;
    if (!id) return;
    try {
      await markYoutubePremiumNotificationRead(id);
      enqueueSnackbar('Notificación marcada como leída.', { variant: 'success' });
      await loadView('notifications', { showLoading: false });
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo actualizar la notificación.'), { variant: 'error' });
    }
  };

  const handleCreateChild = async (form) => {
    setSaving(true);
    try {
      await upsertYoutubePremiumChildReseller({ ...form, resellerType: 'RESELLER' });
      enqueueSnackbar('Reseller hijo guardado.', { variant: 'success' });
      setChildDialogOpen(false);
      await loadView('network', { showLoading: false });
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudo guardar el reseller hijo.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleTransferCredits = async (credits) => {
    if (!transferReseller) return;
    setSaving(true);
    try {
      await transferYoutubePremiumCredits(transferReseller.username, {
        credits: Number(credits),
        reason: 'Transferencia YouTube Premium'
      });
      enqueueSnackbar('Créditos transferidos correctamente.', { variant: 'success' });
      setTransferReseller(null);
      await loadView('network', { showLoading: false });
    } catch (error) {
      enqueueSnackbar(backendMessage(error, 'No se pudieron transferir los créditos.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const renderView = () => {
    if (activeView === 'accounts') {
      return (
        <PremiumAccountsView
          accounts={accounts}
          filters={accountFilters}
          loading={loading}
          onCreateAccount={() => setAccountDialogOpen(true)}
          onFilterChange={setAccountFilters}
          onRenew={setRenewAccount}
          onResetPassword={setPasswordAccount}
          onToggleAccount={requestToggleAccount}
        />
      );
    }

    if (activeView === 'sessions') {
      return (
        <SessionsView
          filters={sessionFilters}
          loading={loading}
          onDisconnect={requestDisconnectSession}
          onFilterChange={setSessionFilters}
          sessions={sessions}
        />
      );
    }

    if (activeView === 'credits') {
      return (
        <CreditsView
          ledger={ledger}
          wallet={wallet}
          onRequestTopUp={() =>
            enqueueSnackbar('La solicitud de recarga requiere endpoint backend. La UI ya queda preparada para conectarlo.', {
              variant: 'info'
            })
          }
        />
      );
    }

    if (activeView === 'notifications') {
      return <NotificationsView notifications={notifications} onMarkRead={handleMarkNotificationRead} />;
    }

    if (activeView === 'network' && canSuper) {
      return (
        <ResellerNetworkView
          network={network}
          onCreateChild={() => setChildDialogOpen(true)}
          onTransfer={setTransferReseller}
        />
      );
    }

    return (
      <DashboardView
        dashboard={dashboard}
        loading={loading}
        onCreateAccount={() => setAccountDialogOpen(true)}
        onDisconnectSession={requestDisconnectSession}
        onRenew={setRenewAccount}
        onResetPassword={setPasswordAccount}
        onToggleAccount={requestToggleAccount}
        onViewChange={setActiveView}
      />
    );
  };

  return (
    <PortalShell
      activeView={activeView}
      canSuper={canSuper}
      loading={loading}
      onCreateAccount={() => setAccountDialogOpen(true)}
      onRefresh={refreshCurrent}
      onViewChange={setActiveView}
      user={user}
      wallet={wallet}
    >
      {renderView()}

      <AccountWizardDialog
        open={accountDialogOpen}
        onClose={() => setAccountDialogOpen(false)}
        onSubmit={handleCreateAccount}
        saving={saving}
      />

      <RenewDialog
        account={renewAccount}
        open={Boolean(renewAccount)}
        onClose={() => setRenewAccount(null)}
        onSubmit={handleRenew}
        saving={saving}
      />

      <PasswordDialog
        account={passwordAccount}
        open={Boolean(passwordAccount)}
        onClose={() => setPasswordAccount(null)}
        onCopied={() => enqueueSnackbar('Contraseña copiada.', { variant: 'success' })}
        onSubmit={handleResetPassword}
        saving={saving}
      />

      <ChildResellerDialog
        open={childDialogOpen}
        onClose={() => setChildDialogOpen(false)}
        onSubmit={handleCreateChild}
        saving={saving}
      />

      <TransferCreditsDialog
        open={Boolean(transferReseller)}
        reseller={transferReseller}
        wallet={wallet}
        onClose={() => setTransferReseller(null)}
        onSubmit={handleTransferCredits}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        confirmColor={confirmAction?.confirmColor}
        loading={saving}
        onClose={() => setConfirmAction(null)}
        onConfirm={runConfirmAction}
      />
    </PortalShell>
  );
}
