import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/navbar";
import "./dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [graphData, setGraphData] = useState([]);
    const [budget, setBudget] = useState(0);
    const [showBudgetInput, setShowBudgetInput] = useState(false);
    const [newBudget, setNewBudget] = useState("");
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [addAmounts, setAddAmounts] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        if (userId) {
            fetchDailyExpenses(userId);
            fetchRecentExpenses(userId);
            fetchBudget(userId);
            fetchSavingsGoals(userId);
        } else {
            navigate("/login");
        }
    }, [userId]);

    const fetchExpenseData = async (range) => {
        try {
            let url;
            if (range === 'week') {
                url = `http://localhost:5000/daily-expenses/${userId}?days=7`;
            } else if (range === 'month') {
                url = `http://localhost:5000/monthly-expenses/${userId}?months=1`;
            }

            const response = await fetch(url);
            const data = await response.json();

            const formattedData = data.map(item => ({
                date: range === 'week'
                    ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
                    : new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
                amount: Number(item.total_amount) || 0
            }));

            setGraphData(formattedData);
            setTimeRange(range);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchBudget = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/get-budget/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setBudget(Number(data.budget) || 0);
            }
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    const fetchDailyExpenses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/daily-expenses/${userId}?days=7`);
            const data = await response.json();

            if (response.ok) {
                const formattedData = data.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    amount: Number(item.total_amount) || 0
                }));

                setGraphData(formattedData);

                // Calculate total expenses
                const total = data.reduce((sum, item) => sum + Number(item.total_amount), 0);
                setTotalExpenses(total);
            }
        } catch (error) {
            console.error("Error fetching daily expenses:", error);
        }
    };

    const fetchRecentExpenses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/get-expenses/${userId}?limit=5`);
            const data = await response.json();

            if (response.ok) {
                const processedData = data.map(expense => ({
                    ...expense,
                    amount: Number(expense.amount) || 0,
                    date: expense.expense_date
                }));

                setRecentExpenses(processedData);
                setAllExpenses(processedData);
            }
        } catch (error) {
            console.error("Error fetching recent expenses:", error);
        }
    };

    const fetchSavingsGoals = async (userId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/get-savings-goals/${userId}`);
            const data = await response.json();

            if (response.ok) {
                const processedGoals = data.map(goal => ({
                    ...goal,
                    current_amount: Number(goal.current_amount) || 0,
                    target_amount: Number(goal.target_amount) || 0
                }));
                setSavingsGoals(processedGoals);
            }
        } catch (error) {
            console.error("Error fetching savings goals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBudgetChange = async () => {
        if (!newBudget) return;

        try {
            const response = await fetch("http://localhost:5000/set-budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, budgetAmount: Number(newBudget) })
            });

            if (response.ok) {
                setBudget(Number(newBudget));
                setShowBudgetInput(false);
                setNewBudget("");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAddToSavings = async (goalId) => {
        const amountToAdd = addAmounts[goalId];
        if (!amountToAdd || Number(amountToAdd) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/update-savings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    goalId,
                    amount: Number(amountToAdd)
                })
            });

            if (response.ok) {
                fetchSavingsGoals(userId);
                setAddAmounts(prev => ({ ...prev, [goalId]: "" }));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAmountChange = (goalId, value) => {
        setAddAmounts(prev => ({
            ...prev,
            [goalId]: value
        }));
    };

    const savings = budget - totalExpenses;

    return (
        <div className="dashboard-container">
            <div className="dashboard-navbar">
                <Navbar />
            </div>

            <div className="dashboard-container-inside">
                <div className="dashboard-title">
                    <h1>Dashboard</h1>
                </div>
                <div className="dashboard-btns">
                    <input type="button" value="Overview" />
                    <input type="button" value="Add Expenses" onClick={() => navigate('/addexpenses')} />
                    <input type="button" value="Add Savings Goal" onClick={() => navigate('/addsavingsgoal')} />
                </div>
                <div className="module-container">
                    <div className="total-budget-container">
                        <h1>Total Budget</h1>
                        <div className="budget-add-btn">
                            <p>₹{budget.toLocaleString()}</p>
                            <button onClick={() => setShowBudgetInput(true)}>+</button>
                        </div>

                        {showBudgetInput && (
                            <div className="budget-input-popup">
                                <input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    placeholder="Enter budget amount"
                                />
                                <button onClick={handleBudgetChange}>Save</button>
                            </div>
                        )}
                    </div>

                    <div className="xpenses-container">
                        <h1>Expenses</h1>
                        <p>₹{totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="savings-container">
                        <h1>Savings</h1>
                        <p>₹{savings.toFixed(2)}</p>
                    </div>
                    <div className="active-subscription-container">
                        <h1>Active Subscription</h1>
                        <p>0</p>
                    </div>
                    <div className="overview-container">
                        <h1>Overview</h1>
                        <div className="graph-toggle">
                            <button
                                onClick={() => fetchExpenseData('week')}
                                className={timeRange === 'week' ? 'active' : ''}
                            >
                                Last Week
                            </button>
                            <button
                                onClick={() => fetchExpenseData('month')}
                                className={timeRange === 'month' ? 'active' : ''}
                            >
                                Last Month
                            </button>
                        </div>
                        <div className="graph-container">
                            {graphData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={graphData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Bar dataKey="amount" fill="#8884d8">
                                            {graphData.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill="#4CAF50" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-message">
                                    <p>No expense data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="recent-expenses-container">
                        <h1>Recent Expenses</h1>
                        <div className="expenses-list-view">
                            {recentExpenses.length > 0 ? (
                                <ul>
                                    {recentExpenses.map((expense, index) => (
                                        <li key={index}>
                                            {new Date(expense.date).toLocaleDateString()}: {expense.expense_type}: ₹{expense.amount.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No recent expenses</p>
                            )}
                        </div>
                    </div>
                    <div className="savings-progress-container">
                        <h1>Savings Goals</h1>
                        {isLoading ? (
                            <p>Loading savings goals...</p>
                        ) : savingsGoals.length > 0 ? (
                            savingsGoals.map(goal => {
                                const progress = Math.min(100,
                                    ((goal.current_amount || 0) / (goal.target_amount || 1)) * 100
                                );

                                return (
                                    <div key={goal.id} className="goal-item">
                                        <h3>{goal.goal_name}</h3>
                                        <div className="progress-container">
                                            <div
                                                className={`progress-bar ${progress < 30 ? 'low' :
                                                    progress < 70 ? 'medium' : 'high'
                                                    }`}
                                                style={{ width: `${progress}%` }}
                                            >
                                                <span className="progress-text">{progress.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <p className="amount-display">
                                            ₹{(goal.current_amount || 0).toFixed(2)} of ₹{(goal.target_amount || 0).toFixed(2)}
                                        </p>
                                        <div className="add-amount-form">
                                            <input
                                                type="number"
                                                value={addAmounts[goal.id] || ""}
                                                onChange={(e) => handleAmountChange(goal.id, e.target.value)}
                                                placeholder="Enter amount"
                                                min="0"
                                                step="100"
                                                className="amount-input"
                                            />
                                            <button
                                                onClick={() => handleAddToSavings(goal.id)}
                                                className="add-button"
                                            >
                                                Add Funds
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No savings goals yet. <a onClick={() => navigate('/addsavingsgoal')}>Create one</a></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;