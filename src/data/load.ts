import { promises as fs } from 'fs'
import path from 'path'
import { Equipment, Exercise, Muscle, BodyPart } from './types'
import { HTTPException } from 'hono/http-exception'

export class FileLoader {
  private static dataPath = path.resolve(process.cwd(), 'src', 'data')

  private static cache = new Map<string, unknown>()

  private static async loadJSON<T>(filePath: string): Promise<T> {
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath) as T
    }

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const data = JSON.parse(fileContent) as T
      this.cache.set(filePath, data)
      return data
    } catch (error) {
      console.error(`❌ Error loading JSON file [${filePath}]:`, error)
      throw new HTTPException(500, { message: `database not working` })
    }
  }

  public static loadExercises(): Promise<Exercise[]> {
    return this.loadJSON<Exercise[]>(path.join(process.cwd(), 'src', 'data', 'exercises.json'))
  }

  public static loadEquipments(): Promise<Equipment[]> {
    return this.loadJSON<Equipment[]>(path.join(process.cwd(), 'src', 'data', 'equipments.json'))
  }

  public static loadBodyParts(): Promise<BodyPart[]> {
    return this.loadJSON<BodyPart[]>(path.join(process.cwd(), 'src', 'data', 'bodyparts.json'))
  }

  public static loadMuscles(): Promise<Muscle[]> {
    return this.loadJSON<Muscle[]>(path.join(process.cwd(), 'src', 'data', 'muscles.json'))
  }
}
