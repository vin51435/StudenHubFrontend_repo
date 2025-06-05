import { Dropdown, Button } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';
import {
  PostSortOption,
  TimeRangeOption,
  POST_SORT_OPTIONS,
  TIME_RANGE_OPTIONS,
} from '@src/types/contants';

export default function PostSortDropdown({
  onChange,
  value,
}: {
  onChange: (sort: PostSortOption, timeRange?: TimeRangeOption) => void;
  value: { sort: PostSortOption; timeRange?: TimeRangeOption };
}) {
  const isTimeBased = (sort: string) => ['Top', 'Controversial'].includes(sort);

  const handleSortClick = ({ key }: { key: PostSortOption }) => {
    console.log('sortclick', key);
    if (!isTimeBased(key)) {
      console.log('not time based');
      onChange(key);
    } else {
      console.log('time based');
      onChange(key, value.timeRange ?? 'today');
    }
  };

  const handleTimeRangeClick = ({ key }: { key: TimeRangeOption }) => {
    console.log('timerangekey', key);
    onChange(value.sort, key);
  };

  const sortMenu = {
    items: POST_SORT_OPTIONS.map((option: PostSortOption) => ({ key: option, label: option })),
    onClick: handleSortClick,
    className: 'ant-dropdown-menu-custom',
  };

  const timeMenu = {
    items: TIME_RANGE_OPTIONS.map((option: TimeRangeOption) => ({ key: option, label: option })),
    onClick: handleTimeRangeClick,
    className: 'ant-dropdown-menu-custom',
  };

  return (
    <div className="post-sorting_container flex items-center !bg-transparent gap-2">
      <Dropdown menu={sortMenu} overlayClassName="dark-dropdown" trigger={['click']}>
        <Button className="capitalize !bg-transparent">
          {value.sort} <IoIosArrowDown />
        </Button>
      </Dropdown>

      {isTimeBased(value.sort) && (
        <Dropdown menu={timeMenu} overlayClassName="dark-dropdown" trigger={['click']}>
          <Button className="capitalize !bg-transparent">
            {value.timeRange} <IoIosArrowDown />
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
