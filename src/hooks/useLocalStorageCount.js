import { useState, useEffect } from 'react';

export const useLocalStorageCount = (key) => {
  const [count, setCount] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? parseInt(storedValue) : 0;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return 0;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const newValue = localStorage.getItem(key);
        setCount(newValue ? parseInt(newValue) : 0);
      } catch (error) {
        console.error("Error reading localStorage:", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, [key]);

  return count;
};