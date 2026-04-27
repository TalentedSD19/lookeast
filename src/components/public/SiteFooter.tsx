export default function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-gray-400 text-sm py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        © {new Date().getFullYear()} LookEast. All rights reserved.
      </div>
    </footer>
  );
}
