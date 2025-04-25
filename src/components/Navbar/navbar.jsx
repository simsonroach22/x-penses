import React from "react";
import './navbar.css'
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data (if stored)
        navigate("/"); // Redirect to login page
    };
    return(
        <div className="navbar-container">
            <div className="logo-container">
                <div className="logo-container-name">
                    <h1>X-Penses</h1>
                </div>
            </div>
            <div className="logout-button">
                <img src="" alt=""  onClick={ () => navigate('/profile')} />
                <input type="button" value="Logout" onClick={handleLogout}/>
                
            </div>
        </div>
    )
}

export default Navbar;