import { Box, Button, Container, Stack, Typography, createTheme, ThemeProvider, CssBaseline } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router"
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetails";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Activity, Flame, Clock } from "lucide-react";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a855f7',
    },
    secondary: {
      main: '#06b6d4',
    },
    background: {
      default: '#0a0a0c',
      paper: '#121216',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.45)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 30, 35, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageWrapper>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(168, 85, 247, 0.25)'
          }}>
            <Activity color="white" size={28} />
          </Box>
          <Typography variant="h4">Activity Tracker</Typography>
        </Stack>
        <Stack spacing={4}>
          <ActivityForm onActivityAdded={handleActivityAdded} />
          <ActivityList refreshKey={refreshKey} />
        </Stack>
      </Container>
    </PageWrapper>
  )
}

function AppContent() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="glass-panel" sx={{ p: 6, textAlign: 'center', width: '100%' }}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4" gutterBottom sx={{ 
                background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                Fitness AI Insight
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Elevate your performance with AI-driven recommendations.
              </Typography>
              <Button variant="contained" size="large" onClick={logIn} fullWidth>
                Start Your Journey
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<LogOut size={18} />}
          onClick={logOut}
          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
        >
          LOGOUT
        </Button>
      </Box>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/" element={<Navigate to="/activities" replace />} />
        </Routes>
      </AnimatePresence>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
