import React, { useState } from "react";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import { Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: 'red',
  },
  '& .MuiBadge-badge span': {
    color: 'red',
  },
  '& .MuiBadge-badge .MuiBadge-anchorOriginTopRightRectangle .MuiSvgIcon-root': {
    color: 'white',
  },
}));

const NotificationIcon = ({ badgeContent }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverClick = () => {
    handleClose();


    navigate("/getTableData", { state: { badgeContent } })
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <StyledBadge
        badgeContent={badgeContent.count}
        color="secondary"
        onClick={handleClick}
      >
        <NotificationsIcon />
      </StyledBadge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Typography sx={{ padding: '20px' }} onClick={handlePopoverClick}>
          You have {badgeContent.count} non-compliances escalated to you
        </Typography>
      </Popover>
    </>
  );
}

export default NotificationIcon;
