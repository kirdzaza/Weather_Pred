import Link from "next/link";

export default function Notfound() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! 404 Page Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          We could not find the page you were looking for.
        </p>
        <p className="text-gray-600">
          Go back to the{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </p>
      </div>
    </main>
  );
}
