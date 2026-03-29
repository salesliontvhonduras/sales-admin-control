import PropTypes from 'prop-types';

import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

export default function DialogTitleWithClose({ children, onClose, closeLabel = 'Cerrar', sx, closeButtonSx, ...props }) {
  return (
    <DialogTitle
      sx={[
        {
          position: 'relative',
          pr: 6
        },
        sx
      ]}
      {...props}
    >
      {children}
      <Tooltip title={closeLabel}>
        <span>
          <IconButton
            aria-label={closeLabel}
            onClick={onClose}
            edge="end"
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              ...closeButtonSx
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </DialogTitle>
  );
}

DialogTitleWithClose.propTypes = {
  children: PropTypes.node,
  closeButtonSx: PropTypes.object,
  closeLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};
