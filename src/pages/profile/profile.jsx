import React from "react";
import './profile.css';
import { useNavigate } from "react-router-dom";


function Profile()  {
    return(
        <div className="profile-container">
            <div className="profile-sidebar"></div>
            <div className="profile-dashboard">
                <div className="profile-picture-container">
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <div className="picture-container">
                        <h1>About me</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, similique?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;