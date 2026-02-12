import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    border: '1px solid #FC8018', // 🔶 orange border
    borderRadius: '8px',
  },

  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },

  '& .MuiDialogActions-root': {
    padding: theme.spacing(1.5),
  },
}));

const Popup = ({
  open,
  header,
  footer,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseIcon = true,
  onClose,
}) => {
  const handleClose = () => {
    onClose?.();
  };
  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      {header && (
        <DialogTitle
          sx={{
            m: 0,
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb', // light divider
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          <span>{header}</span>

          {showCloseIcon && (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: '#6b7280',
              }}
            >
              <Icon icon="line-md:close" width="24" height="24" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Body */}
      <DialogContent dividers>{children}</DialogContent>

      {/* Footer */}
      {footer && <DialogActions>{footer}</DialogActions>}
    </StyledDialog>
  );
};

export default Popup;
