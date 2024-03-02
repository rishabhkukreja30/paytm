import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Send from "./pages/Send";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Send />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
