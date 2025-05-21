import { TbDots, TbGenderFemale, TbGenderMale, TbSchool } from 'react-icons/tb';
import { MdComputer } from 'react-icons/md';
import { GiSchoolBag } from 'react-icons/gi';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { get, post, put } from '@src/libs/apiConfig';
import { signupDetailsSchema, SignupDetailsSchema } from '@src/validation/authSchema';
import { Form, Row, Col, Radio, Input, Button, Select, Typography } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { IPaginatedResponse } from '@src/types';
import { debounce } from 'lodash';
import { SelectState } from '@src/types/app';
import { Gender, UserType } from '@src/types/enum';
import { useLoader } from '@src/hooks/useLoader';
import { ZodError } from 'zod';
import { useNavigate } from 'react-router-dom';

const SignupAddDetails: React.FC = () => {
  const [load, setLoad] = useState<boolean>(false);
  const [touched, setTouched] = useState(false);
  const [selectState, setSelectState] = useState<SelectState>({
    load: true,
    options: { cities: [] },
    values: null,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = useCallback(
    debounce((value?: string) => {
      setSelectState((prev) => ({ ...prev, load: true }));
      get<IPaginatedResponse<string>>(`GET_CITIES`, {
        BASE_URLS: 'userFormats',
        queries: [{ searchValue: value ?? '' }],
      }).then((res) => {
        setSelectState((prev) => ({
          ...prev,
          options: { cities: res.data.map((state) => ({ label: state, value: state })) },
          load: false,
        }));
      });
    }, 500),
    []
  );

  const handleFinish = () => {
    console.log('handlefineish');
    const values = form.getFieldsValue(); // Get raw form values without validation
    setTouched(true);

    try {
      signupDetailsSchema.parse(values); // Validate with Zod only
      setLoad(true);

      put('USER_SIGNUP_DETAILS', {
        BASE_URLS: 'auth',
        data: values,
      }).finally(() => setLoad(false));
    } catch (zodError) {
      if (zodError instanceof ZodError) {
        console.log('error', zodError);
        const fieldErrors = zodError.errors.map((err) => ({
          name: err.path,
          errors: [err.message],
        }));

        console.log('fiedlErrors', fieldErrors);
        form.setFields(fieldErrors);
      }
      return; // Stop submission if validation fails
    }
  };

  const handleFormChange = () => {
    if (!touched) return;

    const values = form.getFieldsValue(true);

    try {
      signupDetailsSchema.parse(values); // Clear ALL errors manually
      const fieldNames = Object.keys(values);
      const clearedErrors = fieldNames.map((name) => ({
        name: [name],
        errors: [],
      }));
      form.setFields(clearedErrors);
    } catch (err) {
      if (err instanceof ZodError) {
        const zodFields = Object.keys(values);
        const errorMap: Record<string, string> = {};
        err.errors.forEach((e) => {
          errorMap[e.path[0] as string] = e.message;
        });

        const updatedFields = zodFields.map((name) => ({
          name: [name],
          errors: errorMap[name] ? [errorMap[name]] : [],
        }));

        form.setFields(updatedFields);
      }
    }
  };

  const genderIcons = {
    [Gender.Male]: <TbGenderMale size={20} className="mr-0.5" />,
    [Gender.Female]: <TbGenderFemale size={20} className="mr-0.5" />,
    [Gender.Other]: <TbDots size={20} className="mr-0.5" />,
  };

  const userTypeIcons = {
    [UserType.Student]: <GiSchoolBag size={20} className="mr-0.5" />,
    [UserType.CollegeStudent]: <TbSchool size={20} className="mr-0.5" />,
    [UserType.Teacher]: <LuBriefcaseBusiness size={20} className="mr-0.5" />,
    [UserType.Professional]: <MdComputer size={20} className="mr-0.5" />,
    // [UserType.Other]: <TbDots size={20} className="mr-0.5" />,
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="signup-details pb-3 flex justify-center items-center w-full">
        <Row
          gutter={16}
          className="signup-details_container w-full max-w-6xl overflow-hidden flex justify-center items-center"
        >
          {/* <Col xl={12} className="hidden xl:flex h-full justify-center items-center">
            <div>hello</div>
            <Button onClick={() => fetchCities()}>fetch</Button>
          </Col> */}
          <Col
            // xl={12}
            xl={24}
            className="signup-details_right_container custom-scrollbar !w-full overflow-auto flex flex-col justify-between items-center h-full px-0"
          >
            <div className="signup-details-header_container !w-full overflow-auto p-3 pb-1 pt-6 flex-grow flex flex-col justify-evenly">
              <div className="flex flex-col">
                <Typography.Text type="secondary">Alright! Two more steps</Typography.Text>
                <Typography.Text strong className="!text-3xl">
                  A little more about you.
                </Typography.Text>
              </div>
              <div className="border-t my-2" />

              <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
                onChange={handleFormChange}
                className="form-pb4 flex flex-col gap-4"
                disabled={load}
              >
                <Form.Item label="Gender" name="gender">
                  <Radio.Group>
                    {Object.entries(Gender).map(([key, value]) => (
                      <Radio key={value} value={value}>
                        <span className="flex justify-center items-center">
                          {genderIcons[value]}
                          {value}
                        </span>
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="User Type" name="userType">
                  <Radio.Group>
                    {Object.entries(UserType).map(([key, value]) => (
                      <Radio key={value} value={value}>
                        <span className="flex justify-center items-center">
                          {userTypeIcons[value]}
                          {value}
                        </span>
                      </Radio>
                    ))}
                  </Radio.Group>

                  {/* {!userTypesArr.includes(form.userType) && form.userType !== null && (
                    <Input
                      name="userType"
                      placeholder="Other"
                      className="mt-2"
                    />
                  )} */}
                </Form.Item>

                <Form.Item label="Institute" name="institute">
                  <Input placeholder="Institute" autoComplete="off" />
                </Form.Item>

                <Form.Item label="City" name="currentCity">
                  <Select
                    className="async-select"
                    showSearch
                    onSearch={(search) => fetchCities(search)}
                    loading={selectState.load}
                    options={selectState.options.cities}
                    value={selectState.values?.cities}
                    placeholder="Select City"
                    onChange={(value, fullOption) => {
                      setSelectState((prev) => ({
                        ...prev,
                        values: { cities: fullOption },
                      }));
                      form.setFieldValue('currentCity', value);
                    }}
                  />
                </Form.Item>

                <div className="p-3 w-full flex justify-end items-center">
                  <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" className="px-4 py-2 text-base">
                      Next
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default SignupAddDetails;
