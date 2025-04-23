export default async function Page() {
  // Fetch data during server-side rendering
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 p-6">   
      <h1 className="text-3xl font-bold text-center mb-6">
        Server-side Rendering Example
      </h1>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="bg-black p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}