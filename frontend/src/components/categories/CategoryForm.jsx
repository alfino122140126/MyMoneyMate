import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory, updateCategory } from '../../redux/categorySlice';

const CategoryForm = ({ categoryToEdit, onSave }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName('');
    }
  }, [categoryToEdit]);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryData = { name };

    if (categoryToEdit) {
      dispatch(updateCategory({ id: categoryToEdit.id, ...categoryData }));
    } else {
      dispatch(addCategory(categoryData));
    }

    setName('');
    if (onSave) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{categoryToEdit ? 'Edit Category' : 'Add New Category'}</h2>
      <div className="mb-4">
        <label htmlFor="categoryName" className="block text-gray-700 text-sm font-bold mb-2">
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {categoryToEdit ? 'Update Category' : 'Add Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;