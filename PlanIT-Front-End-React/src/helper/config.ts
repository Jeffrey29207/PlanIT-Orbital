// Create a supabase client to connect with the backend database in supabase

import {createClient} from '@supabase/supabase-js';

/*const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is not defined in the environment variables.");
}*/

const supabase =  createClient(
    "https://tawzugumouawtstryldu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd3p1Z3Vtb3Vhd3RzdHJ5bGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjgyMDcsImV4cCI6MjA2MzA0NDIwN30.MuarXdMBYZECfpKDrOQPJ5hdhU1hLRYrUtChVvRoq3s"
)

export default supabase;