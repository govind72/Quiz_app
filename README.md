# Quiz Application

## Overview
The Quiz Application is a web-based platform designed to create, manage, and participate in quizzes. It allows users to register, log in, and attempt quizzes on various topics. The application provides a user-friendly interface for quiz creation, question management, and result tracking.

## Functionalities
1. **User Authentication:** 
   - Users can register an account and log in securely.
   - Authentication is handled using JWT (JSON Web Tokens) for secure access to protected routes.
   - Firebase Authentication is utilized for seamless user authentication.

2. **Quiz Creation and Management:**
   - Admin users can create quizzes by providing a title, description, and a set of questions with multiple-choice options.
   - Quizzes can be edited, deleted, or deactivated as needed.

3. **Quiz Participation:**
   - Registered users can view available quizzes and attempt them.
   - Each quiz consists of multiple-choice questions with a specified time limit for each question.
   - Users can view their score and percentage upon completing a quiz.

4. **Score Tracking:**
   - Scores are recorded for each user's attempt on a quiz.
   - Users can view their past quiz attempts along with the scores and timestamps.

## Technologies Used
- **Frontend:** React.js with Material-UI for UI components.
- **Backend:** Node.js with Express.js for RESTful API development.
- **Database:** PostgreSQL for storing quiz data, user information, and quiz scores.
- **Authentication:** JSON Web Tokens (JWT) for user authentication and authorization. Firebase Authentication is used for seamless user authentication.
- **State Management:** Recoil for managing state within the frontend application.
- **Additional Libraries:** Axios for HTTP requests, React Router for navigation.

## Setup Instructions

### Frontend:
1. Clone the repository to your local machine.
2. Navigate to the "frontend" directory.
3. Install dependencies using `npm install`.
4. Set the `BASE_URL` variable in `config.js` to the URL of your backend server.
5. Run the frontend application using `npm start`.

### Backend:
1. Navigate to the "backend" directory.
2. Install dependencies using `npm install`.
3. Set up a PostgreSQL database and configure the connection details in `.env` file.
4. Start the backend server using `npm start`.

### PostgreSQL Configuration:
1. Install PostgreSQL on your system if not already installed.
2. Create a new database using the PostgreSQL command line or a GUI tool like pgAdmin.
3. Create a new user and grant necessary privileges to access the database.
4. Update the `.env` file in the backend directory with the database connection details.

### Screenshots
<img width="973" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/ca72094b-60bc-42cb-bec8-5677460bbaa4">
<img width="959" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/d3319bf2-cf46-474f-aac0-e40a7ce00e3e">
<img width="961" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/ef52abf6-0bf8-4d0c-ba0b-a5124958ea77">
<img width="960" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/e1429482-c667-48f8-ba23-631ae3a0fd15">
<img width="959" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/a0d8bc48-50ad-4b87-b733-044e9a4f482c">
<img width="957" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/45363671-9923-42ab-86ea-1b270ba888d0">
<img width="692" alt="image" src="https://github.com/govind72/Quiz_app/assets/107355441/44fa4deb-51e8-49e1-83c1-6ada0cc0f7d1">






**Note:** Ensure that both frontend and backend servers are running simultaneously for the application to work correctly.



## License
This project is licensed under the MIT License. You are free to use, modify, and distribute the code for personal or commercial purposes. Refer to the LICENSE file for more information.
