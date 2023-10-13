import { useState } from "react";

/*
    Todo: Allow useLocalStorage to work well with TypeScript by using Generics ('T')
*/

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(
        "Error using local storage [hooks/use-local-storage.tsx]: ",
        error,
      );
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(
        "Error setting local storage value [hooks/use-local-storage.tsx]: ",
        error,
      );
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
