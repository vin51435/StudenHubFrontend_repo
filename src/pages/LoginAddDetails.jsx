import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { TbDots, TbGenderFemale, TbGenderMale } from "react-icons/tb";

const LoginAddDetails = () => {
  const [form, setForm] = useState({
    gender: null,
    userType: null,
    organization: null,
    city: null
  });
  const [selectLoad, setSelectLoad] = useState(false);

  const userTypesArr = ['School Student', 'College Student', 'Professional'];

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

  const filter = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setSelectLoad(true);
      setTimeout(() => {
        resolve(filter(inputValue));
        setSelectLoad(false);
      }, 1000);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  console.log(form);

  return (
    <div className='signup-details d-flex justify-content-center align-items-center w-100'>
      <Row className='signup-details_container pb-2 justify-content-center align-items-center'>
        <Col lg='5' className='d-none d-lg-block'>hello1</Col>
        <Col lg='7' className=' px-0 h-100 d-flex flex-column justify-content-between align-items-center'>
          <div className='overflow-auto thin-scrollbar p-1 pt-4 px-4 flex-grow-1 d-flex flex-column justify-content-evenly'>
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
              <form className='d-flex h-100 flex-column justify-content-evenly'>
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
                      School Student
                    </label>
                    <input
                      className='radio-group_input'
                      type="radio"
                      id="collegeStudent"
                      name="userType" value="College Student"
                      checked={form.userType === "College Student"}
                      onChange={handleChange} />
                    <label htmlFor="collegeStudent" className='radio-group_label px-3 py-2'>
                      College Student
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
                </div>
                <div className='input-group mt-3'>
                  <input
                    type='text'
                    required
                    name='institute'
                    onChange={handleChange}
                    className='input-group_input' autoComplete="off" />
                  <label className='input-group_label'>Institute</label>
                </div>
                <div className='react-select-group position-relative mt-3'>
                  <AsyncSelect
                    className="async-select"
                    classNamePrefix="select"
                    isDisabled={false}
                    isLoading={selectLoad}
                    isClearable={true}
                    isSearchable={true}
                    name="color"
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseOptions}
                    placeholder={''}
                    onChange={e => setForm(prev => ({ ...prev, currentCity: e.value }))}
                  />
                  <label className=''>City</label>
                </div>
              </form>
            </div>
          </div>
          <div className='signup-details_btn_container p-3 w-100 d-flex justify-content-end align-items-center'>
            <button className='btn px-4 py-2'>Next</button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginAddDetails;;;