import { useState } from "react"
import axios from "axios"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const PayoutResults = ({ players, onNewGame }) => {
    const baseURL = "http://localhost:9000/convert/"
    const backupURL = "http://localhost:7777/users"
    const [displayPayout, setDisplayPayout] = useState()
    const [startNewGame, setStartNewGame] = useState(false)
    const [currCurrency, setCurrCurrency] = useState("usd")
    const [targetCurrency, setTargetCurency] = useState("usd")
    const [currencyPrefix, setCurrencyPrefix] = useState("$")
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
        backupGame()
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


    // sends get request to currency converter service
    const convertCurrency = (e) => {
        e.preventDefault()

        if (currCurrency === targetCurrency) {
            alert("cannot convert between the same currencies")
            return
        }

        displayPayout.map(async (payouts) => {
            const response = await fetch(baseURL + `${currCurrency}/${targetCurrency}/${payouts.amount}`)
            payouts.amount = await response.json()
            setDisplayPayout([...displayPayout])
        })

        const prefixes = {
            "usd": "$",
            "cad": "$",
            "euro": "\u20AC",
            "jpy": "\u00A5",
            "gbp": "\u00A3"
        }

        setCurrCurrency(targetCurrency)
        setCurrencyPrefix(prefixes[targetCurrency])
    }

    // send game data to database for backup
    function backupGame() {
        axios({
            method: "PUT",
            url: `${backupURL}/${players[0].name}`,
            headers: {
                "Accept": "application/json"
            },
            data: { "players": players }
        })
            .catch((error) => {
                console.log(error)
            })
    }

    // get a user's record
    function lookupRecord() {
        axios({
            method: "GET",
            url: `${backupURL}/${name}`,
        })
            .then(function (response) {
                const record = `${response.data._id} has a lifetime total of $${response.data.total}`
                setPlayerRecord(record)
            })
            .catch(function (error) {
                setPlayerRecord("Player record doesn't exist.")
            })
    }

    // delete all from database!
    function deleteRecords() {
        axios({
            method: "DELETE",
            url: backupURL
        })
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
                                    {`${payout.payer} owes ${payout.payee}: ${currencyPrefix}${payout.amount}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </TableContainer>
                <Grid sx={{ my: 2 }}>
                    <Button variant="contained" onClick={onNewGame}> Start a new Rainier Blackjack Game </Button>
                </Grid>

                {/* Currency Convertor */}
                <h2> Currency Converter </h2>
                <Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel> Currencies </InputLabel>
                            <Select
                                value={targetCurrency}
                                label="Currency"
                                onChange={(e) => setTargetCurency(e.target.value)}>
                                <MenuItem value={"usd"}> US Dollar </MenuItem>
                                <MenuItem value={"cad"}> Canadian Dollar </MenuItem>
                                <MenuItem value={"euro"}> Euro </MenuItem>
                                <MenuItem value={"jpy"}> Japenese Yen </MenuItem>
                                <MenuItem value={"gbp"}> Great Britain Pound </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sx={{ my: 2 }}>
                        <Button variant="contained" onClick={convertCurrency}> Convert to {targetCurrency} </Button>
                    </Grid>
                </Grid>

                {/* Player history */}
                <h2> Player histories </h2>
                <h3> Search for a player </h3>
                <p> Please note: player names are case-sensitive </p>
                <Grid>
                    <Grid item>
                        <TextField variant="outlined" label="Player Name" onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item sx={{ my: 2 }}>
                        <Button variant="contained" onClick={lookupRecord}> Search {name ? `for ${name}` : ""} </Button>
                    </Grid>
                </Grid>
                {playerRecord && <p>{playerRecord}</p>}

                <h3> Delete all player records </h3>
                <Button variant="contained" onClick={deleteRecords}> Delete Player Histories </Button>
            </>}
        </>
    )
}

export default PayoutResults
