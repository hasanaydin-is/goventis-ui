export default function App() {
  return (
    <main className="app" style={{ minHeight: '100vh' }}>
      <iframe
        id="contentFrame"
        className="main-frame"
        src="/pages/my-issues.html"
        title="Active page"
      />
    </main>
  );
}
