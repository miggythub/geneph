

# Create Whitelist Entry for First Admin

Since no admin exists yet, we need to insert a whitelist row for `genephadmin@gmail.com` so you can sign up.

## What will happen

1. **Insert a whitelist entry** into the `whitelist` table with your email. The `temp_key` column auto-generates an 8-character key from a UUID.

2. **After insertion**, I'll query the table to retrieve your generated `temp_key` so you can use it on the signup form.

3. **You sign up** at `/auth` using your email, a password, and the temp key.

4. **The `handle_new_user` trigger** fires — since `user_roles` is empty, you'll automatically get the `admin` role.

## SQL to execute

```sql
INSERT INTO public.whitelist (email) VALUES ('genephadmin@gmail.com');
```

Then retrieve:
```sql
SELECT email, temp_key FROM public.whitelist WHERE email = 'genephadmin@gmail.com';
```

No code changes needed — just a data insert and then you can sign up normally.

