import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import { fetchCategories } from '../redux/categorySlice';

const CategoryPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6"> {/* Increased padding */}
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Add/Edit Category</h2>
          <CategoryForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Categories</h2> {/* Slightly simpler heading */}
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;