const validators = {
  text: (value, { required }) => {
    if ((required && !value?.trim())) {
      return 'This field is required';
    }
    return null;
  },
  email: (value, { required }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (required && !value?.trim()) {
      return 'Email is required';
    }
    if (value && !emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },
  number: (value, { required }) => {
    if (required && !value?.trim()) {
      return 'This field is required';
    }
    if (value && isNaN(value)) {
      return 'Invalid number';
    }
    return null;
  },
  password: (value, { required }) => {
    if (required && !value?.trim()) {
      return 'This field is required';
    }
    if (value?.length < 6) {
      return 'The password should be atleast 6 Characters Long.';
    }
    return null;
  },
  confirmPassword: (value, { required, formData }) => {
    if (required && !value?.trim()) {
      return 'This field is required';
    }
    if (value !== formData.password) {
      return 'Password does not match.';
    }
    return null;
  },
  // Add more validators as needed (e.g., password, date, etc.)
};

const validateForm = (formInfo, formData) => {
  const errors = {};
  const invalidFields = [];
  const validFields = [];

  formInfo.forEach(({ name, type, required, message }) => {
    const value = formData[name];
    const validator = validators[type];

    if (validator) {
      const error = validator(value, { required, formData });
      if (error) {
        errors[name] = message || error;
        invalidFields.push(name);
      } else {
        validFields.push(name);
      }
    } else {
      errors[name] = 'Unknown validation type';
      invalidFields.push(name);
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    invalidFields,
    validFields
  };
};

export default validateForm;
