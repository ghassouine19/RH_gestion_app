
import { styled , useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {useEffect, useState} from "react";
import {getUserById} from "../../apiService/getElementApi";


const drawerWidth = 240;



const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DrawerBar =({open,handleDrawerClose})=>{

    const [user,setUser] = useState({nom: "", prenom: "", role: "" })

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                const data = await getUserById(userId);
                setUser(data);
            }
        }
    }, []);

    const role = localStorage.getItem("role") || "";

    const section1 = [
        ...(role === "ADMIN"
            ? [{text : "Gestion des utilisateurs" , icon : <SupervisorAccountIcon />, path : "/admin"}, {text : "Dashboard" , icon : <DashboardIcon />, path : "/admin/dashboard"}]
            : []),
        ...(role === "RESPONSABLE" || role === "ADMIN"
            ? [{text : "Gestion des demandes" , icon : <AdminPanelSettingsIcon />, path : "/respo"}]
            : []),
        {text : "Home" , icon : <HomeIcon />, path : "/user"},
        {text : "Profile" , icon : <BadgeIcon />, path : "/user/profile"},
    ];
    const section2 = [
        ...(role === "ADMIN"
        ? [{text : "Calendrier" , icon : <CalendarMonthIcon />, path : "/user/calendar"}]
        : []),
    ];
    const section3 = [
        {text : "logout", icon :<LogoutIcon/>,path : "/"}
    ];





    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return(
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>

            <Divider />
            <Avatar sx={{mx : "auto",width : open? 88 : 55 , height: open? 88 : 55 ,
                my : 2,border:"1px solid grey",transition : "0.25s"}}
                    alt="Travis Howard"
                    src="/static/images/avatar/2.jpg" />
            <Typography  align='center' sx={{fontSize : open ? 17 : 0 , transition : "0.25s"}}>{user.nom} {user.prenom}</Typography>
            <Typography  align='center' sx={{fontSize : open ? 15 : 0 , transition : "0.25s",color : theme.palette.info.main}}></Typography>


            <Divider />
            <List>
                {section1.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={()=>{navigate(item.path)}}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                bgcolor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                            }}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open
                                        ? {
                                            mr: 3,
                                        }
                                        : {
                                            mr: 'auto',
                                        },
                                ]}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={[
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


            <Divider />
            <List>
                {section2.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={()=>{navigate(item.path)}}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                bgcolor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                            }}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open
                                        ? {
                                            mr: 3,
                                        }
                                        : {
                                            mr: 'auto',
                                        },
                                ]}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={[
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <List>
                {section3.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={()=>{
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                localStorage.removeItem("user");
                                navigate(item.path);
                            }}
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                    bgcolor : location.pathname === item.path ?
                                        theme.palette.mode === "dark"? "#39045A" : "#BFACE2"   : null
                                },
                                open
                                    ? {
                                        justifyContent: 'initial',
                                    }
                                    : {
                                        justifyContent: 'center',
                                    },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open
                                        ? {
                                            mr: 3,
                                        }
                                        : {
                                            mr: 'auto',
                                        },
                                ]}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}

                                sx={[
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Drawer>
    );
}
export default DrawerBar;