import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
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
          minWidth: 0,
          pr: { xs: 6.5, sm: 6 },
          '& .dialog-title-content': {
            minWidth: 0,
            maxWidth: '100%',
            pr: { xs: 0.5, sm: 0 }
          }
        },
        sx
      ]}
      {...props}
    >
      <Box className="dialog-title-content">{children}</Box>
      <Tooltip title={closeLabel}>
        <span>
          <IconButton
            aria-label={closeLabel}
            onClick={onClose}
            edge="end"
            sx={{
              position: 'absolute',
              right: { xs: 10, sm: 12 },
              top: { xs: 10, sm: '50%' },
              transform: { xs: 'none', sm: 'translateY(-50%)' },
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
  closeButtonSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  closeLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};
