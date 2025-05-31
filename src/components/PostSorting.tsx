import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState } from 'react';

const POST_SORT_OPTIONS = ['Hot', 'New', 'Top', 'Controversial'];
const TIME_RANGE_OPTIONS = ['Now', 'Today', 'This Week', 'This Month', 'This Year', 'All Time'];

export default function PostSortDropdown({
  onChange,
}: {
  onChange: (sort: string, timeRange?: string) => void;
}) {
  const [sortType, setSortType] = useState('Hot');
  const [timeRange, setTimeRange] = useState('Today');

  const isTimeBased = (sort: string) => ['Top', 'Controversial'].includes(sort);

  const handleSortClick = ({ key }: { key: string }) => {
    setSortType(key);
    if (!isTimeBased(key)) {
      setTimeRange('');
      onChange(key);
    } else {
      onChange(key, timeRange);
    }
  };

  const handleTimeRangeClick = ({ key }: { key: string }) => {
    setTimeRange(key);
    onChange(sortType, key);
  };

  const sortMenu = {
    items: POST_SORT_OPTIONS.map((option) => ({ key: option, label: option })),
    onClick: handleSortClick,
  };

  const timeMenu = {
    items: TIME_RANGE_OPTIONS.map((option) => ({ key: option, label: option })),
    onClick: handleTimeRangeClick,
  };

  return (
    <div className="flex items-center gap-2">
      <Dropdown menu={sortMenu} trigger={['click']}>
        <Button className="capitalize">
          {sortType} <DownOutlined />
        </Button>
      </Dropdown>

      {isTimeBased(sortType) && (
        <Dropdown menu={timeMenu} trigger={['click']}>
          <Button className="capitalize">
            {timeRange || 'Select Range'} <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </div>
  );
}
