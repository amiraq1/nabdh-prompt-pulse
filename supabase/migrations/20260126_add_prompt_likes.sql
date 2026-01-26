-- Create prompt_likes table to track user likes
CREATE TABLE IF NOT EXISTS public.prompt_likes (
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (prompt_id, user_id)
);

ALTER TABLE public.prompt_likes ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own likes
CREATE POLICY "Users can view their likes"
ON public.prompt_likes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their likes"
ON public.prompt_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their likes"
ON public.prompt_likes FOR DELETE
USING (auth.uid() = user_id);

-- Toggle like RPC (uses auth.uid)
CREATE OR REPLACE FUNCTION public.toggle_like(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  did_insert INTEGER;
  current_user UUID;
BEGIN
  current_user := auth.uid();

  IF current_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.prompt_likes (prompt_id, user_id)
  VALUES (p_id, current_user)
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS did_insert = ROW_COUNT;

  IF did_insert = 1 THEN
    UPDATE public.prompts
    SET likes = likes + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_id;
  ELSE
    DELETE FROM public.prompt_likes
    WHERE prompt_id = p_id AND user_id = current_user;

    UPDATE public.prompts
    SET likes = GREATEST(likes - 1, 0),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_like(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_like(UUID) TO authenticated;
