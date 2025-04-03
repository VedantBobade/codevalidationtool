"use client";

import { useState } from "react";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";

export default function ScriptValidator() {
  const [scriptType, setScriptType] = useState("jenkins");
  const [script, setScript] = useState("");
  const [validationResult, setValidationResult] = useState("");

  const handleValidation = async () => {
    setValidationResult("Validating...");

    try {
      const response = await fetch("http://localhost:5000/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptType, script }),
      });

      const result = await response.json();
      setValidationResult(result.message);
    } catch (error) {
      setValidationResult("Error validating script.");
    }
  };

  // Select syntax highlighting based on script type
  const getLanguage = () => {
    if (scriptType === "github-actions") return yaml();
    if (scriptType === "terraform" || scriptType === "bicep") return json();
    return javascript(); // Jenkins uses Groovy (similar to JS)
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Script Validator</h2>

      <label className="block mb-2 text-gray-700">Select Script Type:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={scriptType}
        onChange={(e) => setScriptType(e.target.value)}
      >
        <option value="jenkins">Jenkins</option>
        <option value="github-actions">GitHub Actions</option>
        <option value="terraform">Terraform</option>
        <option value="bicep">Bicep</option>
      </select>

      <label className="block mb-2 text-gray-700">Enter Script:</label>
      <CodeMirror
        value={script}
        height="200px"
        extensions={[getLanguage()]}
        onChange={(value) => setScript(value)}
        theme="light"
        className="border rounded-md"
      />

      <button
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 mt-4"
        onClick={handleValidation}
      >
        Validate Script
      </button>

      {validationResult && (
        <div className="mt-4 p-3 border rounded-md bg-gray-100">
          <strong>Result:</strong> {validationResult}
        </div>
      )}
    </div>
  );
}
