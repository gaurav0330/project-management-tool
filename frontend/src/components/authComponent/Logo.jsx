import React from 'react';
import { Boxes } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-blue-600">
      {/* <Boxes size={32} />
      <span className="text-xl font-semibold">YOJANADESK</span> */}
      <img
        src="/logo.png" // Replace with your logo path
        alt="Logo"
        className="w-8 h-8"
      />
    </div>
  );
};

export default Logo;