import { IoMdSearch } from 'react-icons/io';
import { getData, postData } from '@src/config/apiConfig';
import debounceImmediate from '@src/utils/debounceImmediate';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SmallSpinner from '@src/components/common/LoadingSpinner';
import userSVG from '@src/assets/svg/defaul-user.svg';
import { useSelector } from 'react-redux';

const DeskSearch = ({ handleOutsideClick, isSearch }) => {
  const [searchData, setSearchData] = useState({ value: '', load: false, response: [] });
  const { user: { _id } } = useSelector((state) => state.auth);

  // Create a debounced version of the searchUsers function
  const debouncedSearchUsers = useCallback(debounceImmediate(searchUsers, 1000), []);

  useEffect(() => {
    return () => {
      debouncedSearchUsers.cancel();
    };
  }, []);

  async function searchUsers(searchValue) {
    if (searchValue) {
      const response = await getData('SEARCH_USERS', {
        baseURL: 'userFormats',
        queries: [{ searchValue }, { userId: _id ?? '' }],
      });
      setSearchData(prev => ({ ...prev, response, load: false }));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchData((prev) => ({ ...prev, value, load: Boolean(value) }));
    debouncedSearchUsers(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debouncedSearchUsers.cancel();
    await searchUsers(searchData.value);
  };

  async function userOnClick(id) {
    handleOutsideClick('close');
    const res = await postData('CHAT_ID', {
      baseURL: 'users',
      data: {
        userBId: id
      }
    });
    console.log('res', res);
  }

  return (
    <div className="search-bar d-flex align-items-center justify-content-start flex-column">
      <form className='form w-100' autoComplete='off' onSubmit={handleSubmit}>
        <div className='input-group w-100 mt-2'>
          <input
            id='signup-interest_input'
            className='input-group_input fs-6'
            autoComplete="off"
            type='text'
            name='search'
            autoFocus={isSearch}
            value={searchData.value ?? ''}
            placeholder=' '
            onChange={handleInputChange}
          />
          <label className='input-group_label' htmlFor='signup-interest_input'>
            <IoMdSearch className='input-group_label_icon' />
            Search
          </label>
        </div>
      </form>
      <div className='result_container w-100 h-100 d-flex justify-content-center'>
        {searchData.load ?
          <div className='spinner mt-3 fs-3'>
            <SmallSpinner />
          </div> :
          <div className="user-search-results mt-1 w-100">
            {searchData.response?.data?.users.length > 0 ? (
              searchData.response?.data?.users.map((user, index) => (
                <div
                  key={index}
                  className="user-item px-2 py-2"
                  onClick={() => userOnClick(user._id)}
                >
                  <img
                    src={user.profilePicture || userSVG} // Fallback image if no profile picture
                    alt={`${user.firstName} ${user.lastName}`}
                    className="user-item__image"
                  />
                  <div className="user-item__info">
                    <h4 className="user-item__name">{`${user.firstName} ${user.lastName}`}</h4>
                    <h6 className="user-item__username">@{user.username}</h6>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-user">{searchData.value.length !== 0 ? 'No users found' : ''}</p>
            )
            }
          </div>
        }
      </div>
    </div >
  );
};

export default DeskSearch;