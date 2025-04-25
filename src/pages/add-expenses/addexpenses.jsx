import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import './addexpenses.css';

function AddExpenses() {
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState({
        type: "",
        amount: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            navigate("/login");
        } else {
            fetchMonthlyExpenses(userId);
        }
    }, [navigate]);

    const fetchMonthlyExpenses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/monthly-expenses-detailed/${userId}`);
            const data = await response.json();
            setMonthlyExpenses(data);
        } catch (error) {
            console.error("Error fetching monthly expenses:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        
        if (!userId) {
            alert("Please log in again");
            navigate("/login");
            return;
        }

        if (!expenseData.type.trim()) {
            alert("Please enter an expense type");
            return;
        }

        const amountValue = parseFloat(expenseData.amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            alert("Please enter a valid amount greater than zero");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/add-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    expenseType: expenseData.type, 
                    amount: amountValue, 
                    userId,
                    expenseDate: expenseData.date
                }),
            });

            if (response.ok) {
                alert("Expense added successfully!");
                setExpenseData({
                    type: "",
                    amount: "",
                    date: new Date().toISOString().split('T')[0]
                });
                fetchMonthlyExpenses(userId);
            } else {
                throw new Error("Failed to add expense");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-expenses-container">
            <Navbar />
            <div className="add-expenses-content">
                <h2>Add Expense</h2>
                
                {/* Add Expense Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="expense-type">Expense Type:</label>
                        <input
                            id="expense-type"
                            type="text"
                            name="type"
                            value={expenseData.type}
                            onChange={handleChange}
                            placeholder="e.g., Groceries, Rent"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount (₹):</label>
                        <input
                            id="amount"
                            type="number"
                            name="amount"
                            value={expenseData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={expenseData.date}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={isSubmitting ? "submitting" : ""}
                    >
                        {isSubmitting ? "Adding..." : "Add Expense"}
                    </button>
                </form>

                {/* Monthly Expenses Section */}
                <div className="monthly-expenses-section">
                    <h3>Your Expenses by Month</h3>
                    
                    {monthlyExpenses.length > 0 ? (
                        monthlyExpenses.map((monthData) => (
                            <div key={monthData.month} className="month-group">
                                <div className="month-header">
                                    <h4>{new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                                    <div className="month-stats">
                                        <span className="month-total">
                                            Total: ₹{monthData.total_amount?.toLocaleString('en-IN') || '0'}
                                        </span>
                                        <span className="month-average">
                                            Average: ₹{monthData.average_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0'}
                                        </span>
                                    </div>
                                </div>
                                
                                <ul className="expenses-list">
                                    {monthData.expenses?.map((expense) => (
                                        <li key={expense.id} className="expense-item">
                                            <span className="expense-date">
                                                {new Date(expense.expense_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="expense-type">{expense.expense_type}</span>
                                            <span className="expense-amount">
                                                ₹{expense.amount?.toLocaleString('en-IN')}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className="no-expenses">No expenses recorded yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddExpenses;