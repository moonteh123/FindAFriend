import type { Request, Response } from 'express'
import { pool } from '../config/db.js'

// Controller para registrar um novo pet
export async function registerPet(req: Request, res: Response) {
  try {
    // Validação dos dados de entrada
    const {
      name: nameRaw,
      species: speciesRaw,
      breed: breedRaw,
      age: ageRaw,
      size: sizeRaw,
      description: descriptionRaw,
      image_url: imageUrlRaw
    } = req.body ?? {}

    if (!nameRaw || !speciesRaw || !breedRaw || descriptionRaw == null || !imageUrlRaw || sizeRaw == null || ageRaw == null) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    // Normalização dos dados
    const name = String(nameRaw).trim()
    const species = String(speciesRaw).trim().toLowerCase()
    const breed = String(breedRaw).trim()
    const description = String(descriptionRaw).trim()
    const size = String(sizeRaw).trim().toUpperCase()
    // Validação dos dados de idade
    const age = Number(ageRaw)
    if (!Number.isFinite(age) || age < 0 || age > 30) {
      return res.status(400).json({ message: 'Age must be a valid number (0-30)' })
    }
    // Validação dos dados de texto
    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ message: 'Name must be between 2 and 80 characters' })
    }
    // Validação dos dados de espécie e tamanho
    if (species !== 'dog' && species !== 'cat') {
      return res.status(400).json({ message: "Species must be 'dog' or 'cat'" })
    }
    // Validação dos dados de raça e descrição
    if (breed.length < 2 || breed.length > 80) {
      return res.status(400).json({ message: 'Breed must be between 2 and 80 characters' })
    }

    if (description.length < 10 || description.length > 500) {
      return res.status(400).json({ message: 'Description must be between 10 and 500 characters' })
    }
    // Validação dos dados de tamanho
    if (size !== 'P' && size !== 'M' && size !== 'G') {
      return res.status(400).json({ message: 'Size must be P, M, or G' })
    }

    if (typeof imageUrlRaw !== 'string') {
      return res.status(400).json({ message: 'Image URL must be a string' })
    }
    const image_url = imageUrlRaw.trim()
    if (!image_url.startsWith('http')) {
      return res.status(400).json({ message: 'Image URL must start with http/https' })
    }

    // TODO: pegar do JWT (admin logado)
    const created_by = 1

    await pool.execute(
      `INSERT INTO pet_tables (name, species, breed, age, size, description, image_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, species, breed, age, size, description, image_url, created_by]
    )

    return res.status(201).json({ message: 'Pet registered successfully' })
  } catch (err) {
    console.error('Error registering pet:', err)
    return res.status(500).json({ message: 'Error registering pet' })
  }
}

// Controller para listar os pets disponíveis

export async function listAvaliablePets(req: Request, res: Response) {
  try {
    const speciesRaw = req.query.species
    const sizeRaw = req.query.size

    //filtros opcionais
    const filters: string[] = ['status = ?']
    const params: any[] = ['avaliable']
    // Validação e construção dos filtros
    if (typeof speciesRaw === 'string' && speciesRaw.trim() !== '') {
      filters.push('species = ?')
      params.push(speciesRaw.trim().toLowerCase())
    }

    if (typeof sizeRaw === 'string' && sizeRaw.trim() !== '') {
      filters.push('size = ?')
      params.push(sizeRaw.trim().toUpperCase())
    }
    // Construção da cláusula WHERE
    const whereSql = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    // Consulta ao banco de dados
    const [rows] = await pool.execute(
      `SELECT id, name, species, breed, age, size, descriptio, image_url, status, created_at FROM pet_tables ${whereSql} ORDER BY create_at DESC`,
      params
    )

    return res.status(200).json({ pets: rows })
  } catch (err) {
    console.error('Error listing pets:', err)
    return res.status(500).json({ message: 'Error listing pets' })
  }
}
        