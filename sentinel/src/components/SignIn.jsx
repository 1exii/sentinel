/**
 * SignIn Component
 * 
 * Handles user authentication and conditional rendering:
 * - Shows a login button if user is not authenticated
 * - Shows the MapView and logout button if user is authenticated
 * - Uses Firebase authentication with Google OAuth provider
 */
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase/firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import MapView from "./MapView";
import "./SignIn.css";

export default function GoogleAuth({ setMapInstance }) {
  // vars
  const [user, setUser] = useState(auth.currentUser);

  /**
   * Initiates Google sign-in using Firebase popup authentication
   */
  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    setUser(res.user);
  };

  /**
   * Signs out the current user and clears user state
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  /**
   * Monitor authentication state changes
   * Updates user state whenever authentication status changes
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <div className={`signin-page ${user ? "map-active" : ""}`}>
      {user ? (
        // render map view when user is authenticated
        <div className="map-container">
          <MapView user={user} setMapInstance={setMapInstance} />
          <div
            style={{
              zIndex: 10000,
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      ) : (
        // render login button when user is not authenticated
        <div className="signin-center">
          <button onClick={loginWithGoogle}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}
