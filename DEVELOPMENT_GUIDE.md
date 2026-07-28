# Development Guide

This guide covers how to set up your local environment and begin contributing to the **TicketFlow API**.

## Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v14 or higher is recommended)
- **npm** (Node Package Manager)
- **Git**

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   The project uses `dotenv`. Copy the example file to create your local `.env`.
   ```bash
   cp .env.example .env
   ```
   By default, it will set `DATABASE_URL=./src/data/database.sqlite`.

4. **Initialize the Database:**
   We use SQLite. You need to run the migrations to create the tables, and optionally seed the database with initial data.
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Run the Development Server:**
   Start the server using `nodemon` which will automatically reload the application when you save a file.
   ```bash
   npm run dev &
   ```
   The API will be available at `http://localhost:3000`.

## Testing the API Manually
You can use tools like **Postman**, **Insomnia**, or **cURL** to interact with the API.
The API exposes a lightweight HTML documentation at `http://localhost:3000/docs`.

Example `GET` request using cURL:
```bash
curl -X GET "http://localhost:3000/tickets?status=Aberto"
```

## Making Changes
1. Create a new Git branch for your feature or bugfix: `git checkout -b feature/my-new-feature`
2. Write your code adhering to the rules in `CODE_GUIDE.md`.
3. Test your changes locally.
4. Commit your changes using clear, descriptive messages.
