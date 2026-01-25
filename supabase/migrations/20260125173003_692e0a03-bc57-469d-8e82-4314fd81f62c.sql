-- Create user_settings table for persistent settings storage
CREATE TABLE public.user_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Settings data stored as JSONB for flexibility
    settings JSONB NOT NULL DEFAULT '{
        "appearance": {
            "showArabicTitles": true,
            "theme": "dark"
        },
        "notifications": {
            "newSubmissionAlerts": true,
            "emailDigest": false
        },
        "display": {
            "promptsPerPage": 12,
            "defaultSortOrder": "newest"
        }
    }'::jsonb,
    
    -- Schema version for migrations
    schema_version INTEGER NOT NULL DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Since this is admin-only settings (no auth yet), allow all operations
-- When auth is added, these policies should be updated to use auth.uid()
CREATE POLICY "Settings are readable by everyone" 
ON public.user_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Settings can be updated by everyone" 
ON public.user_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Settings can be inserted by everyone" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings row (singleton pattern for admin settings)
INSERT INTO public.user_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001');