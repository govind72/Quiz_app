import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../store/selectors/userEmail";
import { isUserLoading } from "../store/selectors/isUserLoading.js";

export const Landing = () => {
  const navigate = useNavigate();
  const userEmail = useRecoilValue(userEmailState);
  const userLoading = useRecoilValue(isUserLoading);
  return (
    <div>
      <Grid container style={{ padding: "5vw" }}>
        <Grid item xs={12} md={6} lg={6}>
          <div style={{ marginTop: 100 }}>
            {userEmail && (
              <>
                <Typography variant={"h4"}>
                  Hi {userEmail}, Welcome to Quizo
                </Typography>
                <Typography variant={"h5"}>
                  A place to learn and grow ,lets explore
                </Typography>
                <div style={{ marginTop: 20 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/quizzes")}
                    style={{ marginLeft: 10 }}
                  >
                    Take a Quiz
                  </Button>
                </div>
              </>
            )}
            {!userEmail && (
              <>
                <Typography variant={"h4"}>Welcome to Quizo</Typography>
                <Typography variant={"h5"}>
                  A place to learn and grow ,lets explore
                </Typography>
              </>
            )}

            {!userLoading && !userEmail && (
              <div style={{ display: "flex", marginTop: 20 }}>
                <div style={{ marginRight: 10 }}>
                  <Button
                    size={"large"}
                    variant={"outlined"}
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Sign up
                  </Button>
                </div>
                <div>
                  <Button
                    size={"large"}
                    variant={"outlined"}
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div></div>
        </Grid>
      </Grid>
    </div>
  );
};
