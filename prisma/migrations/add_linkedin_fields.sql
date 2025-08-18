-- Migration to add LinkedIn fields to Article table
-- Run this in Supabase SQL Editor

-- Check if columns already exist before adding them
DO $$
BEGIN
    -- Add linkedinPostId column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Article' AND column_name = 'linkedinPostId') THEN
        ALTER TABLE "Article" ADD COLUMN "linkedinPostId" TEXT;
    END IF;
    
    -- Add linkedinUrl column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Article' AND column_name = 'linkedinUrl') THEN
        ALTER TABLE "Article" ADD COLUMN "linkedinUrl" TEXT;
    END IF;
    
    -- Add linkedInPosted column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Article' AND column_name = 'linkedInPosted') THEN
        ALTER TABLE "Article" ADD COLUMN "linkedInPosted" BOOLEAN DEFAULT false;
    END IF;
    
    -- Add linkedInPostDate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Article' AND column_name = 'linkedInPostDate') THEN
        ALTER TABLE "Article" ADD COLUMN "linkedInPostDate" TIMESTAMP(3);
    END IF;
END $$;