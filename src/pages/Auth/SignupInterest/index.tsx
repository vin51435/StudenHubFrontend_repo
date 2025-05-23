import { SearchOutlined } from '@ant-design/icons';
import { useNotification } from '@src/contexts/NotificationContext';
import { get, put } from '@src/libs/apiConfig';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Input, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupInterests: React.FC = () => {
  const [interest, setInterest] = useState({
    selected: [] as string[],
    search: '',
    data: [] as { name: string; imageURL: string }[],
    error: null as null | boolean,
    required: 3,
  });
  const [load, setLoad] = useState(false);
  const { notif } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    getInterests();
  }, []);

  async function getInterests() {
    get('GET_INTERESTS', {
      BASE_URLS: 'userFormats',
    }).then((response) => {
      if (response.data) {
        setInterest((prev) => ({
          ...prev,
          data: response.data.interests,
          // required: response.data.required,
        }));
      }
    });
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (load) return;
    const { value, checked } = event.target;
    if (checked) {
      setInterest((prev) => ({ ...prev, selected: [...prev.selected, value] }));
    } else {
      setInterest((prev) => ({
        ...prev,
        selected: prev.selected.filter((option) => option !== value),
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (interest.selected.length < interest.required) {
        setInterest((prev) => ({ ...prev, error: true }));
        notif(`Select at least ${interest.required} interest`, null, { timeOut: 5000 });
        return;
      }
      setInterest((prev) => ({ ...prev, error: false }));
      setLoad(true);
      const res = await put('USER_SIGNUP_INTEREST', {
        BASE_URLS: 'auth',
        data: { interests: interest.selected },
      });
      console.log(res);
      if (!res.redirectUrl) {
        navigate(getRoutePath('APP'));
      }
    } catch (e) {
      notif('Unable to save');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 px-4">
      <form className="w-full max-w-6xl h-full flex flex-col items-center justify-center">
        <div className="w-full text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Pick your favorite Topics/Interest
          </h1>
          <h6
            className={`text-sm mt-1 ${
              interest.error ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Choose at least {interest.required} - It'll help us personalize your feed the way you
            like it.
          </h6>
        </div>

        <div className="w-full mt-6 max-w-md">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <Input
              className="pl-10"
              size="large"
              placeholder="Search Interest"
              value={interest.search ?? ''}
              onChange={(e) => setInterest((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {interest.data.map((ele, i) => {
            const isSelected = interest.selected.includes(ele.name);
            return (
              <div
                key={`${i}-interest-key`}
                className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer group transition-transform transform hover:scale-105`}
                style={{
                  backgroundImage: `url(${ele.imageURL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(e, ele.name)}
                  className="absolute top-2 left-2 z-10"
                />
                <div
                  className={`absolute bottom-0 w-full p-2 bg-black bg-opacity-50 text-white text-center font-medium ${
                    isSelected ? 'bg-opacity-80' : ''
                  }`}
                >
                  {ele.name}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex justify-end items-center mt-6 px-4">
          <span className="text-sm mr-4 text-gray-600 dark:text-gray-300">
            {interest.selected.length} Selected
          </span>
          <Button type="primary" onClick={handleSubmit} loading={load}>
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupInterests;
