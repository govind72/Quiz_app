import { Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.js";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";

function Quiz() {
    const userEmail = useRecoilValue(userEmailState);
    const { quizId } = useParams();
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (!userEmail) {
          navigate("/signin");
        }
      }, [userEmail, navigate]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setQuestions(response.data.questions);
                setTimer(60);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };
        fetchQuestions();
    }, [quizId]);

    useEffect(() => {
        if (timer === 0 && !showResult) {
            handleNextQuestion();
        }
        const interval = setInterval(() => {
            if (!showResult) {
                setTimer(timer => timer - 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, showResult]);

    const handleNextQuestion = () => {
        const correctIndex = questions[currentQuestionIndex].correct_option_index - 1;
        if (selectedOption === correctIndex) {
            setScore(score + 1);
        }
        setSelectedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimer(60);
        } else {
            setShowResult(true);
            submitQuiz();
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(parseInt(event.target.value));
    };

    const retryQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
    };

    const submitQuiz = async () => {
        try {
            await axios.post(
                `${BASE_URL}/submit-quiz`,
                { quizId, score },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    return (
  
        <div style={{ textAlign: "center" }}>
            {!showResult && questions.length > 0 && (
                <Card style={{ width: 600, margin: "auto", marginTop: 100, padding: 20, borderRadius: 10, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", position: 'relative' }}>
                    <CardContent>
                        <Typography variant="h5">{questions[currentQuestionIndex].question_text}</Typography>
                        <br />
                        <RadioGroup
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            {Object.entries(questions[currentQuestionIndex].options).map(([optionKey, optionValue], index) => (
                                <FormControlLabel key={index} value={index} control={<Radio />} label={optionKey + ": " + optionValue} />
                            ))}
                        </RadioGroup>
                        <div style={{ position: 'absolute', top: '50%', right: 5, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                            <AccessAlarmsIcon />
                            <Typography variant="h6" style={{ marginLeft: 5 , marginRight:30 }}>{timer}</Typography>
                        </div>
                        <br />
                        <br />

                        <Button variant="contained" onClick={handleNextQuestion} disabled={selectedOption === null} style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
                            {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        </Button>
                        <br /><br />
                    </CardContent>
                </Card>
            )}
            {showResult && (
                <Card style={{ width: 600, margin: "auto", marginTop: 20, padding: 20, borderRadius: 10, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}>
                    <CardContent>
                        <Typography variant="h5">Quiz Completed!</Typography>
                        <Typography variant="h6">Your Score: {score}/{questions.length}</Typography>
                        <Typography variant="h6">Percentage: {(score / questions.length) * 100}%</Typography>
                        <div style={{ marginTop: 20 }}>
                            <Button variant="contained" onClick={retryQuiz}>Retry Quiz</Button>
                            <Button variant="contained" onClick={() => navigate("/quizzes")} style={{ marginLeft: 10 }}>More Quizzes</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default Quiz;
