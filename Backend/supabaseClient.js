// config/supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://wcticqraccsuysippjhv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdGljcXJhY2NzdXlzaXBwamh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI5NTcsImV4cCI6MjA4MjU1ODk1N30.6UMik5IFhIUzYG9baj3U53UWCBbW87X_6v-7aYFlCFU"
);

module.exports = supabase;