import { createClient } from "@supabase/supabase-js"
import { ENV } from "@/config"

export const supabaseApp = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY)
