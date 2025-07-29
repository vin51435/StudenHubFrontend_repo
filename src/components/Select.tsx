import { searchModel } from '@src/api/searchModel';
import { ICommunity } from '@src/types/app';
import { Select, SelectProps, Avatar, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

const { Option } = Select;

type SelectType = 'FollwedCommunities' | 'Users';

type BaseData = {
  _id: string;
  [key: string]: any;
};

type FetchFn<T = any> = (search: string, page: string, pageSize: string) => Promise<T[]>;
type RenderFn<T = any> = (item: T) => React.ReactNode;

const PAGE_SIZE = '10';

/* ----------------- Fetchers ----------------- */
const fetchFollowedCommunities: FetchFn<ICommunity> = async (search, page, pageSize) => {
  const res = await searchModel<ICommunity>('center', 'COMMUNITY_FOLLOWS', {
    searchValue: search,
    page,
    pageSize,
  });
  return res.data;
};

const fetchUsers: FetchFn = async (search, page, pageSize) => {
  const response = await fetch(
    `/api/users?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`
  );
  return await response.json();
};

/* ----------------- Renderers ----------------- */
const renderCommunityOption: RenderFn<ICommunity> = (item) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Avatar src={item.avatarUrl} size="small" />
    <span>r/{item.name}</span>
  </div>
);

const renderUserOption: RenderFn = (item) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Avatar src={item.avatar} size="small" />
    <span>{item.name}</span>
  </div>
);

/* ----------------- Mapping ----------------- */
const fetchMap: Record<SelectType, FetchFn> = {
  FollwedCommunities: fetchFollowedCommunities,
  Users: fetchUsers,
};

const renderMap: Record<SelectType, RenderFn> = {
  FollwedCommunities: renderCommunityOption,
  Users: renderUserOption,
};

/* ----------------- Component ----------------- */
interface CustomSelectProps<T = any> extends Omit<SelectProps, 'value'> {
  type: SelectType;
  handleChange: (value: string, fullData?: T) => void;
  selectValue?: { value: string; label: React.ReactNode } | string | null;
  defaultData?: T[];
}

const CustomSelect = ({
  type,
  selectValue,
  defaultData = [],
  handleChange,
  ...props
}: CustomSelectProps) => {
  const [data, setData] = useState<BaseData[]>(defaultData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const fetchFn = fetchMap[type];
  const renderFn = renderMap[type];

  const fetchData = useCallback(
    async (search = '', pageRaw = 1) => {
      setLoading(true);
      try {
        const pageStr = String(pageRaw);
        const result = await fetchFn(search, pageStr, PAGE_SIZE);

        const existingIds = new Set(result.map((item) => item._id));
        const merged = [...defaultData.filter((item) => !existingIds.has(item._id)), ...result];

        setData((prev) => {
          const newData = pageRaw === 1 ? merged : [...prev, ...result];
          return Array.from(new Map(newData.map((item) => [item._id, item])).values());
        });
      } catch (err) {
        console.error(`Failed to fetch ${type}`, err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, type]
  );

  useEffect(() => {
    if (defaultData) {
      setData(defaultData);
    }
  }, [defaultData]);

  useEffect(() => {
    fetchData('', 1);
  }, [fetchData]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      setPage(1);
      fetchData(text, 1);
    },
    [fetchData]
  );

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 50 && !loading) {
      const nextPage = page + 1;
      try {
        setLoading(true);
        const nextResults = await fetchFn(searchText, String(nextPage), PAGE_SIZE);
        if (nextResults.length > 0) {
          setData((prev) => {
            const deduped = Array.from(
              new Map([...prev, ...nextResults].map((item) => [item._id, item])).values()
            );
            return deduped;
          });
          setPage(nextPage);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectChange = (value: string) => {
    const fullDataa = data.find((d) => d._id === value);
    if (fullDataa) {
      handleChange(value, fullDataa);
    }
  };

  const formattedValue = useMemo(() => {
    if (!selectValue || !data) return null;
    const id = typeof selectValue === 'string' ? selectValue : selectValue?.value;
    const item = data.find((d) => d._id === id);
    return item ? { value: item._id, label: renderFn(item) } : undefined;
  }, [selectValue, data, renderFn]);

  return (
    <Select
      showSearch
      placeholder="Select an option"
      loading={loading}
      {...props}
      style={{ width: '100%' }}
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      // value={selectValue}
      value={formattedValue as any}
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      onChange={handleSelectChange}
    >
      {data &&
        data.length > 0 &&
        data.map((item) => {
          if (!item || !item._id) return null;
          return (
            <Option key={item._id} value={item._id} label={renderFn(item)}>
              {renderFn(item)}
            </Option>
          );
        })}
    </Select>
  );
};

export default CustomSelect;
