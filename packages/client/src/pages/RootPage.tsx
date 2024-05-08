import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetUserQuery } from '../redux/features/usersApi.ts';
import { Backdrop, CircularProgress } from '@mui/material';
import { useAppDispatch } from '../redux/store.ts';
import { setUser } from '../redux/features/userSlice.ts';

export const RootPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isError, data } = useGetUserQuery();
  const dispatch = useAppDispatch();
  const [showOutlet, setShowOutlet] = useState(false);

  useEffect(() => {
    if (isError) {
      if (!['/signin', '/signup'].includes(location.pathname)) {
        navigate('/signin', { replace: true });
      }
      setShowOutlet(true);
    } else if (data) {
      dispatch(
        setUser((data as { data: { [index: string]: null | string } }).data)
      );
      if (!['/people', '/account'].includes(location.pathname)) {
        navigate('/people', { replace: true });
      }
      setShowOutlet(true);
    }
  }, [isError, data, dispatch, navigate]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (showOutlet) {
    return <Outlet />;
  }
};
