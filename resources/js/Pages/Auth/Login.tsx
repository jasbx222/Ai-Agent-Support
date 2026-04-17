import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  alpha
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: 'admin@example.com',
    password: 'password',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Head title="تسجيل الدخول - مدير النظام" />
      
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: alpha('#161c27', 0.8),
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          border: '1px solid ' + alpha('#9fcaff', 0.1),
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #9fcaff 0%, #4894e2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            color: '#003259'
          }}
        >
          <LayoutDashboard size={28} />
        </Box>
        
        <Typography component="h1" variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          تسجيل الدخول
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
          أهلاً بك في نظام التذاكر والدعم الذكي. الرجاء إدخال بياناتك للمتابعة.
        </Typography>

        <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="البريد الإلكتروني"
            name="email"
            autoComplete="email"
            autoFocus
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} style={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} style={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={processing}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.05rem',
              borderRadius: 2
            }}
          >
            {processing ? 'جاري التحقق...' : 'دخول'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
