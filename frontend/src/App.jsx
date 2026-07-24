import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Assessment from "./pages/Assessment.jsx";

const MIN_LOADER_MS = 1600;

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), MIN_LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence>{isLoading && <Loader key="loader" />}</AnimatePresence>
      {!isLoading && (
        <>
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
