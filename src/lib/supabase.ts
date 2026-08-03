import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qorubtwxncubeyqttemn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcnVidHd4bmN1YmV5cXR0ZW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzU2MTIsImV4cCI6MjA4MjYxMTYxMn0.Si8zrorHhIkwJ1sOZhXPmAoYZX1w5sChVi7KEAz8fjY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
