import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Home, LogIn, UserPlus } from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import BudgetPage from "./pages/BudgetPage";
import Login from "./pages/Auth/login";
import Signup from "./pages/Auth/signUp";
import LogoutButton from "./components/ui/Logout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <nav className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 font-medium">
                <Home className="h-5 w-5" />
                <span>Finance Visualizer</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/budgets"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Budgets
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <LogoutButton onLogout={() => setIsAuthenticated(false)} />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Signup</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Routes */}
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/budgets"
              element={
                isAuthenticated ? (
                  <BudgetPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={<Login onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route
              path="/signup"
              element={<Signup onSignup={() => setIsAuthenticated(true)} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
