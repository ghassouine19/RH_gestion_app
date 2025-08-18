import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';





const Navbar = ()=>{

    const [menuActive,setMenuActive] =useState(false);
    const changeEtatMenu =()=>{
        setMenuActive(true)
    }
    const closeMenu =()=>{
        setMenuActive(false);
    }

    return(
        <header className="headerContainer">
            <nav className="nav navBar">

                <Link to={"/"} className="navLogo">Sypex</Link>



                <div className="navMenuButton" onClick={changeEtatMenu}>
                    <MenuIcon/>
                </div>

            </nav>
        </header>

    );
};
export default Navbar;