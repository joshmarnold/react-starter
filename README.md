Set up a web application using Vercel, React, Redux, React-Router, TypeScript, Vite, and Supabase.

---

## Features

- **React with TypeScript**: Provides a strong foundation for building robust and scalable applications.
- **Vite Configuration**: Pre-configured with code splitting and optimizations for production.
- **Supabase Integration**: database, edge functions and authentication
- **React Router**: Manage navigation and routes efficiently.

---

## Getting Started

### 1. Update Environment Variables

Set up environment variables. Create a `.env` file at the project's root and add the Supabase project credentials.

```bash
# .env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Set Up Google Authentication

For Google authentication, follow these steps:

1. **Create a Google Cloud Project**:

   - Follow the steps in this [YouTube tutorial](https://youtu.be/_XM9ziOzWk4?si=j3Bm7qszdDU2v_BQ) to create an application in Google Cloud Platform (GCP) and obtain your OAuth 2.0 credentials.

2. **Update Supabase Settings**:
   - In the Supabase dashboard, navigate to the Authentication section and configure the Google provider using the credentials obtained from GCP.

### 3. Database Trigger for Profile Creation

Use the following SQL trigger to automatically create user profiles in your Supabase database when new users sign up. Customize with the profile attributes you need.

```sql
create or replace function public.create_profile_from_auth()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, profile_picture, username)
  values (new.id, new.email, new.raw_user_meta_data->>'avatar_url', substring(new.email from '^[^@]+'))
  on conflict (id) do nothing;

  return new;
end;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_profile_from_auth();
```

This function ensures that every new authenticated user has a corresponding profile created in the profiles table.

### 4. Install Dependencies and Run Locally

Install the project dependencies using yarn:

```bash
yarn install
```

Then, start the dev server:

```bash
yarn vite
```

This will start the Vite development server, and you can view the project at http://localhost:5173.

### 5. Deploy with Vercel

1. Create a Vercel Account: If you don't already have one, create a Vercel account.
2. Link GitHub Repository:
   - In Vercel, click on "New Project" and then "Import Git Repository."
   - Authenticate with GitHub and select your repository.
3. Configure Environment Variables:
   -  In your Vercel project dashboard, go to "Settings" -> "Environment Variables" and add the same environment variables from your .env file.
4. Deploy:
   - After linking the repository, Vercel will automatically deploy the project whenever you push changes to the repository.
   - You can also trigger a manual deployment from the Vercel dashboard.



