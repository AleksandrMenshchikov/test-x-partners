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
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import {
  FEMALE,
  MALE,
  ЗАПОЛНИТЕ_ЭТО_ПОЛЕ,
  ТЕКСТ_ДОЛЖЕН_БЫТЬ_НЕ_КОРОЧНЕ_4_СИМВОЛОВ,
} from '../../shared/constants.ts';
import * as validator from 'validator';
import { useCreateUserMutation } from '../../redux/features/usersApi.ts';

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

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<typeof MALE | typeof FEMALE | ''>('');
  const [createUser, { isLoading, isError, error, data }] =
    useCreateUserMutation();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      setIsOpenDialog(true);
    } else if (data) {
      navigate('/people', { replace: true });
    }
  }, [isError, data, navigate]);

  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }

  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value.trimStart());
  }

  function handleChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value.trimStart());
  }

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value.trimStart());
  }

  function handleChangeGender(
    e: SelectChangeEvent<typeof MALE | typeof FEMALE | ''>
  ) {
    if (
      e.target.value === MALE ||
      e.target.value === FEMALE ||
      e.target.value === ''
    ) {
      setGender(e.target.value);
    }
  }

  function handleChangeBirthDate(e: ChangeEvent<HTMLInputElement>) {
    setBirthDate(e.target.value.trimStart());
  }

  function handleCloseDialog() {
    setIsOpenDialog(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let isErrEmail = false;
    let isErrPassword = false;

    const formData = new FormData();

    [...(e.target as HTMLFormElement).elements].forEach((element) => {
      if (element.nodeName === 'INPUT') {
        if ((element as HTMLInputElement).name === 'email') {
          if (!validator.isEmail((element as HTMLInputElement).value.trim())) {
            setIsErrorEmail(true);
            isErrEmail = true;
          } else {
            setIsErrorEmail(false);
            isErrEmail = false;
            formData.append(
              (element as HTMLInputElement).name,
              (element as HTMLInputElement).value
            );
          }
        } else if ((element as HTMLInputElement).name === 'password') {
          if ((element as HTMLInputElement).value.trim().length < 4) {
            setIsErrorPassword(true);
            isErrPassword = true;
          } else {
            setIsErrorPassword(false);
            isErrPassword = false;
            formData.append(
              (element as HTMLInputElement).name,
              (element as HTMLInputElement).value
            );
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

    if (!isErrEmail && !isErrPassword) {
      createUser(formData).unwrap();
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
        Регистрация
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: '400px', width: '100%' }}
        noValidate
        onSubmit={handleSubmit}
      >
        <InputLabel htmlFor="name" sx={labelStyle}>
          Имя
        </InputLabel>
        <TextField
          id="name"
          name="name"
          variant="outlined"
          sx={inputStyle}
          type="text"
          size={'small'}
          value={name}
          onChange={handleChangeName}
          inputProps={{ maxLength: 250 }}
        />
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
        <InputLabel htmlFor="birthDate" sx={labelStyle}>
          Дата рождения
        </InputLabel>
        <TextField
          name="birthDate"
          id="birthDate"
          variant="outlined"
          sx={inputStyle}
          type="date"
          inputProps={{ sx: { color: grey[700] } }}
          size={'small'}
          onChange={handleChangeBirthDate}
          value={birthDate}
        />
        <InputLabel htmlFor="gender" sx={labelStyle}>
          Пол
        </InputLabel>
        <Select
          labelId="gender"
          sx={inputStyle}
          inputProps={{
            name: 'gender',
            id: 'gender',
          }}
          size={'small'}
          value={gender}
          onChange={handleChangeGender}
        >
          <MenuItem value="">-</MenuItem>
          <MenuItem value={MALE}>Мужской</MenuItem>
          <MenuItem value={FEMALE}>Женский</MenuItem>
        </Select>
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
          Зарегистрироваться
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
        <Typography>Уже есть аккаунт?</Typography>
        <Link to={'/signin'}>
          <Button
            sx={{ textTransform: 'none', fontSize: '16px' }}
            variant={'text'}
          >
            Войти
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
