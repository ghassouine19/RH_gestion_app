import {styled} from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Stack, useTheme } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {useNavigate} from "react-router-dom";


const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));


const TopBarDash = ({open,handleDrawerOpen,setMode})=>{

    const theme = useTheme();

    const navigate = useNavigate();


    return(
        <AppBar position="fixed" open={open} sx={{background : "#A020F0"}}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                        {
                            marginRight: 5,
                        },
                        open && { display: 'none' },
                    ]}
                >
                    <MenuIcon />
                </IconButton>


                <Box flexGrow={1}/>
                <Stack direction={"row"} >
                    {theme.palette.mode=== "light"?(
                            <IconButton color='inherit' onClick={()=>{
                                localStorage.setItem("modeColor",theme.palette.mode==="light" ? "dark" : "light");
                                setMode((prevMode)=> prevMode=== "light" ? "dark" : "light")
                            }}>
                                <LightModeOutlinedIcon/>
                            </IconButton> )
                        : (
                            <IconButton color='inherit' onClick={()=>{
                                localStorage.setItem("modeColor",theme.palette.mode==="dark" ? "light" : "dark");
                                setMode((prevMode)=> prevMode === "dark"? "light" : "dark");
                            }}>
                                <DarkModeOutlinedIcon/>
                            </IconButton>)
                    }



                    <IconButton color='inherit' >
                        <NotificationsNoneOutlinedIcon/>
                    </IconButton>
                    <IconButton color='inherit' onClick={() => {
                        navigate("/user/profile");
                    }}>
                        <PersonOutlineOutlinedIcon/>
                    </IconButton>
                </Stack>


            </Toolbar>
        </AppBar>
    );
}
export default TopBarDash;