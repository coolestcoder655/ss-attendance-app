import express from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Endpoint to run PowerShell script and download the XLSX file
app.get("/download-xlsx", async (req, res) => {
  // Run the PowerShell script
  exec(
    `powershell.exe -ExecutionPolicy Bypass -File ./scripts/executable.ps1`,
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running PowerShell script: ${error}`);
        return res.status(500).send("Failed to generate XLSX file.");
      }
      // After script runs, send the file
      const filePath = path.join(process.cwd(), "combined_students.xlsx");
      res.download(filePath, "combined_students.xlsx", (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
