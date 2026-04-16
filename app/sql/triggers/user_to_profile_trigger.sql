create function public.handle_new_user()
returns trigger as $$
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_app_metadata is not null then
        if new.raw_app_meta_data ? 'provider' and new.raw_app_meta_data ->> 'provider' = 'email' then
            if new.role = 'facilitator' then
                insert into profiles (profile_id, name, role) values (new.id, 'Anonymous Facilitator', 'facilitator');
            else
                insert into profiles (profile_id, name, role) values (new.id, 'Anonymous Client', 'client');
            end if;
        end if;
    end if;
    return new;
end;
$$;

create trigger user_to_profile_trigger
after insert on auth.users
for each row
execute function public.handle_new_user();
