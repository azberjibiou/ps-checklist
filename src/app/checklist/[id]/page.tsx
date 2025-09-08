"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navigator from "../../components/Navigator";


interface Category {
  id: number;
  name: string;
  order: number;
}

interface CategoryApiResponse {
  type: 'category';
  id: number;
  name: string;
  path: { id: number; name: string }[];
  children: Category[];
}
interface ContestApiResponse {
  type: 'contest';
  contests: any[];
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [categoryChildren, setCategoryChildren] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryPath, setCategoryPath] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/category/${id}`)
      .then((res) => res.json())
      .then((data: CategoryApiResponse | ContestApiResponse) => {
        if (data.type === 'category') {
          setCategoryChildren(data.children);
          setCategoryName(data.name);
          setCategoryPath(data.path || []);
        } else if (data.type === 'contest') {
          // 추후 contest 처리
        }
        setLoading(false);
      })
      .catch((e) => {
        setError("카테고리 정보를 불러올 수 없습니다.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <Navigator />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px 0 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{categoryName}</h1>
        <div style={{ fontSize: 13, color: '#888' }}>
          {categoryPath.map((cat, idx) => (
            <span key={cat.id}>
              {idx > 0 && <span style={{ margin: '0 4px' }}>/</span>}
              <a href={`/checklist/${cat.id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>{cat.name}</a>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 40px' }}>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', fontSize: 15, boxShadow: '0 1px 4px #eee' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e5e5', background: '#f7f7f7' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, fontSize: 15 }}>출처</th>
                </tr>
              </thead>
              <tbody>
                {categoryChildren.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                    <td style={{ padding: '8px 10px' }}>
                      <a href={`/checklist/${cat.id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>
                        {cat.name}
                      </a>
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
