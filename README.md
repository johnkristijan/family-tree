# Herrmann Family Tree Application

This project is a web application for managing the Herrmann family tree. It features a Vue 3 frontend with PrimeVue for the UI, and a Node.js/Express backend with an SQLite database.

## Project Structure

-   `/frontend`: Contains the Vue 3 single-page application.
-   `/backend`: Contains the Node.js (Express) API server and database logic.
-   `/familytree.sqlite`: The SQLite database file (created in the `backend` directory when the backend server starts).

## Local Setup and Development (macOS)

Follow these instructions to get the application running on your local machine for development and testing.

### Prerequisites

1.  **Node.js and npm**:
    *   Ensure you have Node.js (which includes npm) installed. LTS version is recommended.
    *   You can download it from [nodejs.org](https://nodejs.org/) or install it using Homebrew:
        ```bash
        brew install node
        ```
    *   Verify installation:
        ```bash
        node -v
        npm -v
        ```

2.  **Git**:
    *   Ensure Git is installed. macOS usually comes with Git. If not, install via Homebrew:
        ```bash
        brew install git
        ```

### 1. Clone the Repository

```bash
git clone <repository_url> # Replace <repository_url> with the actual URL
cd <repository_directory_name>
```

### 2. Setup and Run Backend Server

The backend server handles API requests and database interactions.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# (Optional) Build TypeScript (if you prefer running compiled JS, or for specific scripts)
# The dev server (npm start) uses ts-node, so this isn't strictly needed for 'start'.
# npm run build

# Start the development server (usually on http://localhost:3000)
npm start
```
The backend server will connect to/create the `familytree.sqlite` database file in the `backend` directory. You should see log messages indicating the server is running and the database is connected/initialized.

### 3. Setup and Run Frontend Application

The frontend application provides the user interface.

```bash
# Navigate to the frontend directory (from the project root)
cd frontend

# Install dependencies
npm install

# Start the Vite development server (usually on http://localhost:5173 or another port)
npm run dev
```
Vite will output the local URL where the frontend is being served. Open this URL in your web browser.

### 4. Login

*   The application uses a simple password-only login for initial access.
*   **Password**: `starcraft`

### 5. Database Seeding (Populating with Test Data)

To populate the database with some initial sample data:

```bash
# Make sure you are in the backend directory
cd backend

# Run the seed script
npm run db:seed
```
This will add a few sample individuals to the `persons` table.

### 6. Database Unseeding (Clearing Test Data)

To clear all data from the `persons` and `relationships` tables (and reset auto-increment counters):

```bash
# Make sure you are in the backend directory
cd backend

# Run the unseed script
npm run db:unseed
```

## Next Steps / Future Development

(This section can be expanded as the project grows)

*   Implement relationship management between persons.
*   Add more detailed views for individuals.
*   Visualize the family tree.
*   User account management (beyond the single password).
*   Deployment configuration.
