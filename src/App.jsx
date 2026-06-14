import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll/SmoothScroll.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

import Home from './pages/Home/Home.jsx';
import Blog from './pages/Blog/Blog.jsx';
import BlogPost from './pages/BlogPost/BlogPost.jsx';
import Properties from './pages/Properties/Properties.jsx';

import AdminLayout from './pages/Admin/AdminLayout/AdminLayout.jsx';
import Login from './pages/Admin/Login/Login.jsx';
import Dashboard from './pages/Admin/Dashboard/Dashboard.jsx';
import PostEditor from './pages/Admin/PostEditor/PostEditor.jsx';
import Taxonomy from './pages/Admin/Taxonomy/Taxonomy.jsx';
import ServicePage from './pages/Servicepage/Servicepage.jsx';
import AboutPage from './pages/Aboutpage/Aboutpage.jsx';
import ContactPage from './pages/Contactpage/Contactpage.jsx';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <SmoothScroll disabled={isAdmin}>
        {!isAdmin && <Header />}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostEditor />} />
              <Route path="taxonomy" element={<Taxonomy />} />
            </Route>
          </Routes>
        </AnimatePresence>
        {!isAdmin && <Footer />}
      </SmoothScroll>
    </>
  );
}