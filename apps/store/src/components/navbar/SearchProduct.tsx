import { productService, useDebouncedValue } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Empty, Input } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SearchProduct = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [openSearch, setOpenSearch] = useState(false);

  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: products, isLoading } = useQuery({
    queryKey: ['search-products', debouncedSearch],
    queryFn: () =>
      productService.getProducts({
        search: debouncedSearch,
        lang: i18n.language,
      }),
    enabled: !!debouncedSearch,
  });

  return (
    <div className="relative w-[320px]">
      <Input.Search
        size="large"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setOpenSearch(true)}
        onBlur={() => setTimeout(() => setOpenSearch(false), 200)}
        onSearch={(value) => {
          if (!value.trim()) return;
          navigate(`/search?q=${value}`);
        }}
      />

      {openSearch && searchText && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md mt-2 z-50 max-h-[320px] overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-sm text-gray-400">Loading...</div>
          )}

          {!isLoading && products?.data?.length === 0 && (
            <Empty description="No products found" className="p-3" />
          )}

          {!isLoading &&
            products?.data?.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/products/${p.sku}`)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={p.images?.[0]}
                  className="w-10 h-10 rounded object-cover"
                  alt={p.name}
                />

                <div className="text-sm">
                  <div className="font-medium">
                    {i18n.language === 'vi' ? p.name : p.nameEn}
                  </div>
                  <div className="text-gray-500">${p.price}</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
