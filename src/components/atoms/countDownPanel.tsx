// components/SessionCountdown.tsx
import { useEffect, useState } from 'react';
import { useGetSessionExpiry } from '../hooks/UseGetSessionExpiry';

export const SessionCountdown = () => {
  const { getSessionExpiry, loading } = useGetSessionExpiry();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchExpiry = async () => {
      try {
        const { expiresAt } = await getSessionExpiry();
        const expiryTimestamp = Math.floor(new Date(expiresAt).getTime() / 1000); // Konversi ke detik
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = expiryTimestamp - now;
        setRemaining(timeLeft > 0 ? timeLeft : 0);
      } catch (err) {
        setRemaining(null);
      }
    };

    fetchExpiry();
  }, []);

  useEffect(() => {
    if (remaining === null) return;

    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  if (loading || remaining === null) return (
    <div className="flex items-center justify-center h-full bg-gray-300 bg-opacity-40 text-center rounded-md">
      <span>Loading..</span>
    </div>
  );

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const format = (num: number) => String(num).padStart(2, '0');

  return (
     <div className="flex flex-col items-center justify-center h-full px-4 py-1.5 mr-5 bg-white/5 backdrop-blur-sm backdrop-saturate-150  shadow-[0_4px_30px_rgba(173,216,230,0.15)] ring-1 ring-white/10">
        <p className="text-xs font-semibold text-greenlogo drop-shadow-sm mb-1 tracking-wide">
            Session Expired In
        </p>
        <div className="text-2xl font-light text-white tracking-widest drop-shadow-lg" style={{ fontFamily: 'Calibri, sans-serif' }}>
            {format(hours)}:{format(minutes)}:{format(seconds)}
        </div>
    </div>
  );
};
