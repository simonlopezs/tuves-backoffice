import { VisibilityOff, Visibility, Key, PersonOutline } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../App'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState('simo@gmail.com')
  const [password, setPassword] = useState('000000')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, currentUser } = useContext(SessionContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser])

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  const handleLogin = () => {
    const credentials = {
      email, password
    }
    setLoading(true)
    login(credentials).then(() => setLoading(false))
  }

  return (
    <Stack justifyContent='center' onKeyUp={handleKeyUp} spacing={3} sx={{ width: '100vw', height: '100vh', boxSizing: 'border-box', p: '.5rem' }}>

      <h2 style={{ textAlign: 'center' }}>Tuves Backoffice</h2>

      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Usuario</InputLabel>
        <OutlinedInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <PersonOutline />
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
        <OutlinedInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          startAdornment={
            <InputAdornment position="start">
              <Key />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <LoadingButton size='large' onClick={handleLogin} disabled={!(email && password)} variant='contained' loading={loading}>
        Iniciar sesión
      </LoadingButton>

    </Stack>
  )
}
