import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE__PUBLIC_KEY || ""; //handling optional to make sure it is the correct type
export const supabase = createClient(supabaseUrl, supabaseKey);
