/**
 * ExerciseDB API - Main Entry Point for Vercel Deployment
 * This file serves as the entry point for Vercel's Node.js serverless functions
 */

import { handle } from '@hono/node-server/vercel'
import { BodyPartController, EquipmentController, MuscleController, ExerciseController } from './src/modules'
import { App } from './src/app'

const app = new App([
  new ExerciseController(),
  new MuscleController(),
  new EquipmentController(),
  new BodyPartController()
]).getApp()

export default handle(app)
