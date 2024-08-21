import { createClient } from '@supabase/supabase-js'
import { Database } from '.'
import { env } from '../utils'

//https:supabase.com/docs/reference/javascript/typescript-support

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
