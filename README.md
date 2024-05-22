# Starter Project for React with TypeScript, Supabase, and Google Authentication

Welcome to the starter project! This repository is designed to help you quickly set up a modern web application using React, TypeScript, Webpack, Supabase, and Google Authentication. Follow the instructions below to get started and customize the project to suit your needs.

---

## Features

- **React with TypeScript**: Provides a strong foundation for building robust and scalable applications.
- **Webpack Configuration**: Pre-configured with code splitting and optimizations for production.
- **Supabase Integration**: Easily set up database and authentication with Supabase.
- **Google Authentication**: Implemented using Supabase's OAuth flow.
- **React Router**: Manage navigation and routes efficiently.

---

## Getting Started

### 1. Update Environment Variables

First, you need to set up your environment variables. Create a `.env` file in the root of your project and add your Supabase project credentials.

```bash
# .env
REACT_APP_SUPABASE_URL=https://your-supabase-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```


### 2. Set Up Google Authentication

If you plan to use Google for authentication, follow these steps:

1. **Create a Google Cloud Project**:
   - Follow the steps in this [YouTube tutorial](https://youtu.be/_XM9ziOzWk4?si=j3Bm7qszdDU2v_BQ) to create an application in Google Cloud Platform (GCP) and obtain your OAuth 2.0 credentials.

2. **Update Supabase Settings**:
   - In your Supabase dashboard, navigate to the Authentication section and configure the Google provider using the credentials obtained from GCP.


### 3. Database Trigger for Profile Creation

To automatically create user profiles in your Supabase database when new users sign up, use the following SQL trigger. Customize it with the profile attributes you need.

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

