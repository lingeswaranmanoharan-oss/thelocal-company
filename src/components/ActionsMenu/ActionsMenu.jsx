import { useState } from 'react';
import { Icon } from '@iconify/react';
import { IconButton, Menu, MenuItem } from '@mui/material';

export const ActionsMenu = ({
  items = [],
  triggerIcon = 'mdi:dots-vertical',
  triggerColor = '#f26522',
  id = 'actions-menu',
  ariaLabel = 'Actions',
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleItemClick = (onClick) => {
    handleClose();
    onClick?.();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        title={ariaLabel}
        aria-label={ariaLabel}
        size="small"
        aria-haspopup="true"
        aria-controls={open ? id : undefined}
      >
        <Icon icon={triggerIcon} color={triggerColor} height={22} />
      </IconButton>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.key ?? index}
            onClick={() => handleItemClick(item.onClick)}
            disabled={item.disabled}
          >
            {item.icon && (
              <Icon icon={item.icon} className="mr-2" style={{ fontSize: 20 }} />
            )}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
