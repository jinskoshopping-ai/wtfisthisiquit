create or replace function public.claim_cafe_koch_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  requester_email text;
begin
  if auth.uid() is null then
    return false;
  end if;

  requester_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if requester_email <> 'info@cafe-koch.de' then
    return false;
  end if;

  insert into public.user_roles (user_id, role)
  values (auth.uid(), 'admin'::public.app_role)
  on conflict (user_id, role) do nothing;

  return true;
end;
$$;

revoke all on function public.claim_cafe_koch_admin() from public;
grant execute on function public.claim_cafe_koch_admin() to authenticated;