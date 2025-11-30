'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊', color: 'bg-blue-200 border-blue-400' },
        { name: 'Tickets', href: '/tickets', icon: '🎫', color: 'bg-yellow-200 border-yellow-400' },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col fixed left-0 top-12 border-r-3 border-black shadow-lg">

            {/* Navigation Items */}
            <nav className="flex-1 p-3 space-y-2">
                <p className="text-xs text-gray-500 px-2 mb-2">- SECTIONS -</p>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-all ${isActive
                                ? `${item.color} border-current shadow-md`
                                : 'bg-white border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className={`w-8 h-8 border-2 rounded flex items-center justify-center text-lg ${isActive ? 'border-current' : 'border-gray-400 bg-gray-100'
                                }`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                {isActive && <p className="text-xs text-gray-600">Active...</p>}
                            </div>
                            {isActive && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
