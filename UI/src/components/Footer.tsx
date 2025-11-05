export default function Footer() {
  return (
    <footer className="bg-black border-t border-white">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} MANTRIQ. All rights reserved.
      </div>
    </footer>
  );
}