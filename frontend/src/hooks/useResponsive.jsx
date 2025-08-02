// In useResponsive.js - Add device detection
import { useState, useEffect } from "react";
export function useResponsive() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // ✅ Enhanced breakpoint detection
      if (width < 640) setBreakpoint('mobile');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Better mobile detection
  const isTouchDevice = typeof window !== "undefined" && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  return {
    ...dimensions,
    breakpoint,
    isTouchDevice,
    // ✅ Modified logic - prioritize width over device type
    isMobile: dimensions.width < 1024,
    isTablet: dimensions.width >= 768 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024, // This will be true for mobile-in-desktop-mode
    isActualMobile: isTouchDevice && dimensions.width < 1024,
    isMobileInDesktopMode: isTouchDevice && dimensions.width >= 1024
  };
}
