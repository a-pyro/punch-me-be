import { Request } from 'express'
import { Tables, TablesInsert, TablesUpdate } from './generated-types'

//  todo fix this any
export type ExpressRequest<TReqBody, TParams = any, TQuery = any> = Request<
  TParams,
  any,
  TReqBody,
  TQuery
>

export const COLLECTIONS = {
  users: 'users',
  stores: 'stores',
} as const

export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>
export type User = Tables<'users'>

export type StoreInsert = TablesInsert<'stores'>
export type StoreUpdate = TablesUpdate<'stores'>
export type Store = Tables<'stores'>
