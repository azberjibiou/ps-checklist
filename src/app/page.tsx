
"use client";

import Navigator from "./components/Navigator";

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <Navigator />

      {/* 메인 소개 섹션 */}
      <section style={{ background: '#e9ecef', margin: 24, borderRadius: 8, padding: '3rem 2rem 2rem 2rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: 64, fontWeight: 400, marginBottom: 16 }}>Checklist for OI Problems</h1>
        <div style={{ fontSize: 22, color: '#495057', marginBottom: 16 }}>
          A complete answer to the question, "How to excel at IOI-style contests?".
        </div>
        <hr style={{ margin: '24px 0' }} />
        <div style={{ color: '#343a40', fontSize: 16, marginBottom: 24 }}>
          Hope this can help anyone preparing for future OIs.
        </div>
        <button style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 28px', fontSize: 18, cursor: 'pointer' }}>Learn more »</button>
      </section>

      {/* 3단 설명 섹션 */}
      <section style={{ display: 'flex', justifyContent: 'space-around', margin: '48px 0 0 0', padding: '0 32px' }}>
        <div style={{ maxWidth: 340 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Keep track of OI problems</h2>
          <div style={{ fontSize: 18, color: '#343a40' }}>
            This checklist contains 1169 hard and interesting problems, with appropriate judge links given. You can keep track of your solved problems and get motivated to solve more.
          </div>
        </div>
        <div style={{ maxWidth: 340 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Pick the best suitable problem</h2>
          <div style={{ fontSize: 18, color: '#343a40' }}>
            By hovering on a problem you can see the number of perfect scorers on that problem in official contest, also, the percentage of points scored on that problem. Using those you can pick the best suitable problem for yourself!
          </div>
        </div>
        <div style={{ maxWidth: 340 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Keep track of others</h2>
          <div style={{ fontSize: 18, color: '#343a40' }}>
            You can share your checklist with your friends and they can share theirs too. Keep track of each other and solve more and more interesting problems together!
          </div>
        </div>
      </section>
    </div>
  );
}