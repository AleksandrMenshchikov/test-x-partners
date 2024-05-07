import { Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';

export const ClientError = () => {
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
        <title>Vite + React + TS</title>
      </Helmet>
      <Typography component="h1" variant="h5" mb={1}>
        Что-то пошло не так
      </Typography>
    </Container>
  );
};
