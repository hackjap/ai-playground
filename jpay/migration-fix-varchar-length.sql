-- Migration to fix VARCHAR length issue for user IDs
-- Execute this in your Supabase SQL editor

-- Update pairs table
ALTER TABLE pairs 
ALTER COLUMN user1_id TYPE VARCHAR(50),
ALTER COLUMN user2_id TYPE VARCHAR(50);

-- Update expenses table  
ALTER TABLE expenses 
ALTER COLUMN paid_by TYPE VARCHAR(50);

-- Verify the changes
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name IN ('pairs', 'expenses') 
AND column_name IN ('user1_id', 'user2_id', 'paid_by')
ORDER BY table_name, column_name;