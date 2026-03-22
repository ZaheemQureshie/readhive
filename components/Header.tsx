import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b-4 border-black bg-[#00FF00] p-4 sticky top-0 z-50 print:hidden">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-display font-black uppercase tracking-tighter hover:underline decoration-4 underline-offset-4">
          Readhive
        </Link>
        <div className="text-sm font-bold uppercase tracking-widest hidden sm:block">
          Collect & Read
        </div>
      </div>
    </header>
  );
}
