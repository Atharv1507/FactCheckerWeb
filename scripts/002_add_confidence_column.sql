-- Add confidence column to store AI's confidence score
alter table public.fake_checks 
add column if not exists confidence integer;

-- Add a check constraint to ensure confidence is between 0 and 100
alter table public.fake_checks
add constraint confidence_range check (confidence >= 0 and confidence <= 100);
