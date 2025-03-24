import { createConnection } from '@/lib/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { firstName, lastName, email, password, userRole } = await request.json();

        const userId = uuidv4().replace(/-/g, '').slice(0, 24); 

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the SQL query to insert the user data
        const db = await createConnection();
        const SQL_INSERT_USER = `INSERT INTO users (id, first_name, last_name, email, password, role)VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(SQL_INSERT_USER, [userId,firstName,lastName,email,hashedPassword,userRole,]);

        // Return success response
        return NextResponse.json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message });
    }
}
