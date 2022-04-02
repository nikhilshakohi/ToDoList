//React Tools
import { useState } from 'react';
//Material UI
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, Button, DialogTitle } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
//Pages
import { useAuth } from '../auth/AuthContext';

const Header = () => {

    const [anchorElNav, setAnchorElNav] = useState(null); //Anchor El tag in header-menu
    const handleOpenMenu = (event) => { setAnchorElNav(event.currentTarget); };//Open Menu
    const handleCloseMenu = () => { setAnchorElNav(null); };//Close Menu
    const currentUser = useAuth() //From AuthContext
    const menuItems = currentUser.currentUser ? ['PROFILE', 'LOGOUT'] : [''];//Menu Items
    const { logout } = useAuth();
    const [profileDialog, setProfileDialog] = useState(false);
    
    return (
        <div>
            {/*Header div*/}
            <AppBar position="static">
                <Toolbar variant="regular">
                    {/*App Name*/}
                    <Box sx={{ flexGrow: 1, display: 'flex', }}>
                        <Typography variant="h5" color="inherit" component="div">To-Do</Typography>
                    </Box>
                    {/*Menu Bar in desktop*/}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                        {menuItems.map((item) => (<MenuItem key={item}><Typography
                            onClick={item === 'LOGOUT' ? logout : (item==='PROFILE' ? (() => setProfileDialog(true)) : null ) }
                            textAlign="center">{item}</Typography></MenuItem>))}
                    </Box>
                    {/*Menu Bar in Mobile (Icon)*/}
                    {currentUser.currentUser &&
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <IconButton edge="end" color="inherit" aria-label="menu" aria-controls="header-menuIcon" aria-haspopup="true" onClick={handleOpenMenu} sx={{ mr: 0 }}><MenuIcon /></IconButton>
                        </Box>
                    }
                    <Menu id="header-menuIcon" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                        open={Boolean(anchorElNav)} onClose={handleCloseMenu} sx={{ display: { xs: 'block', md: 'none' }, }}>
                        {menuItems.map((item) => (<MenuItem key={item}><Typography
                            onClick={item === 'LOGOUT' ? logout : (item === 'PROFILE' ? (() => setProfileDialog(true)) : null) }
                            textAlign="center">{item}</Typography></MenuItem>))}
                    </Menu>
                    {/*Profile Dialog*/}
                    {
                        profileDialog && currentUser.currentUser &&
                        <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} fullWidth maxWidth='sm' >
                            <DialogTitle>Profile Details</DialogTitle>
                            <DialogContent sx={{mt:2}}>
                                <Typography variant="body1">Name: </Typography><Typography variant="h6" sx={{pb:2}}>{currentUser.currentUser.displayName}</Typography>
                                <Typography variant="body1">Email: </Typography><Typography variant="h6">{currentUser.currentUser.email}</Typography>
                            </DialogContent>
                            <DialogActions sx={{ pb: 2 }}>
                                <Button variant="outlined" color="error" onClick={() => setProfileDialog(false)}>CLOSE</Button>
                            </DialogActions>
                        </Dialog>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
};
export default Header;
