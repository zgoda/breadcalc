import { useEffect, useState } from 'preact/hooks';

/**
 * @param {string} key
 * @param {any} defaultValue
 */
function getStorageValue(key, defaultValue) {
  if (typeof window !== undefined) {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
}

export const useLocalStorage = (
  /** @type {string} */ key,
  /** @type {any} */ defaulValue,
) => {
  const [value, setValue] = useState(() => getStorageValue(key, defaulValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
