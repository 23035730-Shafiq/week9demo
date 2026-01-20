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

// GET all payments
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

// POST add payment
app.post('/payments', async (req, res) => {
    const { amount, payment_status, payment_method, image_url } = req.body;

    if (amount === undefined || !payment_status || !payment_method || !image_url) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql =
            'INSERT INTO payments (amount, payment_status, payment_method, image_url) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [
            amount,
            payment_status,
            payment_method,
            image_url,
        ]);

        res.status(201).json({
            message: 'Payment added',
            paymentid: result.insertId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding payment' });
    } finally {
        if (connection) await connection.end();
    }
});

// PUT update payment by id
app.put('/payments/:id', async (req, res) => {
    const id = req.params.id;
    const { amount, payment_status, payment_method, image_url } = req.body;

    if (amount === undefined || !payment_status || !payment_method || !image_url) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql =
            'UPDATE payments SET amount=?, payment_status=?, payment_method=?, image_url=? WHERE paymentid=?';
        const [result] = await connection.execute(sql, [
            amount,
            payment_status,
            payment_method,
            image_url,
            id,
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({ message: 'Payment updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating payment' });
    } finally {
        if (connection) await connection.end();
    }
});

// DELETE payment by id
app.delete('/payments/:id', async (req, res) => {
    const id = req.params.id;

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
        console.error(err);
        res.status(500).json({ message: 'Server error deleting payment' });
    } finally {
        if (connection) await connection.end();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
