'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Upload', href: '/admin/upload', icon: '⬆️' },
  { name: 'Galleries', href: '/admin/galleries', icon: '🖼️' },
  { name: 'Best Of', href: '/admin/best-of', icon: '⭐' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r-4 border-near-black min-h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-8 border-b-4 border-near-black">
        <Link href="/admin/dashboard">
          <h1 className="text-2xl font-bold tracking-tight">
            COOPER<br />
            OF THE<br />
            CROP
          </h1>
        </Link>
        <p className="text-sm text-gray mt-2">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 mb-2
                border-2 border-near-black
                font-medium transition-colors
                ${isActive 
                  ? 'bg-near-black text-white' 
                  : 'bg-white text-near-black hover:bg-off-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t-2 border-light-gray">
        <Link 
          href="/"
          className="block text-center text-sm text-gray hover:text-near-black"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
