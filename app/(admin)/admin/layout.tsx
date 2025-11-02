import React from 'react';
import Image from 'next/image';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
            <p className={'font-schibsted-grotesk'}>DevEvent</p>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
