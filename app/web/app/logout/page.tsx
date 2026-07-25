'use client';

import api from '@/lib/api';
import { clearAuthStorage } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await api.post('/auth/logout-all-devices');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearAuthStorage();
        router.replace('/login');
      }
    };

    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-zinc-700">
      Logging out...
    </div>
  );
}
