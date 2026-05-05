import { Input } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';

export type AddressSuggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export const AddressAutocomplete = ({
  onSelect,
}: {
  onSelect: (address: { address: string; lat: string; lng: string }) => void;
}) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  const searchAddress = async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: keyword,
        format: 'json',
        addressdetails: 1,
        limit: 5,
      },
    });

    setSuggestions(res.data);
  };

  const debouncedSearch = useMemo(() => debounce(searchAddress, 500), []);

  return (
    <div className="relative">
      <Input
        required
        value={value}
        size="large"
        placeholder="Enter address"
        onChange={(e) => {
          setValue(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />

      {suggestions.length > 0 && (
        <div className="absolute bg-white border w-full z-50 max-h-60 overflow-auto">
          {suggestions.map((item) => (
            <div
              key={item.place_id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setValue(item.display_name);
                setSuggestions([]);

                onSelect({
                  address: item.display_name,
                  lat: item.lat,
                  lng: item.lon,
                });
              }}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
