import { useState } from "react"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RainierHandInput from "./RainierHandInput"

const RainierPlayTable = ({ players, rounds, onGameOver }) => {
    // Track history of hands
    const [handHistory, setHandHistory] = useState([])

    // Track the round number of the current hand
    let [currHandNum, setCurrHandNum] = useState(0)

    // Track current dealer; indexes players list
    let [currDealer, setCurrDealer] = useState(1)

    // Store the results of the current hand
    const [currHand, setCurrHand] = useState(populateHands())

    const [isHistory, setIsHistory] = useState(false)

    // Populate currHand based on number players and their IDs
    function populateHands() {
        let hands = []
        players.forEach(player =>
            hands.push({ handNum: currHandNum, playerID: player.id, bet: 0, status: null, name: player.name }))
        return hands
    }

    // Track number of rounds
    let totalRounds
    if (players) {
        totalRounds = rounds * players.length
    }

    // Updates totals with previous current hand
    const submitHand = () => {
        // Check to make sure all players have submitted
        for (let i = 0; i < currHand.length; i++) {
            if (!currHand[i].bet) {
                alert("Please make sure all player bets are submitted!")
                return
            }
        }
        setCurrHandNum(currHandNum += 1)

        if (currHandNum % rounds === 0) {
            setCurrDealer(currDealer += 1)

            if (currHandNum >= players.length * rounds) {
                onGameOver()
                const newHand = calculateHand(currHand)
                setHandHistory([...handHistory, newHand])
                return
            }
        }

        const newHand = calculateHand(currHand)
        setHandHistory([...handHistory, newHand])
        setCurrHand(populateHands())

    }

    // Calculates payouts for a round
    const calculateHand = (hand) => {
        let newHand = { handNum: currHandNum, results: [] }
        let results = []
        let dealerWin = 0

        hand.map(player => {
            if (player.status === "win") {
                results.push({ playerID: player.playerID, result: player.bet, status: player.status, name: player.name })
            } else if (player.status === "lose") {
                results.push({ playerID: player.playerID, result: player.bet * -1, status: player.status, name: player.name })
            } else if (player.status === "push") {
                results.push({ playerID: player.playerID, result: 0, status: player.status, name: player.name })
            } else {
                results.push({ playerID: player.playerID, result: 0, status: player.status, name: player.name })
            }
        })

        results.map(result => (
            dealerWin += result.result * -1
        ))

        let index = hand.findIndex(({ status }) => status === "dealer")
        results[index].result = dealerWin

        // update player state to reflect new earnings
        players.map(player => {
            results.map(result => {
                if (player.id === result.playerID) {
                    player.total += result.result
                }
            })
        })

        // update newhand with results
        newHand.results = results
        return newHand
    }

    // Adds a player's bet and status to the current hand; updates player's hand if reentered
    const setBet = ({ playerID, value, status }) => {

        currHand[playerID - 1].handNum = currHandNum
        currHand[playerID - 1].bet = value
        currHand[playerID - 1].status = status

        setCurrHand([...currHand])
    }

    // Get player's current bet and status for display in hand-input grid
    const getBet = (id) => {
        const currBet = currHand.filter(player => player.playerID === id)
        return currBet
    }

    return (
        <>
            <p> Each player deals {rounds} hand{(rounds > 1) ? "s" : ""} for a total of {totalRounds} hands. </p>
            <p> NOTE: If you split, please enter your *net* bet, otherwise enter total amount bet as a positive integer. </p>
            <p> (ex: Player bets $5 and splits their hand; one hand busts and the other pushes. Net loss: $5) </p>

            <Grid container spacing={{ xs: 1, md: 1 }}>
                {/* Round Number & Submit Button */}
                {/* TODO: Make this float to the bottom of the screen (1) if on mobile and (2) all player bets have been submitted */}

                <Grid item xs={12}>
                    <h4> Playing Hand #{currHandNum + 1} </h4>
                    {/* TODO: Add confirmation step to hand submission */}
                    <Button variant="contained" onClick={submitHand}> Submit Hand </Button>
                </Grid>

                {players.map((player) =>
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            {player.id === currDealer && <h4>{player.name} is dealing{getBet(player.id)[0].bet && getBet(player.id)[0].status ? `: $${getBet(player.id)[0].bet} House` : ""} </h4>}
                            {player.id !== currDealer && <h4>{player.name}'s bet{getBet(player.id)[0].bet && getBet(player.id)[0].status ? `: $${getBet(player.id)[0].bet} ${getBet(player.id)[0].status}` : ""} </h4>}
                        </Grid>
                        <Grid item xs={12}>
                            <RainierHandInput setBet={setBet} player={player} dealerID={currDealer} />
                        </Grid>
                    </Grid>
                )}
            </Grid>

            <TableContainer sx={{ my: 2 }}>
                <Table>
                    {/* Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Player Totals:
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={() => setIsHistory(!isHistory)}>
                                    {!isHistory ? "Show History" : "Hide History"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Player Totals */}
                        {players.map((player) => (
                            <TableRow>
                                <TableCell>{player.name}</TableCell>
                                <TableCell style={{ backgroundColor: (player.total >= 0) ? "#C8F79E" : "#F89693" }}>
                                    ${player.total}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Hand History */}
                        {isHistory && <> {handHistory.map((round) => (
                            <>
                                <TableRow>
                                    <TableCell>
                                        <b>Round {round.handNum}</b>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                {round.results.map((player) => (
                                    <TableRow>
                                        <TableCell>
                                            {player.name}
                                        </TableCell>
                                        <TableCell style={{ backgroundColor: (player.result >= 0) ? "#C8F79E" : "#F89693" }}>
                                            ${player.result}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ))} </>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default RainierPlayTable
