import { ApiResponse } from '../database'
import { logger } from './logger'

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

const AUTH_MESSAGES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
} as const

const USER_MESSAGES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const

const STORE_MESSAGES = {
  STORE_NOT_FOUND: 'STORE_NOT_FOUND',
  STORE_ALREADY_EXISTS: 'STORE_ALREADY_EXISTS',
} as const

const PUNCHCARD_MESSAGES = {
  PUNCHCARD_NOT_FOUND: 'PUNCHCARD_NOT_FOUND',
  PUNCHCARD_ALREADY_EXISTS: 'PUNCHCARD_ALREADY_EXISTS',
} as const

export const MESSAGES = {
  ...AUTH_MESSAGES,
  ...STORE_MESSAGES,
  ...PUNCHCARD_MESSAGES,
  ...USER_MESSAGES,
  SERVER_ERROR: 'SERVER_ERROR',
} as const

type ErrorResponseParams = {
  res: ApiResponse<any>
  status: number
  message: string
  error?: any
}

export const sendErrorResponse = ({
  res,
  status,
  message,
  error,
}: ErrorResponseParams) => {
  logger.error(`Error:`, error)
  return res.status(status).json({ message })
}
