print('Creating read-only user.')

// Switch to the admin DB
db = db.getSiblingDB('admin')

// Create a read-only user for local development
db.createUser({
  user: 'readonly',
  pwd: 'readonly_password',
  roles: [
    {
      role: 'readAnyDatabase',
      db: 'admin',
    },
  ],
})

print('Created read-only user.')
