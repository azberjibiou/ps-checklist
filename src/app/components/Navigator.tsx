"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigator() {
  const { data: session, status } = useSession();
  return (
    <nav style={{ background: '#343a40', color: '#fff', padding: '0.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 700, fontSize: 22 }}>OI Checklist</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
        <Link href="/checklist" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>My Checklist</Link>
        <Link href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>FAQ</Link>
        <div style={{ color: '#fff', fontWeight: 500 }}>Useful Links ▼</div>
      </div>
      <div style={{ color: '#fff', fontSize: 15 }}>
        {status === "loading" ? (
          <span>로딩 중...</span>
        ) : session ? (
          <>
            Welcome, {session.user?.name} <button style={{ marginLeft: 12, background: '#495057', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }} onClick={() => signOut()}>로그아웃</button>
          </>
        ) : (
          <button style={{ background: '#495057', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }} onClick={() => signIn()}>로그인</button>
        )}
      </div>
    </nav>
  );
}
