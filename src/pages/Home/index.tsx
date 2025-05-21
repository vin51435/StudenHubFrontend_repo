import { logoutSuccess } from '@src/redux/reducers/auth';
import { useDispatch } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();

  return (
    <div>
      Home
      <br />
      <button
        onClick={() => {
          dispatch(logoutSuccess());
        }}
      >
        Logout
      </button>
    </div>
  );
}
