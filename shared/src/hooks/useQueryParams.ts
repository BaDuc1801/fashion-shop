import { useSearchParams } from 'react-router-dom';

type Params = Record<string, string | number | undefined>;

export const useQueryParams = <T extends Params>(defaultValues?: T) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries()) as T;

  const mergedParams = {
    ...defaultValues,
    ...params,
  };

  const getNumber = (key: keyof T, fallback = 0) => {
    const value = mergedParams[key];
    return value ? Number(value) : fallback;
  };

  const setParam = (key: keyof T, value?: string | number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (value === undefined || value === '') {
        newParams.delete(String(key));
      } else {
        newParams.set(String(key), String(value));
      }

      return newParams;
    });
  };

  const setParams = (newValues: Partial<T>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      Object.entries(newValues).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      return newParams;
    });
  };

  const resetPage = () => {
    setParam('page' as keyof T, 1);
  };

  return {
    params: mergedParams,
    getNumber,
    setParam,
    setParams,
    resetPage,
  };
};
