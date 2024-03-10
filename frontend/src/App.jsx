import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Appbar from "./components/Appbar.jsx";
import {Landing} from "./components/Landing.jsx";
import { userState } from "./store/atoms/user.js";
import {
    RecoilRoot,
    useSetRecoilState
} from 'recoil';
import axios from "axios";
import {BASE_URL} from "./config.js";
import {useEffect} from "react";
import Quizzes from './components/Quizzes.jsx';
import Quiz from './components/Quiz.jsx';
import Score from './components/Score.jsx';

function App() {
    return (
        <RecoilRoot>
            <div >
                    <Router>
                        <Appbar />
                        <InitUser />
                        <Routes>                           
                            <Route path={"/signin"} element={<Signin />} />
                            <Route path={"/signup"} element={<Signup />} />
                            <Route path={"/quizzes"} element={<Quizzes />} />
                            <Route path={"/quiz/:quizId"} element={<Quiz />} />
                            <Route path={"/score"} element={<Score />} />
                            <Route path={"/"} element={<Landing />} />
                        </Routes>
                    </Router>
            </div>
        </RecoilRoot>
    );
}


function InitUser() {
    const setUser = useSetRecoilState(userState);
    const token = localStorage.getItem("token");
    const init = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/me`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (response.data.email) {
                setUser({
                    isLoading: false,
                    userEmail: response.data.email
                })
            } else {
                setUser({
                    isLoading: false,
                    userEmail: null
                })
            }
        } catch (e) {

            setUser({
                isLoading: false,
                userEmail: null
            })
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>
}

export default App;