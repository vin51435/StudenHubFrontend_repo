import { SearchOutlined } from '@ant-design/icons';
import { useNotification } from '@src/contexts/NotificationContext';
import { get, put } from '@src/libs/apiConfig';
import { IPaginatedResponse } from '@src/types';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type IInterest = {
  name: string;
  imageURL: string;
};

const REQUIRED_INTEREST_COUNT = 3;

const SignupInterests: React.FC = () => {
  const [interests, setInterests] = useState<IInterest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { notif } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await get<IInterest, IPaginatedResponse>('GET_INTERESTS', {
        BASE_URLS: 'userFormats',
      });
      if (response.data) {
        setInterests(response.data);
      }
    } catch (e) {
      notif('Failed to load interests');
    }
  };

  const toggleSelection = (name: string) => {
    if (loading) return;

    setSelected((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selected.length < REQUIRED_INTEREST_COUNT) {
      setError(true);
      notif(`Select at least ${REQUIRED_INTEREST_COUNT} interests`, null, { timeOut: 5000 });
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await put<IInterest>('USER_SIGNUP_INTEREST', {
        BASE_URLS: 'auth',
        data: { interests: selected },
      });

      if (!res.redirectUrl) {
        navigate(getRoutePath('APP'));
      }
    } catch {
      notif('Unable to save');
    } finally {
      setLoading(false);
    }
  };

  const filteredInterests = interests.filter((interest) =>
    interest.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex justify-center items-center dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl flex flex-col items-center justify-center"
      >
        <div className="w-full text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Pick your favorite Topics/Interests
          </h1>
          <h6
            className={`text-sm mt-1 ${
              error ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Choose at least {REQUIRED_INTEREST_COUNT} – It'll help us personalize your feed.
          </h6>
        </div>

        <div className=" w-full mt-6 max-w-md">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
            <Input
              className="pl-10"
              size="large"
              placeholder="Search Interests"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="interest_grid w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredInterests.map((item, index) => {
            const isSelected = selected.includes(item.name);
            return (
              <div
                key={index}
                className={`image_grid_item relative rounded-lg overflow-hidden shadow-md cursor-pointer group transition-transform transform hover:scale-105 ${
                  isSelected ? 'ring-4 ring-blue-500 interest_selected' : ''
                }`}
                style={{
                  backgroundImage: `url(${item.imageURL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => toggleSelection(item.name)}
              >
                <div className="inset-0 bg-opacity-30 flex items-end">
                  <span className="text-white font-semibold p-2">{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex justify-end items-center mt-6 px-4">
          <span className="text-sm mr-4 text-gray-600 dark:text-gray-300">
            {selected.length} Selected
          </span>
          <Button type="primary" htmlType="submit" loading={loading}>
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupInterests;
