const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "xpenses_db",
    password: "root",
    port: 5432,
});

pool.connect()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, username, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length > 0) {
            const isMatch = await bcrypt.compare(password, user.rows[0].password);
            if (isMatch) {
                return res.json({ 
                    success: true, 
                    message: "Login successful", 
                    userId: user.rows[0].id,
                    user: user.rows[0] 
                });
            }
        }
        return res.status(401).json({ success: false, error: "Invalid username or password" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Error logging in" });
    }
});

// Expense Endpoints
app.post("/add-expense", async (req, res) => {
    const { expenseType, amount, userId, expenseDate } = req.body;

    if (!expenseType || !amount || !userId) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    try {
        const newExpense = await pool.query(
            `INSERT INTO expenses (expense_type, amount, user_id, expense_date)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                expenseType, 
                amount, 
                userId,
                expenseDate || new Date().toISOString().split('T')[0]
            ]
        );
        res.status(201).json({ 
            message: "Expense added successfully", 
            expense: newExpense.rows[0] 
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add this endpoint for monthly data
app.get("/monthly-expenses/:userId", async (req, res) => {
    const { userId } = req.params;
    const { months = 1 } = req.query;
    
    try {
        const result = await pool.query(
            `SELECT 
                TO_CHAR(expense_date, 'YYYY-MM') AS month,
                SUM(amount) AS total_amount
             FROM expenses
             WHERE user_id = $1
             AND expense_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${months} month'
             AND expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
             GROUP BY TO_CHAR(expense_date, 'YYYY-MM')
             ORDER BY month DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// New endpoint for detailed monthly expenses
// Updated endpoint with correct SQL syntax
app.get("/monthly-expenses-detailed/:userId", async (req, res) => {
    const { userId } = req.params;
    
    try {
        // First get monthly summaries
        const monthlyResult = await pool.query(
            `SELECT 
                TO_CHAR(expense_date, 'YYYY-MM') AS month,
                COUNT(*) AS count,
                SUM(amount) AS total_amount,
                ROUND(AVG(amount), 2) AS average_amount
             FROM expenses
             WHERE user_id = $1
             GROUP BY TO_CHAR(expense_date, 'YYYY-MM')
             ORDER BY TO_CHAR(expense_date, 'YYYY-MM') DESC`,
            [userId]
        );

        // Then get expenses for each month
        const monthsWithExpenses = await Promise.all(
            monthlyResult.rows.map(async (month) => {
                const expenses = await pool.query(
                    `SELECT id, expense_type, amount, expense_date
                     FROM expenses
                     WHERE TO_CHAR(expense_date, 'YYYY-MM') = $1
                     AND user_id = $2
                     ORDER BY expense_date DESC`,
                    [month.month, userId]
                );
                return {
                    ...month,
                    // Ensure amounts have 2 decimals
                    total_amount: parseFloat(month.total_amount).toFixed(2),
                    average_amount: parseFloat(month.average_amount).toFixed(2),
                    expenses: expenses.rows.map(expense => ({
                        ...expense,
                        amount: parseFloat(expense.amount).toFixed(2)
                    }))
                };
            })
        );

        res.json(monthsWithExpenses);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/daily-expenses/:userId", async (req, res) => {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    try {
        const result = await pool.query(
            `SELECT 
                expense_date AS date,
                SUM(amount) AS total_amount
             FROM expenses
             WHERE user_id = $1
             AND expense_date >= CURRENT_DATE - INTERVAL '${days} days'
             GROUP BY expense_date
             ORDER BY expense_date`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/get-expenses/:userId", async (req, res) => {
    const { userId } = req.params;
    const { limit = 5 } = req.query;

    try {
        const result = await pool.query(
            `SELECT id, expense_type, amount, expense_date 
             FROM expenses 
             WHERE user_id = $1 
             ORDER BY expense_date DESC, id DESC
             LIMIT $2`,
            [userId, limit]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/expenses-by-date/:userId", async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const result = await pool.query(
            `SELECT id, expense_type, amount, expense_date
             FROM expenses
             WHERE user_id = $1
             AND expense_date BETWEEN $2 AND $3
             ORDER BY expense_date DESC`,
            [
                userId,
                startDate || '1970-01-01',
                endDate || '2100-01-01'
            ]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/delete-expense/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const result = await pool.query(
            `DELETE FROM expenses
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, userId]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Budget Endpoints
app.post("/set-budget", async (req, res) => {
    const { userId, budgetAmount } = req.body;

    if (!userId || budgetAmount === undefined) {
        return res.status(400).json({ message: "User ID and budget amount are required" });
    }

    try {
        const existingBudget = await pool.query(
            "SELECT * FROM budgets WHERE user_id = $1",
            [userId]
        );

        if (existingBudget.rows.length > 0) {
            await pool.query(
                "UPDATE budgets SET budget_amount = $1 WHERE user_id = $2",
                [budgetAmount, userId]
            );
        } else {
            await pool.query(
                "INSERT INTO budgets (user_id, budget_amount) VALUES ($1, $2)",
                [userId, budgetAmount]
            );
        }

        res.status(200).json({ message: "Budget updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/get-budget/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            "SELECT budget_amount FROM budgets WHERE user_id = $1",
            [userId]
        );

        if (result.rows.length > 0) {
            res.json({ budget: result.rows[0].budget_amount });
        } else {
            res.json({ budget: 0 });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Savings Goals Endpoints
app.post("/add-savings-goal", async (req, res) => {
    const { userId, goalName, targetAmount } = req.body;
    
    if (!userId || !goalName || !targetAmount) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newGoal = await pool.query(
            "INSERT INTO savings_goals (user_id, goal_name, target_amount) VALUES ($1, $2, $3) RETURNING *",
            [userId, goalName, targetAmount]
        );
        res.status(201).json({ message: "Savings goal created", goal: newGoal.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/get-savings-goals/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            "SELECT id, user_id, goal_name, " +
            "COALESCE(target_amount, 0)::numeric AS target_amount, " +
            "COALESCE(current_amount, 0)::numeric AS current_amount, " +
            "created_at, updated_at " +
            "FROM savings_goals WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/update-savings", async (req, res) => {
    const { userId, goalId, amount } = req.body;

    if (!userId || !goalId || amount === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await pool.query(
            "UPDATE savings_goals SET current_amount = current_amount + $1 WHERE id = $2 AND user_id = $3",
            [amount, goalId, userId]
        );
        res.status(200).json({ message: "Savings updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));