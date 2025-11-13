import { Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import "./ReportForm.css";
import { generateSeverity } from "../api/geminiCategorizer.js";

/**
 * Adds a new report document to the Firestore reports collection
 * @param {Object} data - The report data to add
 * @returns {Promise<DocumentReference>} - Reference to the newly created document
 */
async function addDataToFirestore(data) {
  try {
    const docRef = await addDoc(collection(db, "reports"), data);
    return docRef;
  } catch (e) {
    console.error("error: ", e);
  }
}

/**
 * Sets a report document in Firestore with a specific document ID
 * @param {string} docId - The document ID to set
 * @param {Object} data - The report data to write
 */
async function setDataToFirestore(docId, data) {
  try {
    await setDoc(doc(db, "reports", docId), data);
  } catch (e) {
    console.error("error: ", e);
  }
}

/**
 * ReportForm Component
 * 
 * Displays a form inside a map popup that allows users to:
 * - Add a title and description for the incident
 * - Adjust the reporting radius
 * - Submit to Firebase database
 * - Uses Gemini AI to automatically categorize severity
 */
export default function ReportForm({ position, onClose }) {
  // vars
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [radius, setRadius] = useState(300);
  const [crimeRate, setCrimeRate] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!position) return null;

  useEffect(() => {
    setCrimeRate(0);
  }, []);

  /**
   * Handles form submission
   * Validates inputs
   * Gets AI-generated severity classification
   * Creates report object with metadata
   * Saves to Firestore
   * Closes the form
   */
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSubmitting(true);

    try {

      // use gemini ai to classify the incident severity
      const severity = await generateSeverity(title, description);

      // prepare report data object with all metadata
      const data = {
        pos: { lat: position.lat, lng: position.lng },
        title: title.trim(),
        desc: description.trim(),
        category: severity,
        votes: { up: 0, down: 0 },
        radius: Number(radius),
        crimeProb: crimeRate,
        createdAt: new Date().toISOString(),
      };

      // add the report to firestore and get the document reference
      const docRef = await addDataToFirestore(data);
      await setDataToFirestore(docRef.id, data);

      // Dispatch success event for toast notification
      window.dispatchEvent(
        new CustomEvent("sentinel-show-toast", {
          detail: {
            title: "✅ Report Submitted",
            description: "Your incident has been reported successfully!",
          },
        })
      );

      // close the form after successful submission
      onClose?.();

    } catch (err) {

      console.error(err);

    } finally {

      setIsSubmitting(false);

    }

  };

  return (
    <Marker position={position}>
      <Popup className="report-popup">
        <form className="report-form" onSubmit={handleSubmit}>
          {/* Form Title with icon */}
          <h3 className="report-form-title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#b6263eff" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            New Danger Report
          </h3>

          {/* Report Title Input */}
          <label>
            Title
            <input
              type="text"
              placeholder="e.g. Flooded street"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* Report Description Input */}
          <label>
            Description
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          {/* Report Radius Input*/}
          <label>
            Radius (m)
            <input
              type="number"
              min="50"
              max="5000"
              step="50"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </label>

          {/* Form Action Buttons */}
          <div className="report-form-actions">
            {/* Cancel button */}
            <button type="button" className="cancel" onClick={() => onClose?.()}>
              Cancel
            </button>
            {/* Submit button */}
            <button type="submit" className="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Popup>
    </Marker>
  );
}
