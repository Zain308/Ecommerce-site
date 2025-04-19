import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { ReactSortable } from 'react-sortablejs';
export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages = [],
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category,setCategory]=useState('');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [categories,setCategories]=useState([]);

  useEffect(()=>{
    axios.get('/api/categories').then(result =>{
      setCategories(result.data);
    });
  },[]);

  async function saveProduct(ev) {
    ev.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = {
        title,
        description,
        price: Number(price),
        images, // Make sure to include images in the data
        _id
      };

      if (_id) {
        await axios.put('/api/products', data);
      } else {
        await axios.post('/api/products', data);
      }
      
      router.push('/products');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (!files?.length) return;

    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      
      const res = await axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImages(prev => [...prev, ...res.data.links]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      ev.target.value = '';
    }
  }

  function updateImagesOrder(newImages) {
    console.log('New images order:', newImages);
    setImages(newImages);
  }
  return (
    <form onSubmit={saveProduct}>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {uploadError && <div className="text-red-500 mb-2">{uploadError}</div>}

      <label className="text-blue-900">Product Name</label>
      <input
        type="text"
        placeholder="product name"
        className="border-2 border-gray-300 rounded px-1 focus:border-blue-500 outline-none w-full mb-2"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        required
      />
      <label className="text-blue-900">Category</label>
<select 
  value={category} 
  onChange={ev => setCategory(ev.target.value)}
  className="mb-2 block w-full border-2 border-gray-300 rounded px-1 focus:border-blue-500 outline-none"
>
  <option value="">Uncategorized</option>
  {categories.length > 0 && categories.map(c => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>

      <label className="text-blue-900">Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
      <ReactSortable
  className="flex flex-wrap gap-1"
  list={images}
  setList={updateImagesOrder}
  disabled={uploading} // Disable sorting while uploading
>
  {images.map((link, index) => (
    <div key={index} className="h-24">
      <img src={link} alt="" className="h-full rounded-lg object-cover" />
    </div>
  ))}
</ReactSortable>
        <label
  className={`w-24 h-24 text-center flex flex-col items-center justify-center text-sm text-gray-500 rounded-lg cursor-pointer transition ${
    uploading ? 'bg-white' : 'bg-gray-200 hover:bg-gray-300'
  }`}
>
        {uploading ? (
            <span>
                <Spinner />
            </span>
            ) : (
            <>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
                </svg>
                <span>Upload</span>
                <input
                type="file"
                onChange={uploadImages}
                className="hidden"
                multiple
                accept="image/*"
                />
            </>
            )}
        </label>

       
      </div>

      <label className="text-blue-900">Product Description</label>
      <textarea
        placeholder="description"
        className="border-2 border-gray-300 rounded px-1 focus:border-blue-500 outline-none w-full mb-2"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        rows="4"
      />

      <label className="text-blue-900">Product Price (In USD$)</label>
      <input
        type="number"
        placeholder="price"
        className="border-2 border-gray-300 rounded px-1 focus:border-blue-500 outline-none w-full mb-2"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
        min="0"
        step="0.01"
        required
      />

      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
        disabled={isSubmitting || uploading}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}