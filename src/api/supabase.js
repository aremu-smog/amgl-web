import { createClient } from "@supabase/supabase-js"

console.log(process.env.NEXT_APP_SUPABASE_KEY)
export const supabaseApp = createClient(
	"https://yscprznehevulantlliu.supabase.co",
	process.env.NEXT_PUBLIC_SUPABASE_KEY
)
