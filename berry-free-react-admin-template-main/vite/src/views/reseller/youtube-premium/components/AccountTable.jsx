import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { accountId, accountName, accountStatus, displayDate, packageLabel, planLabel } from '../constants';
import { colors } from '../styles';
import StatusBadge from './StatusBadge';

export default function AccountTable({ rows = [], onDelete, onDeviceLimit, onRenew, onResetPassword, onToggleStatus }) {
  const [menu, setMenu] = useState({ anchorEl: null, row: null });

  const closeMenu = () => setMenu({ anchorEl: null, row: null });
  const runAction = (handler) => {
    if (menu.row) handler(menu.row);
    closeMenu();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '8px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Cuenta', 'Plan', 'Dispositivos', 'Vencimiento', 'Estado', ''].map((header) => (
                <TableCell key={header} sx={{ color: colors.dim, borderColor: colors.border, fontWeight: 900 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={accountId(row)} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}>
                <TableCell sx={{ borderColor: colors.border }}>
                  <Typography sx={{ color: colors.text, fontWeight: 900 }}>{accountName(row)}</Typography>
                  <Typography sx={{ color: colors.muted, fontSize: 12 }}>{row?.email || '-'}</Typography>
                </TableCell>
                <TableCell sx={{ color: colors.muted, borderColor: colors.border }}>
                  {planLabel(row?.planCode)}
                  <Typography sx={{ color: colors.dim, fontSize: 12 }}>{packageLabel(row?.packageCode)}</Typography>
                </TableCell>
                <TableCell sx={{ color: colors.text, borderColor: colors.border }}>
                  {row?.deviceCount || 0}/{row?.deviceLimit || 1}
                </TableCell>
                <TableCell sx={{ color: colors.text, borderColor: colors.border }}>{displayDate(row?.expiresAt)}</TableCell>
                <TableCell sx={{ borderColor: colors.border }}>
                  <StatusBadge status={accountStatus(row)} />
                </TableCell>
                <TableCell align="right" sx={{ borderColor: colors.border }}>
                  <IconButton onClick={(event) => setMenu({ anchorEl: event.currentTarget, row })} sx={{ color: colors.muted }}>
                    <MoreVertRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={closeMenu}
        PaperProps={{ sx: { bgcolor: colors.surface2, color: colors.text, border: `1px solid ${colors.border}` } }}
      >
        <MenuItem onClick={() => runAction(onRenew)}>
          <RefreshRoundedIcon fontSize="small" style={{ marginRight: 8 }} /> Renovar
        </MenuItem>
        <MenuItem onClick={() => runAction(onResetPassword)}>
          <KeyRoundedIcon fontSize="small" style={{ marginRight: 8 }} /> Reset password
        </MenuItem>
        <MenuItem onClick={() => runAction(onDeviceLimit)}>
          <DevicesRoundedIcon fontSize="small" style={{ marginRight: 8 }} /> Cambiar dispositivos
        </MenuItem>
        <MenuItem onClick={() => runAction(onToggleStatus)}>
          <PowerSettingsNewRoundedIcon fontSize="small" style={{ marginRight: 8 }} />{' '}
          {menu.row?.active === false ? 'Activar' : 'Suspender'}
        </MenuItem>
        <MenuItem onClick={() => runAction(onDelete)} sx={{ color: '#ff6b6b' }}>
          <DeleteRoundedIcon fontSize="small" style={{ marginRight: 8 }} /> Eliminar cuenta
        </MenuItem>
      </Menu>
    </>
  );
}
