import React from 'react';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { UserProvider } from '../context/UserContext';

const UserPage = () => {
  return (
    <UserProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Add New User</h2>
            <UserForm />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">User List</h2>
            <UserList />
          </div>
        </div>
      </div>
    </UserProvider>
  );
};

export default UserPage;