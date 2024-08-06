import { getData } from "@src/config/apiConfig";
import { loginSuccess } from "@src/redux/auth";
import { updateUserEdProfile } from "@src/redux/auth/userEducationProfile";

// const fetchUserInfo = (dispatch) => {
//   getData('USER_INFO', { baseURL: 'users' })
//     .then(response => {
//       const { data, token } = response.data;
//       const { user } = data;

//       if (user.education) {
//         dispatch(updateUserEdProfile({ user, userEdProfile: user.education }));
//       }
//       dispatch(loginSuccess({ token, user }));
//     })
//     .catch(error => {
//       console.error('Error fetching user info:', error);
//     });
// };
const fetchUserInfo = (dispatch) => {
  return new Promise((resolve, reject) => {
    getData('USER_INFO', { baseURL: 'users' })
      .then(response => {
        const { data, token } = response;
        const { user } = data;

        if (user?.education) {
          dispatch(updateUserEdProfile({ user, userEdProfile: user.education }));
        }
        dispatch(loginSuccess({ user, token }));
        resolve(response);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        reject(error);
      });
  });
};

export default fetchUserInfo;