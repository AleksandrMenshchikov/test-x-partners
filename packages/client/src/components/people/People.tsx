import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux/features/usersApi.ts';
import { BASE_URL } from '../../shared/constants.ts';

export const People = () => {
  const { isLoading, data } = useGetUsersQuery();

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={'/account'} style={{ display: 'block', margin: '20px auto' }}>
        <Button variant={'outlined'}>Мой аккаунт</Button>
      </Link>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {data && (
        <Box
          component={'ul'}
          sx={{
            m: '20px 0',
            padding: '0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '10px',
          }}
        >
          {(data.data as Record<string, unknown>[]).map((item) => (
            <Box
              key={item._id as string}
              component={'li'}
              sx={{
                listStyle: 'none',
                border: '1px solid grey',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component={'img'}
                alt={'фото пользователя'}
                src={`${BASE_URL}/avatars/${item.image}`}
                sx={{
                  width: 'auto',
                  maxWidth: '200px',
                  marginTop: '20px',
                  maxHeight: '400px',
                  borderRadius: '4px',
                }}
              />
              <Box component={'h4'} sx={{ textAlign: 'center' }}>
                {(
                  item as {
                    name: string;
                  }
                ).name || 'Пользователь'}
              </Box>
              <Box
                component={'p'}
                sx={{ margin: '0 0 20px', textAlign: 'center' }}
              >
                Дата рождения:{' '}
                {item.birthDate
                  ? new Date(item.birthDate as string).toLocaleDateString()
                  : '---'}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};
