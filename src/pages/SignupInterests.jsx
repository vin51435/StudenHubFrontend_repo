import { useNotification } from '@src/context/NotificationContext';
import { getData, putData } from '@src/config/apiConfig';
import { loginSuccess } from '@src/redux/reducer';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupInterests = () => {
  const [interest, setInterest] = useState({ selected: [], search: '', data: [], error: null, required: null });
  const [load, setLoad] = useState(false);
  const { redirectUrl } = useSelector(state => state.auth);
  const { notif } = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (redirectUrl !== location.pathname) {
      navigate('/home');
    }
    getData('GET_INTERESTS', {
      baseURL: 'userFormats'
    })
      .then((response) => {
        if (response.data) {
          setInterest(prev => ({ ...prev, data: response.data.interests, required: response.data.required }));
        }
      });
  }, [location, redirectUrl]);

  const handleCheckboxChange = (event) => {
    if (load) return;
    const { value, checked } = event.target;
    if (checked) {
      setInterest((prev) => ({ ...prev, selected: [...prev.selected, value] }));
    } else {
      setInterest((prev) => ({ ...prev, selected: prev.selected.filter((option) => option !== value) }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (interest.selected.length < interest.required) {
      setInterest(prev => ({ ...prev, error: true }));
      notif(`Select at least ${interest.required} interest`, null, { timeOut: 5000 });
      return;
    }
    setInterest(prev => ({ ...prev, error: false }));
    setLoad(true);
    putData('USER_SIGNUP_INTEREST', {
      baseURL: 'userAuth',
      data: { interests: interest.selected }
    })
      .then(response => {
        if (response.status === 'success') {
          navigate('/home');
          navigate(0);
        }
      })
      .catch(e => {
        notif('Unable to save');
      })
      .finally(() => { setLoad(false); });
  };

  return (
    <Container fluid={'xxl'} className='signup-interest_container w-100 h-100 d-flex justify-content-center align-items-center'>
      <form className='w-lg-75 h-100 d-flex justify-content-center align-items-center flex-column'>
        <div className='w-100'>
          <h1 className='interest_header'>Pick your favorite Topics/Interest</h1>
          <h6 className={`interest_subheader ${interest.error ? 'red-text' : ''}`}>Choose at least {interest.required} - It'll help us personalize your feed the way you like it.</h6>
        </div>
        <div className='input-group mt-md-4 mt-2'>
          <input
            id='signup-interest_input'
            className='input-group_input fs-6' autoComplete="off"
            type='text'
            name='search'
            required={false}
            value={interest.search ?? ''}
            placeholder=' '
            onChange={(e) => setInterest(prev => ({ ...prev, search: e.target.value }))}
          />
          <label className='input-group_label' htmlFor='signup-interest_input'>
            <IoMdSearch className='input-group_label_icon' />
            Search Interest</label>
        </div>
        <div className='interest_grid w-100'>
          {interest.data.map((ele, i) => (
            <div
              className={`image_grid_item `}
              style={{
                backgroundImage: `url(${ele.imageURL})`,
              }}
              key={`${i}-interest-key`}
            >
              <input
                className=''
                type="checkbox"
                id={`${i}-interest-value`}
                name="form"
                value={ele.name ?? ''}
                checked={interest.selected.includes(ele.name)}
                hidden={true}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`${i}-interest-value`} className={`image_text p-2 ${interest.selected.includes(ele.name) ? 'interest_selected' : ''}`}>
                {ele.name}
              </label>
            </div>
          ))}
        </div>
        <div className='signup-interest-btn_container px-3 py-2 d-flex justify-content-end align-items-center'>
          <span className='me-2'>{interest.selected.length} Selected</span>
          <button className='btn' onClick={handleSubmit} disabled={load}>
            Proceed
          </button>
        </div>
      </form>
    </Container>
  );
};

export default SignupInterests;