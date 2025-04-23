import { notFound } from 'next/navigation'
 
export default function ProductPage({ params }) {
 
  if (!params.id) {
    notFound()
  }
 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <p>Product ID: {params.id}</p>
    </div>
  )
}
 