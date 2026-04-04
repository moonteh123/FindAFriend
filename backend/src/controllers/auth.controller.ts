

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { pool } from '../config/db.js'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';


// controller para registrar um novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password} = req.body as RegisterInput

    //checa email duplicado

    const [rows] = await pool.execute<any[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.execute(
      'INSERT INTO users (name, email, hashedPassword, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    )
    return res.status(201).json({ message: 'User registered successfully' })

  } catch (error) {
    console.error('Error registering user:', error)
    return res.status(500).json({ message: 'Error registering user', error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput

    const [rows] = await pool.execute<any[]>(
      'SELECT id, name, hashedPassword, role FROM users WHERE email = ? LIMIT 1',
      [email]
    )
    if(rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const user = rows[0]

    const ok = await bcrypt.compare(password, user.hashedPassword)

    if(!ok) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    if(!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured'})
    }

    //gerar token

    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return res.status(200).json({ token })
  } catch(error) {
    console.error('Error logging in:', error)
    return res.status(500).json({ message: 'Error logging in', error })
  }
};



