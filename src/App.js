
// import './App.css';
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import MyOrder from "./screens/MyOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import {Toaster} from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from "./components/Cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
         <div><Toaster  position="top-center" reverseOrder={false}/></div>
          <Routes>
            <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /> {/* Protect Home route */}
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/myorder" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} /> {/* Protect MyOrder route */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;


