-- Add payment_status column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'Pending';

-- Optional: Add check constraint to ensure valid status values
-- ALTER TABLE orders 
-- ADD CONSTRAINT check_payment_status 
-- CHECK (payment_status IN ('Pending', 'Paid', 'Failed'));
