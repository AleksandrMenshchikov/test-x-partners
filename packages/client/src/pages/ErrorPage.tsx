import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { NotFound } from '../components/not-found/NotFound.tsx';
import { ClientError } from '../components/client-error/ClientError.tsx';

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
  }

  return <ClientError />;
};
