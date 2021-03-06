import { useState, useContext, useEffect } from "react"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import GlobalState from "./GlobalState"

const PayoutResults = ({ players, onReset, onResetPrefill }) => {
    const backupURL = "http://localhost:5000"
    const [displayPayout, setDisplayPayout] = useState()
    const [startNewGame, setStartNewGame] = useState(false)
    const [isBackupSuccess, setIsBackupSuccess] = useState(false)
    const [gState, setGState] = useContext(GlobalState)

    console.log(players)
    console.log(gState)

    const calculatePayouts = () => {
        let positives = []
        let negatives = []

        players.map((player) => {
            if (player.total >= 0) {
                positives.push({ name: player.name, total: player.total })
            } else {
                negatives.push({ name: player.name, total: player.total })
            }
        })

        // Sort all ascending by total
        positives.sort(function (a, b) {
            return (a.total - b.total)
        })

        negatives.sort(function (a, b) {
            return - (a.total - b.total)
        })

        setDisplayPayout(generatePayoutMessages(positives, negatives))
        setStartNewGame(true)
    }

    const generatePayoutMessages = (positives, negatives) => {
        let messages = []

        // index positives
        let i = 0

        // index negatives 
        let j = 0

        while ((i < positives.length) && (j < negatives.length)) {
            // totals placeholders
            let pos = positives[i].total
            let neg = negatives[j].total

            // get what is owed by positive player to corresponding negative player
            // retrieves the lesser value of the two to account for players with larger negative or positive values
            let owe = Math.min(Math.abs(pos), Math.abs(neg))

            // update positive total
            positives[i].total -= owe

            // update negative total
            negatives[j].total += owe

            // generate payout message
            let message = { payer: negatives[j].name, payee: positives[i].name, amount: owe }

            // add payout message to messages
            messages.push(message)

            // increment counters if either is zeroed
            if (positives[i].total === 0) {
                i++
            }

            if (negatives[j].total === 0) {
                j++
            }
        }
        return messages
    }

    const onBackup = () => {
        if (!gState.email) {
            alert("You must provide an email address to backup game data.")
            return
        }
        axios({
            method: "POST",
            url: backupURL,
            headers: {
                "Accept": "application/json"
            },
            data: { "email": gState.email, "players": players }
        })
            .then(() => {
                setIsBackupSuccess(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <TableContainer sx={{ my: 2 }}>
                <TableRow>
                    <TableCell>
                        <b>Final Results</b>
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
                {players.map((player) => (
                    <TableRow>
                        <TableCell>{player.name}</TableCell>
                        <TableCell style={{ backgroundColor: (player.total >= 0) ? "#C8F79E" : "#F89693" }}>
                            ${player.total}
                        </TableCell>
                    </TableRow>
                ))}
            </TableContainer>

            {/* Calculate Payouts */}
            {!startNewGame && <Button variant="contained" onClick={calculatePayouts}> Calculate Payouts </Button>}

            {displayPayout && <>
                {/*  Display Payouts */}
                <TableContainer>
                    <Table>
                        <TableRow>
                            <TableCell>
                                <b>Payouts:</b>
                            </TableCell>
                        </TableRow>
                        {displayPayout.map((payout) => (
                            <TableRow>
                                <TableCell>
                                    {`${payout.payer} owes ${payout.payee}: $${payout.amount}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </TableContainer>
                <Grid sx={{ my: 2 }}>
                    <h4> Backup game results </h4>
                    {isBackupSuccess && <p>Backup successful!</p>}
                    <Button variant="contained" disabled={isBackupSuccess} onClick={onBackup}> Backup </Button>
                </Grid>
                <Grid sx={{ my: 2 }}>
                    <h4> Create new game with new players: </h4>
                    <Button variant="contained" onClick={onReset}> New Game </Button>
                </Grid>
                <Grid sx={{ my: 2 }}>
                    <h4> Create new game with current players & rounds prefilled:  </h4>
                    <Button variant="contained" onClick={onResetPrefill}> New Game </Button>
                </Grid>
            </>}
        </>
    )
}

export default PayoutResults
