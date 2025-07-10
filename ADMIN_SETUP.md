# Admin-Only Portfolio Dashboard Setup

This portfolio application uses NextAuth.js with role-based authentication to ensure only one admin can access the dashboard.

## Features

- **Single Admin User**: Only one admin user can exist in the system
- **Role-Based Access**: Dashboard access is restricted to users with 'admin' role
- **Secure Authentication**: Uses bcrypt for password hashing
- **Middleware Protection**: All admin routes are protected by middleware

## Setup Instructions

### 1. Environment Variables

Make sure you have these environment variables in your `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Create Admin User

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/setup` in your browser

3. Fill out the form with:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: A strong password

4. Click "Create Admin User"

5. Once created, you'll be redirected to the login page

### 3. Access Dashboard

1. Go to `/admin/login`
2. Enter your email and password
3. You'll be redirected to the admin dashboard at `/admin`

## How It Works

### Authentication Flow

1. **Middleware Protection**: The `middleware.ts` file protects all `/admin/*` routes
2. **Role Check**: Only users with `role: 'admin'` can access protected routes
3. **Session Management**: NextAuth.js handles session persistence
4. **Database Validation**: User credentials are validated against MongoDB

### Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Single Admin Constraint**: The User model prevents multiple admin users
- **JWT Tokens**: Secure session management with JWT strategy
- **Protected Routes**: Middleware ensures unauthorized access is blocked

### File Structure

```
src/
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   └── dbConnect.ts         # Database connection
├── models/
│   └── User.ts              # User model with role support
├── app/
│   ├── admin/
│   │   ├── setup/           # Admin creation page
│   │   └── login/           # Admin login page
│   └── api/
│       └── admin/
│           └── setup/       # Admin creation API
middleware.ts                # Route protection
next-auth.d.ts              # TypeScript declarations
```

## API Endpoints

### POST /api/admin/setup
Creates the initial admin user.

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin user created successfully"
}
```

## Troubleshooting

### "Admin user already exists" Error
This means an admin user has already been created. You cannot create multiple admin users.

### "Cannot find module" Errors
Make sure you've installed all dependencies:
```bash
npm install bcryptjs @types/bcryptjs
```

### Database Connection Issues
1. Check your `MONGODB_URI` environment variable
2. Ensure MongoDB is running and accessible
3. Verify network connectivity

### Authentication Issues
1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your deployment URL
3. Clear browser cookies and try again

## Security Best Practices

1. **Strong Passwords**: Use a strong, unique password for admin access
2. **Environment Variables**: Never commit secrets to version control
3. **HTTPS**: Use HTTPS in production
4. **Regular Updates**: Keep dependencies updated
5. **Database Security**: Use MongoDB Atlas or secure your MongoDB instance

## Customization

### Adding More Roles
To add more roles (e.g., 'editor', 'viewer'):

1. Update the User model enum:
   ```typescript
   role: {
     type: String,
     enum: ['admin', 'editor', 'viewer'],
     default: 'viewer',
   }
   ```

2. Update middleware authorization logic
3. Modify the admin constraint if needed

### Changing Admin Constraints
To allow multiple admins, remove the pre-save hook in the User model.

### Custom Authentication Providers
Add more providers to `auth.ts`:
```typescript
providers: [
  CredentialsProvider({...}),
  GoogleProvider({...}),
  GitHubProvider({...})
]
``` 