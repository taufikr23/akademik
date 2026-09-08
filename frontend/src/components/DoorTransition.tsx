import { useState, useEffect } from 'react';

export const triggerDoorTransition = (onCloseFinished: () => void) => {
  // Simpan flag di sessionStorage agar terbaca setelah navigasi
  sessionStorage.setItem('door-opening', 'true');
  onCloseFinished();
};

export default function DoorTransition() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Mengecek apakah flag animasi pintu menyala
    const isOpening = sessionStorage.getItem('door-opening') === 'true';
    
    if (isOpening) {
      // 1. Render pintunya di tengah (tertutup penuh)
      setIsRendered(true);
      
      // 2. Tunggu sebentar agar browser selesai melukis (paint) Dashboard di belakang pintu
      // lalu mulai jalankan animasi terbukanya
      setTimeout(() => {
        setShouldAnimate(true);
        sessionStorage.removeItem('door-opening');
        
        // 3. Setelah animasi selesai (2.5 detik), hilangkan pintunya dari DOM
        setTimeout(() => {
          setIsRendered(false);
          setShouldAnimate(false);
        }, 2600);
      }, 50); // delay pendek untuk menjamin transisi CSS terpicu
    }
  }, []);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none flex">
      {/* 
        Pintu Kiri: 
        Default w-1/2 (50% layar). 
        Saat shouldAnimate = true, translateX(-100%) agar bergeser ke kiri. 
      */}
      <div 
        className={`w-1/2 h-full bg-primary-900 flex items-center justify-end overflow-hidden border-r-2 border-primary-500/50 shadow-[15px_0_30px_rgba(0,0,0,0.8)] transition-transform duration-[2500ms] ease-out ${
          shouldAnimate ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="w-1.5 h-full bg-gradient-to-b from-transparent via-primary-400 to-transparent"></div>
      </div>
      
      {/* 
        Pintu Kanan: 
        Default w-1/2 (50% layar). 
        Saat shouldAnimate = true, translateX(100%) agar bergeser ke kanan. 
      */}
      <div 
        className={`w-1/2 h-full bg-primary-900 flex items-center justify-start overflow-hidden border-l-2 border-primary-500/50 shadow-[-15px_0_30px_rgba(0,0,0,0.8)] transition-transform duration-[2500ms] ease-out ${
          shouldAnimate ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="w-1.5 h-full bg-gradient-to-b from-transparent via-primary-400 to-transparent"></div>
      </div>
    </div>
  );
}
