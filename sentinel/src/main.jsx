/**
 * Application Entry Point
 * Sets up React 18 rendering with:
 * - Strict Mode for development warnings
 * - Toast notification system using Radix UI
 * - Global toast event listener for cross-component notifications
 */
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Toast from '@radix-ui/react-toast'

/**
 * GlobalToast Component
 * Displays toast notifications triggered by window events.
 * Listens for 'sentinel-show-toast' custom events from anywhere in the app.
 * 
 * @returns {JSX.Element} Toast component with title and description
 */
function GlobalToast() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Set up event listener for global toast notifications
  useEffect(() => {
    function handler(e) {
      const d = e.detail || {};
      setTitle(d.title || "");
      setDescription(d.description || "");
      setOpen(true);
    }
    // Listen for custom sentinel-show-toast events
    window.addEventListener('sentinel-show-toast', handler);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('sentinel-show-toast', handler);
  }, []);

  return (
    <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
      <Toast.Title className="ToastTitle">{title}</Toast.Title>
      <Toast.Description className="ToastDescription">{description}</Toast.Description>
      <Toast.Action className="ToastAction" asChild altText="Undo">
        <button className="OKbutton" onClick={() => setOpen(false)}>OK.</button>
      </Toast.Action>
    </Toast.Root>
  );
}

// Render the application with Radix UI Toast provider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toast.Provider swipeDirection="right">
      <App />
      <GlobalToast />
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  </StrictMode>,
)