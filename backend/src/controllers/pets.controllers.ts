import type { Request, Response } from 'express'
import { pool } from '../config/db.js'
import type { PetInput } from '../schemas/pets.schema.js'

//controller para listar os pets

export async function getPets(req: Request, res: Response) {
  try {
    const [rows] = await pool.execute<any[]>(
      'SELECT id, name, species, breed, age, size, description, image_url FROM pet_tables WHERE status = "avaliable"'
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets', error })
  }
};


export async function registerPet(req: Request, res: Response) {
  try {
    const body = req.body as PetInput

    const created_by = req.user!.id

    const result = await pool.execute(
      'INSERT INTO pet_tables (name, species, breed, age, size, description, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [body.name, body.species, body.breed, body.age, body.size, body.description, body.image_url, created_by]
    )
    res.status(201).json({ message: 'Pet registrado com sucesso', petId: (result as any).insertId })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar pet', error })
  }
}

        