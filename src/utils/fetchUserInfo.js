import { getData } from "@src/config/apiConfig";
import { loginSuccess } from "@src/redux/auth";

const fetchUserInfo = async (dispatch) => {
  try {
    const response = await getData('USER_INFO', {
      baseURL: 'users',
    });
    console.log({ response });
    dispatch(loginSuccess({ token: response.token, user: response.data.user }));
  } catch (error) {
    console.error('Error fetching user info:', error);
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - perhaps the user needs to log in.');
    } else {
      console.error('An error occurred:', error.message);
    }
  }
};

export default fetchUserInfo