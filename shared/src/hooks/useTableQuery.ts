import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { useQueryParams } from './useQueryParams';

type Options = {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSearch?: string;
  defaultSortPrice?: 'asc' | 'desc';
  defaultStatus?: string;
};

export const useTableQuery = (options?: Options) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    defaultSearch = '',
    defaultSortPrice = 'asc',
    defaultStatus = '',
  } = options || {};

  const { params, getNumber, setParams } = useQueryParams({
    page: defaultPage,
    limit: defaultLimit,
    search: defaultSearch,
    sortPrice: defaultSortPrice,
    status: defaultStatus,
  });

  const page = getNumber('page', defaultPage);
  const limit = getNumber('limit', defaultLimit);
  const search = params.search || '';
  const sortPrice = params.sortPrice || 'asc';
  const status = params.status || '';
  const [searchText, setSearchText] = useState(search);
  const [sortPriceState, setSortPriceState] = useState(defaultSortPrice);
  const debouncedSearch = useDebouncedValue(searchText.trim(), 400);

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === search) return;

    setParams({
      search: debouncedSearch,
      page: 1,
      sortPrice,
      status,
    });
  }, [debouncedSearch, search, setParams, sortPrice, status]);

  const onPageChange = (page: number, limit?: number) => {
    setParams({
      page,
      limit,
      sortPrice,
      status,
    });
  };

  const onSortPriceChange = (sortPrice: 'asc' | 'desc') => {
    setSortPriceState(sortPrice);
    setParams({
      sortPrice,
      status,
    });
  };

  return {
    page,
    limit,
    search,
    searchText,
    setSearchText,
    onPageChange,
    sortPrice,
    sortPriceState,
    onSortPriceChange,
    status,
  };
};
