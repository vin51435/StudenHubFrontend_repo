import React, { useCallback, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { TbDots, TbGenderFemale, TbGenderMale } from "react-icons/tb";
import { MdOutlineSchool } from "react-icons/md";
import { LuPencilRuler } from "react-icons/lu";
import fetchOptions from '@src/utils/fetchOptions';
import validateForm from '@src/utils/validators';
import { putData } from '@src/config/apiConfig';
import debounceImmediate from '@src/utils/debounceImmediate';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupAddDetails = () => {
  const [form, setForm] = useState({
    gender: null,
    userType: null,
    institute: null,
    currentCity: null
  });
  const [pageLoad, setPageLoad] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [select, setSelect] = useState({ load: false, inputValue: '', page: 1 });
  const { redirectUrl } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectUrl !== location.pathname) {
      navigate('/home');
    }
  }, [redirectUrl, location]);

  const formInfo = [
    { name: 'gender', type: 'text', required: true, message: 'Select gender' },
    { name: 'userType', type: 'text', required: true, message: 'Select user type' },
    { name: 'institute', type: 'text', required: true, message: 'Enter your institute' },
    { name: 'currentCity', type: 'text', required: true, message: 'Enter your city' },
  ];

  const userTypesArr = ['School Student', 'College Student', 'Professional'];

  const loadMoreOptions = useCallback(debounceImmediate((inputValue, callback) => {
    setSelect(prev => ({ ...prev, load: true }));
    fetchOptions('GET_CITY_STATES', inputValue, { page: select.page })
      .then(response => {
        const { options, hasMore } = response;
        callback(options);
        if (hasMore.totalPages > select.page) {
          setSelect(prev => ({ ...prev, page: prev.page + 1 }));
        }
      })
      .catch(e => console.error('error: ', e))
      .finally(() => setSelect(prev => ({ ...prev, load: false })));
  }, 1000),
    []
  );

  const formValidation = (formInfo, formData) => {
    const validation = validateForm(formInfo, formData);
    setValidationError(validation.isValid ? {} : validation);
    return validation.isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = formValidation(formInfo, form);
    if (valid) {
      setPageLoad(true);
      putData('USER_SIGNUP_ADDITIONAL_DETAILS', {
        baseURL: 'userAuth',
        data: form
      })
        .then(response => {
          if (response.status === 'success') {
            navigate('/interests');
          }
        })
        .catch((e) => { console.log(e); })
        .finally(() => setPageLoad(false));
    }
  };

  return (
    <Container fluid={'xxl'} className='w-100 h-100 d-flex justify-content-center align-items-center'>
      <div className='signup-details pb-3 d-flex justify-content-center align-items-center w-100'>
        {pageLoad && <PageLoadingSpinner />}
        <Row className='signup-details_container overflow-hidden justify-content-center align-items-center'>
          <Col xl='6' className='d-none d-xl-block h-100 d-flex justify-content-center align-items-center'>
            <div>hello</div></Col>
          <Col xl='6' className='signup-details_right_container px-0 h-100 d-flex flex-column justify-content-between align-items-center'>
            <div className='overflow-auto thin-scrollbar p-3 pb-1 pt-md-4 px-md-4 w-100 flex-grow-1 d-flex flex-column justify-content-evenly'>
              <div className='signup-details-header_container'>
                <div className='d-flex justify-content-center align-items-center'>
                  <div className='d-flex justify-content-center align-items-center'>-</div>
                  <div>
                    <span>Alright! Two more steps</span>
                    <h3>A little more about you.</h3>
                  </div>
                </div>
                <div className='text-divider' />
              </div>
              <div className='form mt-1 flex-grow-1 '>
                <form className='d-flex gap-2 h-100 flex-column justify-content-evenly'>
                  <div className="radio-group mt-3">
                    <span>Gender</span>
                    <div>
                      <input
                        className='radio-group_input'
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        onChange={handleChange} />
                      <label htmlFor="male" className='radio-group_label px-3 py-2'>
                        <TbGenderMale className='fs-4 me-1' />Male
                      </label>
                      <input
                        className='radio-group_input'
                        type="radio"
                        id="female"
                        name="gender"
                        value="female" onChange={handleChange} />
                      <label htmlFor="female" className='radio-group_label px-3 py-2'>
                        <TbGenderFemale className='fs-4 me-1' />Female
                      </label>
                      <input
                        className='radio-group_input'
                        type="radio"
                        id="otherGender"
                        name="gender"
                        value="other"
                        onChange={handleChange} />
                      <label htmlFor="otherGender" className='radio-group_label px-3 py-2'>
                        <TbDots className='fs-5 me-1' />
                        Other
                      </label>
                    </div>
                    {validationError?.errors?.gender && <span className='radio-group_error'>{validationError?.errors?.gender}</span>}
                  </div>
                  <div className="radio-group mt-3">
                    <span>User Type</span>
                    <div>
                      <input
                        className='radio-group_input'
                        type="radio"
                        id="schoolStudent"
                        name="userType"
                        value="School Student"
                        checked={form.userType === "School Student"}
                        onChange={handleChange} />
                      <label htmlFor="schoolStudent" className='radio-group_label px-3 py-2'>
                        <LuPencilRuler className='fs-5 me-1' />School Student
                      </label>
                      <input
                        className='radio-group_input'
                        type="radio"
                        id="collegeStudent"
                        name="userType" value="College Student"
                        checked={form.userType === "College Student"}
                        onChange={handleChange} />
                      <label htmlFor="collegeStudent" className='radio-group_label px-3 py-2'>
                        <MdOutlineSchool className='fs-4 me-1' />College Student
                      </label>

                      <input
                        className='radio-group_input' type="radio"
                        id="professional"
                        name="userType"
                        value="Professional"
                        checked={form.userType === "Professional"}
                        onChange={handleChange} />
                      <label htmlFor="professional" className='radio-group_label px-3 py-2'>
                        Professional
                      </label>

                      <input
                        className='radio-group_input'
                        type="radio"
                        id="otherUserType"
                        name="userType"
                        value="Other"
                        checked={(!userTypesArr.includes(form.userType)) && (form.userType !== null)}
                        onChange={handleChange}
                      />
                      <label htmlFor="otherUserType" className='radio-group_label px-3 py-2'>
                        Other
                      </label>

                      {(!userTypesArr.includes(form.userType) && (form.userType !== null)) && <div className='input-group mt-3'>
                        <input
                          type='text'
                          id='otherType'
                          className='input-group_input'
                          name='userType'
                          value={form.userType ?? ''}
                          autoComplete="off"
                          onChange={handleChange}
                        />
                        <label htmlFor='otherType' className='input-group_label'>Other</label>
                      </div>}
                    </div>
                    {validationError?.errors?.userType && <span className='radio-group_error'>{validationError?.errors?.userType}</span>}
                  </div>
                  <div className='input-group mt-3'>
                    <input
                      type='text'
                      required
                      id='institute'
                      name='institute'
                      onChange={handleChange}
                      className='input-group_input' autoComplete="off" />
                    <label htmlFor='institute' className='input-group_label'>Institute</label>
                    {validationError?.errors?.institute && <span className='input-group_error'>{validationError?.errors?.institute}</span>}
                  </div>
                  <div className='react-select-group position-relative mt-3'>
                    <AsyncSelect
                      className="async-select"
                      classNamePrefix="select"
                      isDisabled={false}
                      isLoading={select.load}
                      isClearable={true}
                      isSearchable={true}
                      name="currentCity"
                      // cacheOptions
                      // menuShouldScrollIntoView={true}
                      defaultOptions
                      loadOptions={(inputValue, callback) => loadMoreOptions(inputValue, callback)}
                      // onMenuScrollToBottom={() => loadMoreOptions(select.inputValue, () => { })}
                      inputValue={select.inputValue}
                      placeholder={''}
                      onChange={e => setForm(prev => ({ ...prev, currentCity: e?.value ?? '' }))}
                      onInputChange={e => setSelect(prev => ({ ...prev, inputValue: e, page: 1 }))}
                    />
                    <label className='react-select-group_label'>City</label>
                    {validationError?.errors?.currentCity && <span className='react-select-group_error'>{validationError?.errors?.currentCity}</span>}
                  </div>
                </form>
              </div>
            </div>
            <div className='signup-details_btn_container p-3 w-100 d-flex justify-content-end align-items-center'>
              <button className='btn px-3 py-2 px-md-4 py-md-2 fs-6' onClick={handleSubmit}>Next</button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default SignupAddDetails;;;;