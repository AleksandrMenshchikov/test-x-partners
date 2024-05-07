import { Button, Container, Typography, Link as MuiLink } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Helmet>
        <title>404 Страница не найдена</title>
      </Helmet>
      <Typography component="h1" variant="h3" mb={1}>
        404
      </Typography>
      <Typography component="p" variant="h6" mb={1}>
        Страница не найдена
      </Typography>
      <Typography component="p" mb={2}>
        Неправильно набран адрес или такой страницы не существует
      </Typography>
      <MuiLink to={'/'} component={Link} sx={{ textDecoration: 'none' }}>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', fontSize: '16px' }}
        >
          Перейти на главную страницу{' '}
        </Button>
      </MuiLink>
    </Container>
  );
};
