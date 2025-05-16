# SS Attendance App

A robust and user-friendly attendance management system designed to streamline attendance tracking for organizations, schools, or teams.



## Table of Contents

- [SS Attendance App](#ss-attendance-app)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Setup \& Installation](#setup--installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [License](#license)
  - [Contact](#contact)



## Overview

The SS Attendance App provides an easy way to record, view, and manage attendance records. It is built to be scalable, secure, and easy to deploy in various environments.



## Features

- User authentication and authorization
- Role-based access control (e.g., admin, registrar, student)
- Record attendance for classes/events
- View historical attendance records
- Export attendance reports (`.xlsx`)
- Responsive UI for desktop



## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js (Express)
- **Authentication:** Firebase Auth
- **Deployment:** Netlify
- **Other:** TypeScript, Bootstrap


## Architecture

<img src="public\flowchart.png">


- **Frontend:** React app for user/admin interaction, communicates with backend via REST API.
- **Backend:** Node.js/Express server, handles business logic, authentication, and file export (runs PowerShell script for XLSX export).
- **Database:** Firestore for storing users, classes, and attendance data.
- **Auth Service:** Firebase Auth for user/admin authentication.
- **Export Service:** Backend endpoint runs PowerShell script to generate and serve XLSX attendance reports.


## Setup & Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/coolestcoder655/ss-attendance-app.git
    cd ss-attendance-app
    ```

2. **Run the app locally:**
    ```bash
    npm run build
    ```


## Configuration

- **Config files**
    - `firebase.ts`: Contains Firebase configuration and initialization for connecting the app to Firestore and Firebase Auth.
    - `vite.config.ts`: Vite build tool configuration for frontend development, including plugins and build options.
    - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration files specifying compiler options for the app, node scripts, and type checking.
    - `package.json`: Lists project dependencies, scripts, and metadata for both frontend and backend. Controls how the app is built and run.
    - `netlify/functions/`: (If present) Contains Netlify serverless function code and configuration for backend endpoints when deploying to Netlify.
    - `modal-slide.css`, `App.css`: Custom CSS files for UI styling and modal animations.
    - `README.md`, `technicalREADME.md`: Documentation files for setup, usage, and technical details.


## Usage

- **Login as Admin/Teacher/Student**
- **Mark Attendance**
    - Go to the attendance page, select period/class, and mark present/absent.
- **View Attendance Records**
    - Browse by period, class, or student.
- **Export Reports**
    - Use the export script to download attendance data for further processing or review.




## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.



## Contact

For support or inquiries, please contact [coolestcoder655](mailto:khokharmaaz@gmail.com).