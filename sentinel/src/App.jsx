/**
 * App Component
 * 
 * The root component that:
 * - Renders the SignIn component
 */
import { useState } from "react";
import SignIn from "./components/SignIn.jsx";
import "./App.css";

export default function App() {

  return (
    <div className="app-container">
      <SignIn />
    </div>
  );
}
