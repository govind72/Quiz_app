import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { isUserLoading } from "../store/selectors/isUserLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user.js";
import { userEmailState } from "../store/selectors/userEmail";

function Appbar({}) {
  const navigate = useNavigate();
  const userLoading = useRecoilValue(isUserLoading);
  const userEmail = useRecoilValue(userEmailState);
  const setUser = useSetRecoilState(userState);

  if (userLoading) {
    return <></>;
  }

  if (userEmail) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 4,
          zIndex: 1,
        }}
      >
        <div
          style={{ marginLeft: 10, cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <Typography
            variant={"h4"}
            style={{ fontFamily: "Madimi One", cursor: "pointer", fontWeight: 500 }}
          >
            Quizo
          </Typography>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10, marginLeft:10, display: "flex" }}>
            <Button
              variant={"outlined"}
              onClick={() => {
                navigate("/score");
              }}
            >
              History
            </Button>
            <Button
              variant={"outlined"}
              onClick={() => {
                localStorage.setItem("token", null);
                setUser({
                  isLoading: false,
                  userEmail: null,
                });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 4,
          zIndex: 1,
        }}
      >
        <div
          style={{ marginLeft: 10, cursor: "pointer" }}
          onClick={() => {
            navigate("/");
          }}
        >
          <Typography variant={"h6"}>Quizo</Typography>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            <Button
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
              variant={"outlined"}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Appbar;
