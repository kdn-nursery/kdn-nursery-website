import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f3eee4",
          color: "#1a2b22",
          fontFamily: "Georgia, serif",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <main>
          <h1>Page not found / பக்கம் காணப்படவில்லை</h1>
          <p>
            <Link href="/en">English home</Link> · <Link href="/ta">தமிழ் முகப்பு</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
