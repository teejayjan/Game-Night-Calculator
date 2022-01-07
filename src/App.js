import { Router, Route, Switch, useHistory } from "react-router-dom";
import { useState, useEffect } from "react"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, Button, ButtonGroup, Select, FormControl, InputLabel, MenuItem, Container, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { MenuIcon } from "@mui/icons-material/Menu"
import Rules from "./components/Rules";
import RainierBlackJack from "./components/RainierBlackJack";
import Footer from "./components/Footer";
import Login from "./components/Login";
import GlobalState from "./components/GlobalState";
import History from "./components/History";

function App() {
    const history = useHistory();
    const [gState, setGState] = useState({})
    const [showRules, setShowRules] = useState(false);
    const [choice, setChoice] = useState("")

    // Warns user that reloading the page will reset state
    useEffect(() => {
        const unloadCallback = (e) => {
            e.preventDefault()
            e.returnValue = ""
            return ""
        };

        window.addEventListener("beforeunload", unloadCallback)
        return () => window.removeEventListener("beforeunload", unloadCallback)
    }, [])

    // Display-safe titles for rules display
    const gameTitles = {
        "rainier-blackjack": "Rainier Blackjack"
    }

    // Handle showRules
    const displayRules = () => {
        // Don't change state of showRules if user chose an incorrect choice
        if (validateChoice(choice))
            return
        setShowRules(!showRules)
    }

    // Handle startGame 
    const beginGame = () => {
        // Don't change state of startGame if user chose an incorrect choice
        if (validateChoice(choice)) {
            return
        }
        history.push("/rainierblackjack")
    }

    // Validate user choice
    const validateChoice = (value) => {
        if (value === "" || value === "default" || value === "under-construction") {
            alert("Please select a valid option")
            return true
        }
    }

    // Logout
    const logout = () => {
        setGState("")
    }

    // Box configurations
    const outerBox = {
        mt: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: 10,
    }

    const innerBox = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        m: 3,
        minWidth: { md: 350 },
    }

    return (
        <GlobalState.Provider value={[gState, setGState]}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> Game Night Calculator </Typography>

                        {/* Login/History Button */}
                        {gState.email ?
                            <>
                                <ButtonGroup>
                                    <History/>
                                    <Button variant="contained" onClick={() => logout()}> Logout </Button>
                                </ButtonGroup>
                            </>
                            :
                            <Login />}
                    </Toolbar>
                </AppBar>
            </Box>
            <Router history={history}>
                <Switch>
                    {/* Main Menu */}
                    <Route exact path="/" >
                        <Container maxWidth="sm">
                            <Box sx={outerBox}>
                                <Box sx={innerBox}>
                                    <h1>Game Night Calculator</h1>
                                    <p>Please select a game and an option to continue:</p>
                                    <FormControl fullWidth>
                                        <InputLabel id="gameSelect"> Options </InputLabel>
                                        <Select
                                            labelId="gameSelectLabel"
                                            id="gameSelect"
                                            value={choice}
                                            label="Choice"
                                            onChange={(e) => setChoice(e.target.value)}
                                        >
                                            <MenuItem value={"rainier-blackjack"}> Rainier Blackjack </MenuItem>
                                            <MenuItem value={"under-construction"}> Additional games under construction! </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <ButtonGroup variant="contained" sx={{ my: 2 }}>
                                        <Button type="submit" onClick={beginGame}> Start New Game </Button>
                                        <Button type="submit" onClick={displayRules}> {!showRules ? "Display Rules" : "Hide Rules"} </Button>
                                    </ButtonGroup>
                                    {showRules && <Rules game={gameTitles[choice]} />}
                                    <Footer />
                                </Box>
                            </Box>
                        </Container>
                    </Route>

                    {/* Rainier Blackjack Game Screen */}
                    <Container >
                        <Box sx={outerBox}>
                            <Box sx={innerBox}>
                                <Route exact path="/rainierblackjack">
                                    <RainierBlackJack />
                                    <Footer />
                                </Route>
                            </Box>
                        </Box>
                    </Container>
                </Switch>
            </Router >
        </GlobalState.Provider>
    );
}

export default App;