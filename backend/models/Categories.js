// pages/categories.js
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories') // باید یه API بسازی
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div dir="rtl">
      <h1>دسته‌بندی‌ها</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/categories');
  const categories = await res.json();
  return { props: { categories } };
}