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
        if (!script.includes("pipeline")) {
          return { isValid: false, message: "Error: 'pipeline' block is missing (Jenkinsfile)." };
        }
        return { isValid: true, message: "Valid Jenkinsfile!" };

      case "github-actions":
        try {
          YAML.parse(script);
          return { isValid: true, message: "Valid GitHub Actions YAML!" };
        } catch (error) {
          return { 
            isValid: false, 
            message: `Invalid YAML at line ${error.linePos[0].line}: ${error.message}` 
          };
        }

      case "terraform":
      case "bicep":
        try {
          JSON5.parse(script);
          return { isValid: true, message: `Valid ${scriptType} script!` };
        } catch (error) {
          return { 
            isValid: false, 
            message: `Invalid JSON at position ${error.at}: ${error.message}` 
          };
        }

      default:
        return { isValid: false, message: "Unknown script type." };
    }
  } catch (error) {
    return { isValid: false, message: `Unexpected Error: ${error.message}` };
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
