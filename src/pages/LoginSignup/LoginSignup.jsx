import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";

function LoginSignup() {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(true);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (!name || !username || !email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("Enter a valid email address");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/signup", {
                name,
                username,
                email,
                password,
            });
            alert(response.data.message);
            setIsSignup(false); // Switch to login after successful signup
        } catch (error) {
            console.error("Error signing up:", error);
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Username and password are required");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", {
                username,
                password,
            });

            if (response.data.success && response.data.userId) {
                localStorage.setItem("userId", response.data.userId);
                navigate("/dashboard");
            } else {
                alert(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            {/* Animated background elements */}
            <div className="bg-animation">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
                <div className="circle circle-4"></div>
            </div>

            <div className="loginsignup-container">
                <div className="auth-header">
                    <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>
                    <p>{isSignup ? "Join us to manage your expenses" : "Log in to continue"}</p>
                </div>

                <div className="auth-form">
                    {isSignup && (
                        <>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>

                    {isSignup && (
                        <div className="input-group password-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className="toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}

                    <button 
                        className="auth-btn" 
                        onClick={isSignup ? handleSignup : handleLogin}
                    >
                        {isSignup ? "Sign Up" : "Login"}
                    </button>

                    <div className="auth-footer">
                        <p>
                            {isSignup ? "Already have an account?" : "Don't have an account?"}
                            <span onClick={() => setIsSignup(!isSignup)}>
                                {isSignup ? " Log in" : " Sign up"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup; 