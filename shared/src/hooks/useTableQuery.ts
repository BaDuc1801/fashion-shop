import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { useQueryParams } from './useQueryParams';

type Options = {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSearch?: string;
};

export const useTableQuery = (options?: Options) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    defaultSearch = '',
  } = options || {};

  const { params, getNumber, setParams } = useQueryParams({
    page: defaultPage,
    limit: defaultLimit,
    search: defaultSearch,
  });

  const page = getNumber('page', defaultPage);
  const limit = getNumber('limit', defaultLimit);
  const search = params.search || '';

  const [searchText, setSearchText] = useState(search);
  const debouncedSearch = useDebouncedValue(searchText.trim(), 400);

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === search) return;

    setParams({
      search: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch, search, setParams]);

  const onPageChange = (page: number, limit?: number) => {
    setParams({
      page,
      limit,
    });
  };

  return {
    page,
    limit,
    search,
    searchText,
    setSearchText,
    onPageChange,
  };
};
