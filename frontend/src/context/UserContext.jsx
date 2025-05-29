import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = '/api/users'; // Replace with your actual backend URL if different

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (err) {
      setError(err);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(apiUrl, userData);
      setUsers([...users, response.data]);
    } catch (err) {
      setError(err);
      console.error('Error adding user:', err);
      throw err; // Re-throw to allow component to handle errors
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${apiUrl}/${userId}`, userData);
      setUsers(users.map(user => (user.id === userId ? response.data : user)));
    } catch (err) {
      setError(err);
      console.error('Error updating user:', err);
      throw err; // Re-throw to allow component to handle errors
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${apiUrl}/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err);
      console.error('Error deleting user:', err);
      throw err; // Re-throw to allow component to handle errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};