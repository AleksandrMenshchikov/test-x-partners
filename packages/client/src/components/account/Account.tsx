import { Link, useNavigate } from 'react-router-dom';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  BASE_URL,
  ТЕКСТ_ДОЛЖЕН_БЫТЬ_НЕ_КОРОЧНЕ_4_СИМВОЛОВ,
} from '../../shared/constants.ts';
import { useAppSelector } from '../../redux/store.ts';
import { selectUser } from '../../redux/features/userSlice.ts';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  useSignoutMutation,
  useUpdateUserMutation,
} from '../../redux/features/usersApi.ts';

const labelStyle = {
  width: '100%',
  maxWidth: '400px',
  textAlign: 'left',
  fontSize: '15px',
  marginBottom: '3px',
  paddingLeft: '14px',
  color: 'text.primary',
};

const inputStyle = {
  width: '100%',
  maxWidth: '400px',
  margin: '0 0 16px',
  textAlign: 'left',
};

export const Account = () => {
  const { user } = useAppSelector(selectUser);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [updateUser, { isLoading, data: dataUpdateUser }] =
    useUpdateUserMutation();
  const [signout, { data: dataSignout }] = useSignoutMutation();
  const navigate = useNavigate();
  const inputFileRef = useRef();

  useEffect(() => {
    if (dataUpdateUser) {
      (inputFileRef.current as unknown as HTMLInputElement).value = '';
      setPassword('');
    }

    if (dataSignout) {
      navigate('/signin');
    }
  }, [dataUpdateUser, dataSignout]);

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value.trimStart());
  }

  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();

    [...(e.target as HTMLFormElement).elements].forEach((element) => {
      if (element.nodeName === 'INPUT') {
        if ((element as HTMLInputElement).name === 'password') {
          if (
            (element as HTMLInputElement).value.trim().length < 4 &&
            (element as HTMLInputElement).value.trim().length > 0
          ) {
            setIsErrorPassword(true);
          } else {
            if ((element as HTMLInputElement).value.trim().length === 0) {
              setIsErrorPassword(false);
            } else {
              setIsErrorPassword(false);
              formData.append(
                (element as HTMLInputElement).name,
                (element as HTMLInputElement).value
              );
            }
          }
        } else {
          if ((element as HTMLInputElement).value.trim()) {
            if (
              (element as HTMLInputElement).type === 'file' &&
              (element as HTMLInputElement).files
            ) {
              formData.append(
                (element as HTMLInputElement).name,
                (element as HTMLInputElement).files![0]
              );
            } else {
              formData.append(
                (element as HTMLInputElement).name,
                (element as HTMLInputElement).value
              );
            }
          }
        }
      }
    });

    for (const item of formData) {
      if (item) {
        updateUser(formData);
        return;
      }
    }
  }

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Link to={'/people'} style={{ display: 'block', margin: '20px auto' }}>
        <Button variant={'outlined'}>Главная страница</Button>
      </Link>
      <Box
        component={'img'}
        alt={'фото пользователя'}
        src={`${BASE_URL}/avatars/${user?.image}`}
        sx={{
          width: 'auto',
          maxWidth: '200px',
          marginTop: '20px',
          maxHeight: '400px',
          borderRadius: '4px',
        }}
      />
      <Box
        component="form"
        sx={{ maxWidth: '400px', width: '100%' }}
        noValidate
        onSubmit={handleSubmit}
      >
        <InputLabel htmlFor="name" sx={{ ...labelStyle, marginTop: '20px' }}>
          Имя
        </InputLabel>
        <TextField
          id="name"
          name="name"
          variant="outlined"
          sx={inputStyle}
          type="text"
          size={'small'}
          defaultValue={(user && user.name) || ''}
          inputProps={{ maxLength: 250, minLength: 1 }}
          autoComplete={'off'}
        />
        <InputLabel htmlFor="password" sx={labelStyle}>
          Пароль
        </InputLabel>
        <TextField
          inputProps={{ maxLength: 250, minLength: 4 }}
          error={isErrorPassword}
          helperText={
            isErrorPassword && ТЕКСТ_ДОЛЖЕН_БЫТЬ_НЕ_КОРОЧНЕ_4_СИМВОЛОВ
          }
          name="password"
          autoComplete={'new-password'}
          sx={inputStyle}
          id="password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          size={'small'}
          onChange={handleChangePassword}
          value={password}
        />
        <InputLabel htmlFor="image" sx={labelStyle}>
          Фото пользователя
        </InputLabel>
        <TextField
          name="image"
          id="image"
          variant="outlined"
          sx={inputStyle}
          type="file"
          InputProps={{ inputProps: { accept: 'image/*' } }}
          size={'small'}
          inputRef={inputFileRef}
        />
        <Button
          type={'submit'}
          variant={'contained'}
          sx={{
            width: '100%',
            maxWidth: '400px',
            marginBottom: '10px',
            textTransform: 'none',
            fontSize: '16px',
          }}
        >
          Сохранить изменения
        </Button>
        <Button
          type={'button'}
          variant={'outlined'}
          sx={{
            width: '100%',
            maxWidth: '400px',
            marginBottom: '20px',
            marginTop: '10px',
            textTransform: 'none',
            fontSize: '16px',
          }}
          onClick={() => signout()}
        >
          Выйти из аккаунта
        </Button>
      </Box>
    </Container>
  );
};
