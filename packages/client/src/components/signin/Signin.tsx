import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import {
  ЗАПОЛНИТЕ_ЭТО_ПОЛЕ,
  ТЕКСТ_ДОЛЖЕН_БЫТЬ_НЕ_КОРОЧНЕ_4_СИМВОЛОВ,
} from '../../shared/constants.ts';
import * as validator from 'validator';
import { useLoginMutation } from '../../redux/features/usersApi.ts';
import { setUser } from '../../redux/features/userSlice.ts';
import { useAppDispatch } from '../../redux/store.ts';

const inputStyle = {
  width: '100%',
  maxWidth: '400px',
  margin: '0 0 16px',
  textAlign: 'left',
};

const labelStyle = {
  width: '100%',
  maxWidth: '400px',
  textAlign: 'left',
  fontSize: '15px',
  marginBottom: '3px',
  paddingLeft: '14px',
  color: 'text.primary',
};

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [login, { isLoading, isError, error, data }] = useLoginMutation();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError) {
      setIsOpenDialog(true);
    } else if (data) {
      dispatch(
        setUser((data as { data: { [index: string]: null | string } }).data)
      );
      navigate('/people', { replace: true });
    }
  }, [isError, data, navigate, dispatch]);

  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }

  function handleChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value.trimStart());
  }

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value.trimStart());
  }

  function handleCloseDialog() {
    setIsOpenDialog(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let isErrEmail = false;
    let isErrPassword = false;

    const obj = {
      email: '',
      password: '',
    };

    [...(e.target as HTMLFormElement).elements].forEach((element) => {
      if (element.nodeName === 'INPUT') {
        if ((element as HTMLInputElement).name === 'email') {
          if (!validator.isEmail((element as HTMLInputElement).value.trim())) {
            setIsErrorEmail(true);
            isErrEmail = true;
          } else {
            setIsErrorEmail(false);
            isErrEmail = false;
            obj.email = (element as HTMLInputElement).value;
          }
        } else if ((element as HTMLInputElement).name === 'password') {
          if ((element as HTMLInputElement).value.trim().length < 4) {
            setIsErrorPassword(true);
            isErrPassword = true;
          } else {
            setIsErrorPassword(false);
            isErrPassword = false;
            obj.password = (element as HTMLInputElement).value;
          }
        }
      }
    });

    if (!isErrEmail && !isErrPassword) {
      login(obj).unwrap();
    }
  }

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
        overflow: 'auto',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={isOpenDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Typography sx={{ color: 'var(--error-color)' }}>
            {isError &&
              'data' in error &&
              ((
                error.data as {
                  validation?: { body: { message: string } };
                }
              ).validation?.body.message ||
                (error.data as { message: string }).message)}
          </Typography>
        </DialogContent>
      </Dialog>
      <Typography
        component={'h1'}
        variant={'h5'}
        sx={{ m: '20px auto', fontWeight: '500' }}
      >
        Вход
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: '400px', width: '100%' }}
        noValidate
        onSubmit={handleSubmit}
      >
        <InputLabel htmlFor="email" sx={labelStyle}>
          Email *
        </InputLabel>
        <TextField
          error={isErrorEmail}
          helperText={isErrorEmail && ЗАПОЛНИТЕ_ЭТО_ПОЛЕ}
          name="email"
          id="email"
          required
          variant="outlined"
          sx={inputStyle}
          type="email"
          size={'small'}
          onChange={handleChangeEmail}
          value={email}
          autoComplete={'email'}
        />
        <InputLabel htmlFor="password" sx={labelStyle}>
          Пароль *
        </InputLabel>
        <TextField
          inputProps={{ maxLength: 250, minLength: 4 }}
          error={isErrorPassword}
          helperText={
            isErrorPassword && ТЕКСТ_ДОЛЖЕН_БЫТЬ_НЕ_КОРОЧНЕ_4_СИМВОЛОВ
          }
          name="password"
          autoComplete={'new-password'}
          required
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
          Войти
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
        <Typography>Нет аккаунта?</Typography>
        <Link to={'/signup'}>
          <Button
            sx={{ textTransform: 'none', fontSize: '16px' }}
            variant={'text'}
          >
            Зарегистрироваться
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
