// imports

import { GoogleGenerativeAI } from "@google/generative-ai";

// console.log("Gemini key:", import.meta.env.VITE_GEMINI_API_KEY);

// initialization
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Analyzes an incident report and generates a severity classification using the Gemini AI model.
 * 
 * @param {string} title - The title of the incident report
 * @param {string} description - The detailed description of the incident
 * @returns {Promise<string>} - The severity level: "Severe", "Moderate", "Low", or "Uncategorized" if an error occurs
 */
export async function generateSeverity(title, description) {

  // prompt 
  const prompt = `
  This is an app that allows users to report dangerous neighborhood incidents.
  Classify the following incident report into one of these three severity levels:
  - Severe
  - Moderate
  - Low


  Examples of reports and the categories they belong to:
  1. Report title: "Flooded street". Description: "Heavy rains have caused severe flooding, making the street impassable for vehicles and pedestrians."
    Category: Severe


  2. Report title: "Fallen tree". Description: "A large tree has fallen across the sidewalk, blocking pedestrian access but not causing any injuries."
    Category: Moderate


  3. Report title: "Streetlight out". Description: "The streetlight is not working, causing reduced visibility at night but no immediate danger."
    Category: Low


  Give ONLY the category name as the output.


  Report title: "${title}"
  Description: "${description}"
  `;

  try {

    // initialize gemini ai model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // send the prompt to the model
    const result = await model.generateContent(prompt);
    
    // extract and clean the response
    const text = result.response.text().trim();
    
    console.log("AI severity:", text);
    return text;

  } catch (error) {

    console.error("Gemini API error:", error);
    return "Uncategorized";
    
  }

}
