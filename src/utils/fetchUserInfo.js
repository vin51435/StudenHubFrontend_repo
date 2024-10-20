import { getData } from "@src/config/apiConfig";
import { loginSuccess, logoutSuccess } from "@src/redux/reducer";

const fetchUserInfo = async (dispatch) => {
  try {
    const response = await getData('USER_INFO', { baseURL: 'userAuth', queue: true });
    const { data: { user }, token, redirectUrl } = response;

    dispatch(loginSuccess({ user, token, redirectUrl }));

    return response; // You can directly return the response if needed
  } catch (error) {
    dispatch(logoutSuccess());
    throw error; // Re-throw the error if you need it to be handled elsewhere
  }
};

export default fetchUserInfo;