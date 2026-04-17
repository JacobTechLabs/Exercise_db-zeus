import { Equipment, Exercise, Muscle, BodyPart } from './types'
import exercisesReq from './exercises.json'
import equipmentsReq from './equipments.json'
import bodypartsReq from './bodyparts.json'
import musclesReq from './muscles.json'

export class FileLoader {
  public static async loadExercises(): Promise<Exercise[]> {
    return exercisesReq as unknown as Exercise[]
  }

  public static async loadEquipments(): Promise<Equipment[]> {
    return equipmentsReq as unknown as Equipment[]
  }

  public static async loadBodyParts(): Promise<BodyPart[]> {
    return bodypartsReq as unknown as BodyPart[]
  }

  public static async loadMuscles(): Promise<Muscle[]> {
    return musclesReq as unknown as Muscle[]
  }
}
