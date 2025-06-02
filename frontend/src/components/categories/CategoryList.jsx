import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategory } from '../../redux/categorySlice';

const CategoryList = () => {
  const categories = useSelector((state) => state.categories.items);
  const categoryStatus = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);


  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(categoryId));
    }
 };

  if (categoryStatus === 'loading') {
    return <div className="text-center text-gray-600">Loading categories...</div>;
  }

  if (categoryStatus === 'failed') {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
      {categories.length === 0 ? (
 <p className="text-center text-gray-600">Tidak ada kategori ditemukan. Tambahkan satu menggunakan formulir di bawah.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
 {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div>
                <button
 className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  // onClick={() => handleEdit(category)} // Implement edit functionality
 >
 Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
 className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          ))}
  );
};

export default CategoryList;