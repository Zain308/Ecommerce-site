import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        await axios.put('/api/categories', {
          _id: editingCategory._id,
          name,
          parentCategory: parentCategory || null,
        });
      } else {
        await axios.post('/api/categories', {
          name,
          parentCategory: parentCategory || null,
        });
      }
      setName('');
      setParentCategory('');
      setEditingCategory(null);
      fetchCategories();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCategory(categoryId) {
    // First confirmation
    const confirmResult = await swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (!confirmResult.isConfirmed) return;
  
    try {
      // First try normal delete
      await axios.delete(`/api/categories?_id=${categoryId}`);
      fetchCategories();
      await swal.fire(
        'Deleted!',
        'Your category has been deleted.',
        'success'
      );
    } catch (err) {
      // Check if error is about subcategories
      if (err.response?.data?.error?.includes('subcategories')) {
        // Show force delete option
        const forceResult = await swal.fire({
          title: 'Category has subcategories',
          text: err.response.data.error,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete all including subcategories',
          cancelButtonText: 'Cancel'
        });
  
        if (forceResult.isConfirmed) {
          try {
            // Attempt force delete
            await axios.delete(`/api/categories?_id=${categoryId}&force=true`);
            fetchCategories();
            await swal.fire(
              'Deleted!',
              'Category and all subcategories have been deleted.',
              'success'
            );
          } catch (forceErr) {
            await swal.fire(
              'Error!',
              forceErr.response?.data?.error || 'Failed to force delete category',
              'error'
            );
          }
        }
      } else {
        // Other errors
        await swal.fire(
          'Error!',
          err.response?.data?.error || 'Failed to delete category',
          'error'
        );
      }
    }
  }
  function editCategory(category) {
    setEditingCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || '');
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName('');
    setParentCategory('');
  }

  
    return (
      <Layout>
        <h1 className="text-blue-900 text-2xl font-bold mb-4 tracking-wide border-b-2 border-blue-200 pb-2">
          Categories
        </h1>
        
        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            {editingCategory ? (
              <>
                <span className="text-blue-600">Editing: </span>
                <span className="font-bold">{editingCategory.name}</span>
              </>
            ) : (
              'Create New Category'
            )}
          </h2>
          
          {error && <div className="text-red-500 mb-3 p-2 bg-red-50 rounded">{error}</div>}
          
          <form onSubmit={saveCategory} className="space-y-3">
            <div className="flex flex-col">
              <label className="text-blue-900 text-sm font-medium mb-1">
                Category Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 outline-none"
                placeholder="Enter category name"
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-blue-900 text-sm font-medium mb-1">
                Parent Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={parentCategory}
                onChange={(ev) => setParentCategory(ev.target.value)}
              >
                <option value="">No parent category</option>
                {categories
                  .filter(c => !editingCategory || c._id !== editingCategory._id) // Prevent selecting self as parent
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  'Saving...'
                ) : editingCategory ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Update
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                  </>
                )}
              </button>
              
              {editingCategory && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
  
        {/* Categories List */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">All Categories</h2>
          
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-3 text-blue-900 font-bold uppercase text-left">
                      Category Name
                    </th>
                    <th className="p-3 text-blue-900 font-bold uppercase text-left">
                      Parent Category
                    </th>
                    <th className="p-3 text-blue-900 font-bold uppercase text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className={`border-b border-gray-200 ${
                        editingCategory?._id === category._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3 font-medium">{category.name}</td>
                      <td className="p-3 text-gray-600">
                        {category.parent ? category.parent.name : '-'}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => editCategory(category)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No categories created yet</p>
          )}
        </div>
      </Layout>
    );
}

const CategoriesWithSwal = withSwal(function CategoriesWrapper({ swal }) {
    return <Categories swal={swal} />;
  });
  
  export default CategoriesWithSwal;
  