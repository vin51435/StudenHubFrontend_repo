import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
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
  value: { sort: PostSortOption; timeRange: TimeRangeOption };
}) {
  const isTimeBased = (sort: string) => ['Top', 'Controversial'].includes(sort);

  const handleSortClick = ({ key }: { key: PostSortOption }) => {
    if (!isTimeBased(key)) {
      onChange(key); // drop range
    } else {
      onChange(key, value.timeRange ?? 'today'); // preserve existing or default range
    }
  };

  const handleTimeRangeClick = ({ key }: { key: TimeRangeOption }) => {
    onChange(value.sort, key);
  };

  const sortMenu = {
    items: POST_SORT_OPTIONS.map((option: PostSortOption) => ({ key: option, label: option })),
    onClick: handleSortClick,
  };

  const timeMenu = {
    items: TIME_RANGE_OPTIONS.map((option: TimeRangeOption) => ({ key: option, label: option })),
    onClick: handleTimeRangeClick,
  };

  return (
    <div className="flex items-center gap-2">
      <Dropdown menu={sortMenu} trigger={['click']}>
        <Button className="capitalize">
          {value.sort} <DownOutlined />
        </Button>
      </Dropdown>

      {isTimeBased(value.sort) && (
        <Dropdown menu={timeMenu} trigger={['click']}>
          <Button className="capitalize">
            {value.timeRange} <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
