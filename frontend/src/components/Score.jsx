import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config.js";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { userEmailState } from "../store/selectors/userEmail";

function ScoreComponent() {
  const [scores, setScores] = useState([]);
  const userEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();


  useEffect(() => {
    if (!userEmail) {
        navigate("/signin");
      }
    const fetchScores = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/scores`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Fetch quiz titles for each score
        const updatedScores = await Promise.all(
          response.data.scores.map(async (score) => {
            const titleResponse = await axios.get(
              `${BASE_URL}/quizzes/${score.quiz_id}/title`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return {
              ...score,
              quizTitle: titleResponse.data.quizTitle,
            };
          })
        );
        setScores(updatedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  },[userEmail, navigate]);


  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4" style={{ marginTop: 20, marginBottom: 20 }}>
        Scores
      </Typography>
      <List style={{ width: "80%", maxWidth: 600 }}>
        {scores.map((score, index) => (
          <>
            <ScoreListItem key={index} score={score} />
            <br />
          </>
        ))}
      </List>
    </div>
  );
}

function ScoreListItem({ score }) {
  return (
    <ListItem
      disablePadding
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <ListItemButton>
        <ListItemText
          primary={<Typography variant="h5">{score.quizTitle}</Typography>}
          secondary={`Score: ${score.score}, Timestamp: ${new Date(
            score.timestamp
          ).toLocaleString()}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default ScoreComponent;
