# Ensure script runs from its own directory
Set-Location -Path $PSScriptRoot

# Check if 'py' (Python launcher) is installed
Write-Host "Checking for Python..."

$pyInstalled = Get-Command py -ErrorAction SilentlyContinue

if (-not $pyInstalled) {
    Write-Host "Python is not installed. Installing from Microsoft Store..."

    # Try to install Python using winget (Windows Package Manager)
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if ($winget) {
        winget install --id=Python.Python.3 --source=msstore -e --accept-package-agreements --accept-source-agreements
    }
    else {
        Write-Host "Winget is not available. Please install Python manually from https://www.python.org/"
        exit 1
    }

    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
}

# Confirm Python is now available
$pyInstalled = Get-Command py -ErrorAction SilentlyContinue
if (-not $pyInstalled) {
    Write-Host "Python installation failed or is not accessible. Exiting."
    exit 1
}

# Run getData.py
Write-Host "Running getData.py"
python.exe "getData.py"

# Wait for the script to complete
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python script failed. Exiting."
    exit 1
}

# Open the resulting Excel file
$excelFile = "combined_students.xlsx"