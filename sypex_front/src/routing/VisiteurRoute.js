
import NavBarFooterLT from "../layout/NavbarFooterLT";
import HomePage from "../pages/HomePage";



export const VisiteurRoute = [

    {
        element : <NavBarFooterLT/>,
        children : [
            {
                path : "/",
                element : <HomePage/>
            }
        ]
    }
];