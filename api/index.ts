import { handle } from '@hono/node-server/vercel'
import { BodyPartController, EquipmentController, MuscleController, ExerciseController } from '../src/modules'
import { App } from '../src/app'

const app = new App([
  new ExerciseController(),
  new MuscleController(),
  new EquipmentController(),
  new BodyPartController()
]).getApp()

export default handle(app)
