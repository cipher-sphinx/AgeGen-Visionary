import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "scenes/loginPage";
import HomePage from "scenes/homePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
