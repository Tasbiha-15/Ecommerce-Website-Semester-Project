-- 1. Drop the old check constraint
ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;

-- 2. Update existing data ('sale' -> 'order' AND make positive)
UPDATE transactions 
SET 
  type = 'order',
  quantity = ABS(quantity)
WHERE type = 'sale';

-- 3. Also fix any already-positive sales if they exist (just to be safe)
UPDATE transactions
SET quantity = ABS(quantity)
WHERE type = 'order';

-- 4. Add new check constraint with 'order' instead of 'sale'
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('order', 'restock', 'return', 'adjustment'));
