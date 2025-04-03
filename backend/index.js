const express = require("express");
const cors = require("cors");
const YAML = require("yaml");
const JSON5 = require("json5");

const app = express();
app.use(cors());
app.use(express.json());

const validateScript = (scriptType, script) => {
  if (!script.trim()) {
    return { isValid: false, message: "Script cannot be empty." };
  }

  try {
    switch (scriptType) {
      case "jenkins":
        return script.includes("pipeline") ? 
          { isValid: true, message: "Valid Jenkinsfile!" } : 
          { isValid: false, message: "Invalid Jenkinsfile format!" };

      case "github-actions":
        try {
          YAML.parse(script);  // Validate YAML structure
          return { isValid: true, message: "Valid GitHub Actions YAML!" };
        } catch (error) {
          return { isValid: false, message: `Invalid YAML: ${error.message}` };
        }

      case "terraform":
      case "bicep":
        try {
          JSON5.parse(script); // Validate JSON structure
          return { isValid: true, message: `Valid ${scriptType} script!` };
        } catch (error) {
          return { isValid: false, message: `Invalid JSON: ${error.message}` };
        }

      default:
        return { isValid: false, message: "Unknown script type." };
    }
  } catch (error) {
    return { isValid: false, message: `Error: ${error.message}` };
  }
};

// API Route for script validation
app.post("/validate", (req, res) => {
  const { scriptType, script } = req.body;
  const validationResult = validateScript(scriptType, script);
  res.json(validationResult);
});

// Start the backend server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
