// /lib/supabase-admin.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-safespace.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

// Service role bypasses RLS. NEVER import this file in client components.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
