import { useState } from "react"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const PayoutResults = ({ players, onNewGame }) => {
    const [displayPayout, setDisplayPayout] = useState()
    const [startNewGame, setStartNewGame] = useState(false)
    const [playerRecord, setPlayerRecord] = useState("")
    const [name, setName] = useState("")

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

    return (
        <>
            <h1>Final Results: </h1>
            <TableContainer sx={{ my: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {players.map((player) => (
                                <TableCell> {player.name} </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell width="20%"> Total: </TableCell>
                            {players.map((player) => (
                                <TableCell style={{ backgroundColor: (player.total >= 0) ? "#C8F79E" : "#F89693" }} > ${player.total} </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            {/* Calculate Payouts */}
            {!startNewGame && <Button variant="contained" onClick={calculatePayouts}> Calculate Payouts </Button>}

            {displayPayout && <>
                {/*  Display Payouts */}
                <TableContainer>
                    <Table>
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
                    <Button variant="contained" onClick={onNewGame}> Start a new Rainier Blackjack Game </Button>
                </Grid>
            </>}
        </>
    )
}

export default PayoutResults
