import { useState } from "react";
import { Link } from "react-router-dom";
import RainierPlayTable from "./RainierPlayTable";
import PayoutResults from "./PayoutResults";
import GameSetup from "./GameSetup";


const RainierBlackJack = () => {
    const [players, setPlayers] = useState([])
    const [rounds, setRounds] = useState()

    const [gameActive, setGameActive] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    // Start Game
    const onStart = ({ players, rounds }) => {
        setPlayers(players)
        setRounds(rounds)
        setGameActive(true)
    }

    // reset active game
    const onReset = () => {
        setPlayers()
        setRounds()
        setGameActive(false)
        setGameOver(false)
    }

    // new game with same players and rounds
    const onResetPrefill = () => {
        setGameActive(false)
        setGameOver(false)
    }

    // display results after end of game
    const onGameOver = () => {
        setGameOver(true)
    }

    return (
        <div>
            <Link to="/" exact>Exit Game & Return to Main Menu</Link>
            <h1>Rainier Blackjack</h1>

            {!gameActive && !gameOver && <>
                <GameSetup startGame={onStart} p={players} r={rounds}/>
            </>}

            {gameActive && !gameOver && <>
                <RainierPlayTable players={players} rounds={rounds} onGameOver={onGameOver} />
            </>}

            {gameOver && <>
                <PayoutResults players={players} onReset={onReset} onResetPrefill={onResetPrefill}/>
            </>}
        </div>
    )
}

export default RainierBlackJack
