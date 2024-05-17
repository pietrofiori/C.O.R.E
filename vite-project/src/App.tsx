import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import NoPage from "./pages/NoPage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { AccountProvider } from "./components/AccountContext";
import { WebSocketProvider } from "./components/WebSocketProvider";
import { useAccount } from "@/components/AccountContext";


function App() {
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  let Layout;
  if (userType === "admin") {
    Layout = AdminLayout;
  } else if (userType === "user") {
    Layout = UserLayout;
  } else {
    Layout = LoginPage;
  }
  console.log(userType);


  return (
    <ThemeProvider>
      <AccountProvider>
        {token ? (
          <WebSocketProvider token={token}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin/*"
                element={userType === "admin" ? <AdminLayout /> : null}
              />
              <Route
                path="/user/*"
                element={
                  userType === "user" || userType === "admin" ? (
                    <UserLayout />
                  ) : null
                }
              />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </WebSocketProvider>
        ) : (
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        )}
      </AccountProvider>
      <Toaster />
    </ThemeProvider>
  );
}
  export default App;