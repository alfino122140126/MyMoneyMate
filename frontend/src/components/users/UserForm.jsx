import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const UserForm = ({ userToEdit, onFormSubmit }) => {
  const { addUser, updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
      });
    } else {
      setFormData({
        username: '',
        email: '',
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToEdit) {
      await updateUser(userToEdit.id, formData);
    } else {
      await addUser(formData);
    }
    setFormData({ username: '', email: '' });
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {userToEdit ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;