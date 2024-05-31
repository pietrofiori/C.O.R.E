import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NoPage from "./pages/NoPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import { useContext, useEffect, useState } from "react";
import { AccountProvider, AccountContext } from "./components/AccountContext";
import { WebSocketProvider } from "./components/WebSocketProvider";
import { ButtonProvider } from "./components/ButtonsContext";
import  LanguageProvider  from "./components/LanguageContext";

function App() {
  const account = useContext(AccountContext);

  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccountProvider>
          <ButtonProvider>
            <Routes>
              <Route
                path="/"
                element={account.isLogged ? <UserLayout /> : <LoginPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/user/*" element={<UserLayout />} />
            </Routes>
            <Toaster />
          </ButtonProvider>
        </AccountProvider>
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
