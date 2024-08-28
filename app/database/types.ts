import { Request, Response } from 'express'
import { Tables, TablesInsert, TablesUpdate } from './generated-types'

//  todo fix this any
export type ApiResquest<TReqBody, TParams = any, TQuery = any> = Request<
  TParams,
  any,
  TReqBody,
  TQuery
>

export type ApiResponse<TResBody> = Response<{
  data?: TResBody
  message?: string
}>

export type WithId = { id: string }

export const COLLECTIONS = {
  users: 'users',
  stores: 'stores',
  punchcards: 'punchcards',
} as const

export type UserInsert = TablesInsert<'users'>
export type UserUpdate = Omit<TablesUpdate<'users'>, 'password'>
export type User = Tables<'users'>

export type StoreInsert = TablesInsert<'stores'>
export type StoreUpdate = TablesUpdate<'stores'>
export type Store = Tables<'stores'>

export type Punchcard = Tables<'punchcards'>
export type PunchcardInsert = TablesInsert<'punchcards'>
export type PunchcardUpdate = TablesUpdate<'punchcards'>
