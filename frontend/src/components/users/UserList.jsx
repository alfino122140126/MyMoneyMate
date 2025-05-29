import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

const UserList = () => {
  const { users, fetchUsers, deleteUser } = useContext(UserContext);

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                onClick={() => {
                  // TODO: Implement edit functionality (e.g., navigate to edit form or show modal)
                  console.log('Edit user:', user.id);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;