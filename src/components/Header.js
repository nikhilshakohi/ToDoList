//React Tools
import { useState, forwardRef } from 'react';
//Material UI
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, Slide } from '@mui/material';
import { SpeedDial, SpeedDialIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
//Pages
import { useAuth } from '../auth/AuthContext';

const Transition = forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} />; });

const Header = () => {

    const [taskAddDialog, setTaskAddDialog] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState(null); //Anchor El tag in header-menu
    const handleTaskAddDialog = () => { setTaskAddDialog(true); };
    const handleTaskAddDialogClose = () => { setTaskAddDialog(false); };
    const handleOpenMenu = (event) => { setAnchorElNav(event.currentTarget); };//Open Menu
    const handleCloseMenu = () => { setAnchorElNav(null); };//Close Menu
    const currentUser = useAuth() //From AuthContext
    const menuItems = currentUser.currentUser ? ['EXPENSES', 'TASKS', 'PROFILE', 'LOGOUT'] : [''];//Menu Items
    
    return (
        <div>
            {/*Header div*/}
            <AppBar position="static">
                <Toolbar variant="regular">
                    <Box sx={{ flexGrow: 1, display: 'flex', }}>
                        <Typography variant="h5" color="inherit" component="div">Jarvis</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                        {menuItems.map((m) => (<MenuItem key={m}><Typography textAlign="center">{m}</Typography></MenuItem>))}
                    </Box>
                    {/*Responsive Menu Icon*/}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <IconButton edge="end" color="inherit" aria-label="menu" aria-controls="header-menuIcon" aria-haspopup="true" onClick={handleOpenMenu} sx={{ mr: 0 }}><MenuIcon /></IconButton>
                    </Box>
                    <Menu id="header-menuIcon" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                        open={Boolean(anchorElNav)} onClose={handleCloseMenu} sx={{ display: { xs: 'block', md: 'none' }, }}>
                        {menuItems.map((m) => (<MenuItem key={m}><Typography textAlign="center">{m}</Typography></MenuItem>))}
                    </Menu>
                </Toolbar>
            </AppBar>
            {/*Add Button at bottom*/}
            {currentUser.currentUser && <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />} onClick={handleTaskAddDialog}> </SpeedDial> }
            {/*Add Task Dialog*/}
            <Dialog open={taskAddDialog} TransitionComponent={Transition} keepMounted onClose={handleTaskAddDialogClose} aria-describedby="Add Task Form">
                <DialogTitle>{"Add New Task"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="Add Task Form">
                        Task Add date, time, data
                        Tester
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default Header;
