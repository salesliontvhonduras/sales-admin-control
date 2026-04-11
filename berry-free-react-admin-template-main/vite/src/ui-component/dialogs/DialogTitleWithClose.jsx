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
          pr: { xs: 7.5, sm: 7.5 },
          minHeight: { xs: 64, sm: 72 },
          display: 'flex',
          alignItems: 'center',
          '& .dialog-title-content': {
            minWidth: 0,
            maxWidth: '100%',
            width: '100%',
            display: 'block',
            pr: { xs: 0.5, sm: 0 }
          }
        },
        sx
      ]}
      {...props}
    >
      <Box className="dialog-title-content">{children}</Box>
      <Tooltip title={closeLabel} placement="left">
        <span style={{ display: 'inline-flex' }}>
          <IconButton
            aria-label={closeLabel}
            onClick={onClose}
            edge="end"
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 36,
              height: 36,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.shadows[0],
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                color: 'text.primary'
              },
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
