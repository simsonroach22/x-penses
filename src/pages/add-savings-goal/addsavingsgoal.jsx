import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import "./addsavingsgoal.css";

function AddSavingsGoal() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [goalName, setGoalName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/add-savings-goal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    goalName,
                    targetAmount: Number(targetAmount)
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Savings goal created successfully!");
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                setMessage(data.message || "Error creating savings goal");
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div className="add-savings-container">
            <Navbar />
            <div className="add-savings-goal-content">
                <h1 id="add-savings-goal-title">Add Savings Goal</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Goal Name:</label>
                        <input
                            type="text"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Target Amount (₹):</label>
                        <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    <button type="submit">Create Goal</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>

        </div>
    );
}

export default AddSavingsGoal;