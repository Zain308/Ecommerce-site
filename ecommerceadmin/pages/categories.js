import Layout from "@/components/Layout";

export default function Categories(){
    function saveCategory(){}

    return(
        <Layout>
<h1 className="text-blue-900 text-2xl font-bold mb-4 tracking-wide border-b-2 border-blue-200 pb-2">
  Categories
</h1>     
<label className="text-blue-900 text-base font-medium mb-1 block">
  New Category Name
</label>
<form onSubmit={saveCategory} className="flex gap-1 max-w-sm">
  <input
    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 outline-none"
    placeholder="Category Name"
    type="text"
  />
  <button
    type="submit"
    className="bg-blue-900 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
  >
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
    Save
  </button>
</form>
   </Layout>
    );
}