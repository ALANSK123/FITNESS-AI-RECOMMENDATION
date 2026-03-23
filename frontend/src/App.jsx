import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router"
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetails";


const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
        Activity Tracker
      </Typography>
      <ActivityForm onActivityAdded={handleActivityAdded} />
      <ActivityList refreshKey={refreshKey} />
    </Container>
  )
}


function App() {

  const { token, tokenData, logIn, logOut }
          = useContext(AuthContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if(token) {
      dispatch(setCredentials({token, user: tokenData}));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h4">Fitness AI Recommendation</Typography>
            <Typography color="text.secondary">
              Welcome! Please login to manage your activities.
            </Typography>
            <Button variant="contained" onClick={() => { logIn(); }}>
              LOGIN
            </Button>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="md" sx={{ py: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button variant="outlined" onClick={logOut}>
              LOGOUT
              </Button>
            </Box>
            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={token ? <Navigate to="/activities" replace /> :
                          <div>Welcome! Please login</div>} />
            </Routes>
          </Container>
      )}
    </Router>
  )
}

export default App
