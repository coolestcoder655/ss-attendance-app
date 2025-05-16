const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());

// Endpoint to run PowerShell script and serve the file

app.get('/generate-xlsx', (req, res) => {
    exec('powershell.exe -ExecutionPolicy Bypass -File .\\scripts\\executable.ps1', (error) => {
        if (error) {
            return res.status(500).send('Error generating file');
        }
        const filePath = path.join(__dirname, 'combined_students.xlsx');
        res.download(filePath, 'combined_students.xlsx');
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));