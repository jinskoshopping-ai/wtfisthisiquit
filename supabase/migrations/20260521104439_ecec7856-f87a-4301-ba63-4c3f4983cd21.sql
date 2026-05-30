drop function if exists public.claim_cafe_koch_admin();

drop policy if exists "cafe koch email can claim admin role" on public.user_roles;

create policy "cafe koch email can claim admin role"
on public.user_roles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and role = 'admin'::public.app_role
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@cafe-koch.de'
);