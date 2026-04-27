import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-6xl font-bold text-brand-red mb-4">404</h1>
      <p className="text-gray-600 mb-6">This page could not be found.</p>
      <Link href="/" className="text-brand-red underline hover:no-underline">
        Go to homepage
      </Link>
    </div>
  );
}
