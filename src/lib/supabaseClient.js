// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djftpnxuwujyhxixedwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZnRwbnh1d3VqeWh4aXhlZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTI5NjAsImV4cCI6MjA1OTA4ODk2MH0.lrjGhYn6O_i4uoIhTbkfKPUehERg_pYA1H2DRHtHVO8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
