import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Breakdown from "scenes/breakdown";
import Login from "scenes/login";
import Register from "scenes/register";
import EditProfile from "scenes/edit-profile";
import ForgotPassword from "scenes/forget-password";
import ResetPassword from "scenes/reset-password";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route
              path="/resetPassword/:id/:token"
              element={<ResetPassword />}
            />

            <Route element={<Layout />}>
              {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/breakdown" element={<Breakdown />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
