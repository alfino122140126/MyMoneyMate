import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const handleChange = () => setMatches(getMatches(query));
    
    const matchMedia = window.matchMedia(query);
    
    // Initial check
    handleChange();
    
    // Listen for changes
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
    } else {
      // For older browsers
      matchMedia.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        matchMedia.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}