

# Create a GenePH Manager Account

Since auth accounts must be created through signup, this is a two-step process:

## Step 1: Add a whitelist entry for the manager email
I'll insert a whitelist entry for a new manager email (e.g., `manager@geneph.com`) so they can sign up.

## Step 2: You sign up, then I assign the manager role
After you sign up with that email through the `/auth` page, I'll update the user's role from `user` to `manager` in the database.

**Alternatively**, I can promote one of the existing user accounts to manager right now:
- `user1@gmail.com`
- `user2@gmail.com`
- `lance.g.arcega@gmail.com`

---

**Which approach do you prefer?** Promote an existing account, or create a fresh whitelist entry for a new signup?

