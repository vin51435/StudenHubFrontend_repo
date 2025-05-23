import { ZodError } from 'zod';
import { FormInstance } from 'antd';

function setZodErrorsToForm(zodError: ZodError, form: FormInstance) {
  const errorFields = zodError.errors.map((error) => ({
    name: error.path,
    errors: [error.message],
  }));

  form.setFields(errorFields);
}

export { setZodErrorsToForm };
