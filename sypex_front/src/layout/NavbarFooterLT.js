import { Outlet } from "react-router-dom"
import NavBar from "../componants/homeComponants/Navbar"
import Footer from "../componants/homeComponants/Footer"

const NavBarFooterLT = ()=>{
    return(
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
}
export default NavBarFooterLT;