create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (profile_id, name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'name', 'Anonymous'),
        case
            when new.raw_user_meta_data ->> 'role' = 'facilitator' then 'facilitator'::public.role
            else 'client'::public.role
        end
    );
    return new;
end;
$$;

drop trigger if exists user_to_profile_trigger on auth.users;

create trigger user_to_profile_trigger
after insert on auth.users
for each row
execute function public.handle_new_user();
