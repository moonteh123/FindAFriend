
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { pool } from '../config/db.js'


// controller para registrar um novo usuário
export const register = async (req: Request, res: Response) => {

  try {
    // validar os dados de entrada
    const nameRaw = req.body?.name
    const emailRaw = req.body?.email
    const passwordRaw = req.body?.password

    // checar se os campos estão presentes
    if (!nameRaw || !emailRaw || !passwordRaw) {
      return res.status(400).json({ message: 'name, email and password are required' })
    }

    // validar os campos
    const name = String(nameRaw).trim()
    const email = String(emailRaw).trim().toLowerCase()
    const password = String(passwordRaw)
    // validar se os campos cumprem os requisitos mínimos
    if (name.length < 2) {
      return res.status(400).json({ message: 'name must have at least 2 characters' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must have at least 6 characters' })
    }

    // checar se já existe
    const [rows] = await pool.execute<any[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (rows.length > 0) {
      return res.status(409).json({ message: 'email already in use' })
    }
    // criar o hash da senha
    const passwordHash = await bcrypt.hash(password, 10)
    // inserir o usuário no banco
    await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'user']
    )

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Error registering user:', err)
    return res.status(500).json({ message: 'Error registering user' })
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const emailRaw = req.body?.email
    const passwordRaw = req.body?.password

    if (!emailRaw || !passwordRaw) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const normalizedEmail = String(emailRaw).trim().toLowerCase()
    const password = String(passwordRaw)

    const [rows] = await pool.execute<any[]>(
      'SELECT id, name, role, password_hash FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' })
    }

    const token = jwt.sign(
      { sub: String(user.id), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Error logging in:', err)
    return res.status(500).json({ message: 'Error logging in' })
  }
}
