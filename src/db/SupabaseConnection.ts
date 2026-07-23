import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'     

dotenv.config()

const supabaseURL = process.env.SUPABASE_URL;
const supabase_key = process.env.SUPABASE_KEY;


if(!supabaseURL || !supabase_key){
    throw new Error(
    'Error: Las variables SUPABASE_URL o SUPABASE_KEY no están definidas en el archivo .env'
  );
}



export const supabaseclient = createClient(supabaseURL, supabase_key)