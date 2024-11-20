import React from "react";
import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookList from "./pages/BookList";
import AuthorList from "./pages/AuthorList";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import { AuthProvider } from "./utils/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookForm from "./pages/admin/AdminBookForm";
import AdminBookList from "./pages/admin/AdminBookList";
import AdminAuthorList from "./pages/admin/AdminAuthorList";
import AdminAuthorForm from "./pages/admin/AdminAuthorForm";
import BookDetail from "./pages/BookDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Box minH="100vh">
          <Navbar />
          <Box as="main" p={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<AdminBookList />} />
              <Route path="/admin/books/add" element={<AdminBookForm />} />
              <Route path="/admin/books/edit/:id" element={<AdminBookForm />} />
              <Route path="/admin/authors" element={<AdminAuthorList />} />
              <Route path="/admin/authors/add" element={<AdminAuthorForm />} />
              <Route
                path="/admin/authors/edit/:id"
                element={<AdminAuthorForm />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}
