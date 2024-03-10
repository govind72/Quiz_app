import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";

function Quizzes() {
    const userEmail = useRecoilValue(userEmailState);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userEmail) {
          navigate("/signin");
        }
      }, [userEmail, navigate]);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/quizzes`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setQuizzes(response.data.quizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom>Quizzes</Typography>
            <List sx={{ width: "70%", margin: "auto" }}>
                {quizzes.map(quiz => (
                    <QuizListItem key={quiz.quiz_id} quiz={quiz} onClick={() => navigate(`/quiz/${quiz.quiz_id}`)} />
                ))}
            </List>
        </div>
    );
}

function QuizListItem({ quiz, onClick }) {
    return (
        <ListItem disablePadding sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <ListItemButton onClick={onClick}>
                <ListItemText
                    primary={<Typography variant="h5">{quiz.title}</Typography>}
                    secondary={quiz.description}
                />
                <Button variant="contained" color="primary" onClick={onClick}>Start Quiz</Button>
            </ListItemButton>
        </ListItem>
    );
}

export default Quizzes;
