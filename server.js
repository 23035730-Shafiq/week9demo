const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// GET payments (Exercise 1A)
app.get('/payments', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM payments');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for payments' });
    } finally {
        if (connection) await connection.end();
    }
});

// POST
app.post('/payments', async (req, res) => {
    const { amount, payment_status, payment_method } = req.body;
    if (amount === undefined || !payment_status || !payment_method) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO payments (amount, payment_status, payment_method) VALUES (?, ?, ?)',
            [amount, payment_status, payment_method]
        );
        res.status(201).json({ payment_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

// PUT
app.put('/payments/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, payment_status, payment_method } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE payments SET amount=?, payment_status=?, payment_method=? WHERE paymentid=?',
            [amount, payment_status, payment_method, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

// DELETE
app.delete('/payments/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'DELETE FROM payments WHERE paymentid=?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.end();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
