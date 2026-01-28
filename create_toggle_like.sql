-- Function to toggle like status for a prompt
create or replace function toggle_like(p_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  existing_like record;
begin
  -- Check if the like already exists for this user and prompt
  select * into existing_like 
  from public.prompt_likes
  where prompt_id = p_id and user_id = auth.uid();

  if found then
    -- If it exists, remove it (unlike)
    delete from public.prompt_likes 
    where prompt_id = p_id and user_id = auth.uid();
  else
    -- If it doesn't exist, insert it (like)
    insert into public.prompt_likes (prompt_id, user_id)
    values (p_id, auth.uid());
  end if;
end;
$$;
