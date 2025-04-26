import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

interface weightSet {
  id: number,
  date_worked: string,
  weight: number,
  units: string,
  reps: number,
  user_id: number,
  exercise_id: number
  duration_seconds?: number,
  notes?: string,
  distance?: number,
  exercise_type: string
}

