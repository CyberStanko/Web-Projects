"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from an API (example: placeholder API)
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">Client-side Rendering Example</h1>
          <ul className="space-y-4">
            {data.map((post) => (
              <li key={post.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600">{post.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}