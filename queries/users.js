'use server'

import { createConnection } from '@/lib/db';
// import bcrypt from "bcryptjs";

export const getUserByEmail = async (email) => {
    if (!email || typeof email !== 'string') {
        throw new Error('Invalid email provided');
    }

    let connection;
    try {
        connection = await createConnection(); // create a new connection
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Database query failed');
    }
};

export const updateUserInfo = async (email, updatedData) => {
    try {
        const connection = await createConnection();
        
        const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
        const values = Object.values(updatedData);

        if (!fields) {
            throw new Error("No valid fields to update");
        }

        const query = `UPDATE users SET ${fields} WHERE email = ?`;
        await connection.execute(query, [...values, email]);

    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Database update failed');
    }
};

export const updateContactInfo= async (email, updatedData) => {
    try {
        const connection = await createConnection();
        
        const fields = Object.keys(updatedData).map(key => `${key} = ?`).join(", ");
        const values = Object.values(updatedData);

        if (!fields) {
            throw new Error("No valid fields to update");
        }

        const query = `UPDATE users SET ${fields} WHERE email = ?`;
        await connection.execute(query, [...values, email]);

    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Database update failed');
    }
};



export const updatePasswordInDB = async (email, hashedPassword) => {
    try {
        const connection = await createConnection();

        const query = `UPDATE users SET password = ? WHERE email = ?`;

        const [result] = await connection.execute(query, [hashedPassword, email]);

        if (result.affectedRows === 0) {
            throw new Error("No rows updated. Email might not exist in the database.");
        }

        connection.end();
        return { success: true };
    } catch (error) {
        console.error('Database update failed:', error); // Log the actual error
        throw new Error('Database update failed: ' + error.message);
    }
};



