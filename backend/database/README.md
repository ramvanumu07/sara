# 🗄️ EduBridge Fresh Database Setup

## 📋 Setup Instructions

### Step 1: Delete All Existing Tables
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run this command to delete all existing tables:

```sql
-- Delete all existing tables (be careful!)
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### Step 2: Create Fresh Schema
1. In the same **SQL Editor**, copy and paste the entire contents of `fresh-schema.sql`
2. Click **Run** to execute the schema
3. Verify all tables were created successfully

### Step 3: Test the Schema
1. In your terminal, navigate to the backend directory
2. Run the test script:
```bash
node test-fresh-schema.js
```

## 🎯 What This Creates

### Tables Created:
- ✅ **users** - Student accounts and authentication
- ✅ **admins** - Admin privileges management  
- ✅ **progress** - Learning progress tracking
- ✅ **chat_history** - AI conversation storage

### Default Admin Account:
- **Student ID**: `admin`
- **Password**: `password`
- **Has Access**: `true`
- **Admin Privileges**: `true`

## 🔐 Login Credentials

After setup, you can login with:
- **Admin**: `admin` / `password`
- **Students**: Register new accounts or grant access to existing ones

## 🚀 Next Steps

1. **Test Login**: Try logging in with admin credentials
2. **Create Students**: Register new student accounts
3. **Grant Access**: Use admin panel to grant access to students
4. **Start Learning**: Begin using the platform!

## 🛠️ Schema Features

- **Clean Structure**: No legacy columns or confusion
- **Proper Indexes**: Optimized for performance
- **Auto Timestamps**: Automatic created_at/updated_at
- **Foreign Keys**: Proper relationships between tables
- **Admin System**: Built-in admin user management

## 📊 Schema Verification

The `test-fresh-schema.js` script will verify:
- ✅ All tables exist and are accessible
- ✅ Admin user is created with proper privileges
- ✅ Schema matches application expectations
- ✅ Database connection is working

## 🔄 If Something Goes Wrong

1. **Check Supabase Logs**: Look for any SQL errors
2. **Re-run Schema**: Delete tables and run fresh-schema.sql again
3. **Test Connection**: Ensure your .env credentials are correct
4. **Run Test Script**: Use test-fresh-schema.js to diagnose issues

---

**Your EduBridge database is now ready for a fresh start! 🎉**