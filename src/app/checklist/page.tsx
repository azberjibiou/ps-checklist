"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navigator from "../components/Navigator";

interface Category {
  id: number;
  name: string;
  order: number;
}

export default function ChecklistPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetch("/api/user/category/root")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("카테고리 불러오기 실패");
        setLoading(false);
      });
  }, []);

  return (
  <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh' }}>
  <Navigator />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <div style={{ width: 700, background: '#fff' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 18, marginLeft: 4 }}>출처</h2>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', fontSize: 15, boxShadow: '0 1px 4px #eee' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e5e5', background: '#f7f7f7' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, fontSize: 15 }}>출처</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>    
                    <td style={{ padding: '8px 10px' }}>
                      <Link href={`/checklist/${cat.id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>
                        {cat.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
