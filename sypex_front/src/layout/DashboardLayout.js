import * as React from 'react';
import { createTheme, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import TopBarDash from '../componants/userComponant/TopBarDash';
import DrawerBar from '../componants/userComponant/DrawerBarDash';
import { ThemeProvider } from '@emotion/react';
import { Outlet } from 'react-router-dom';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


export default function DashBoardLayout() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getDesignToken = (mode) => ({
        palette : {
            mode ,
            ...(mode === 'light'?
                    {
                        //palette value pour light mode

                    }
                    :{
                        //palette value pour dark mode

                    }
            ),

        },
    });
    const [mode , setMode] = React.useState(
        localStorage.getItem("modeColor")?
            localStorage.getItem("modeColor") : "light"
    );
    const theme = React.useMemo(()=>createTheme(getDesignToken(mode)),[mode]);

    return (

        <ThemeProvider theme={theme} >

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopBarDash open={open} handleDrawerOpen={handleDrawerOpen} setMode={setMode}/>

                <DrawerBar open={open} handleDrawerClose={handleDrawerClose}/>

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />

                    {/*contenu afficher ici de chaque page */}
                    <Outlet />


                </Box>
            </Box>

        </ThemeProvider>

    );
}