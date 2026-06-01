import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import queryClient from './services/queryClient';
import { useAuthStore } from './store/useAuthStore';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  Chip,
} from '@mui/material';

function App() {
  const { isAuthenticated, logout, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'screen' }}>
          <AppBar position="static" color="primary" elevation={1}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                KAROCHEBAMA — Administration
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body2">
                      Session active : <strong>{user?.email}</strong>
                    </Typography>
                    <Button variant="contained" color="secondary" size="small" onClick={logout}>
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
                    Squelette d'administration
                  </Typography>
                )}
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Architecture Admin Activée
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                L'interface administrative interne est prête, configurée avec **React**, **TypeScript**, **Material-UI (MUI)**, **Zustand** et **React Query**.
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Chip label="MUI Theme customisé" color="primary" variant="outlined" size="small" />
                <Chip label="React Query Provider" color="primary" variant="outlined" size="small" />
                <Chip label="Zustand Client State" color="primary" variant="outlined" size="small" />
              </Box>
            </Paper>
          </Container>

          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.grey[200],
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              &copy; {new Date().getFullYear()} KAROCHEBAMA - Administration System
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
