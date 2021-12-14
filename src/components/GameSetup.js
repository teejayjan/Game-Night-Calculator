import { useState } from "react";
import { Button, ButtonGroup, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const GameSetup = ({ startGame }) => {
    const [player, setPlayer] = useState("")
    const [players, setPlayers] = useState([])

    const [editPlayer, setEditPlayer] = useState({})
    let [playerCount, setPlayerCount] = useState(1)

    const [rounds, setRounds] = useState()

    const [isEditing, setIsEditing] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)
    const [isAddingPlayers, setIsAddingPlayers] = useState(true)
    const [isAddingRounds, setIsAddingRounds] = useState(false)
    const [isStartReady, setIsStartReady] = useState(false)

    // Handles adding of new player
    const onNewPlayer = (e) => {
        e.preventDefault()
        if (player === ""){
            alert("Player name cannot be blank.")
            return
        }
        setPlayerCount(playerCount + 1)
        let newPlayer = { id: playerCount, name: player, total: 0, isDealer: false }
        setPlayers([...players, newPlayer])
        setPlayer("")
    }

    // Handles editing player name
    const onEditPlayer = (id) => {
        const playerToEdit = players.filter(player => player.id === id)
        setEditPlayer(playerToEdit[0])
        setIsEditing(true)
    }

    const onSaveEdit = () => {
        const playerIndex = players.findIndex((player => player.id === editPlayer.id))
        players[playerIndex].name = editPlayer.name
        setPlayers([...players])
        setIsEditing(false)
        setEditPlayer({})
    }

    // Handles deleting player
    const onDeletePlayer = (id) => {
        const tempPlayerList = players.filter((player) => player.id !== id)
        for (let i = 0; i < tempPlayerList.length; i++)
            tempPlayerList[i].id = i + 1
        setPlayers(tempPlayerList)
        setPlayerCount(playerCount - 1)
    }

    // Handles locking in player list
    const onConfirmPlayers = () => {
        if (!isConfirming) {
            setIsConfirming(true)
            return
        }
        setIsAddingPlayers(false)
        setIsAddingRounds(true)
        setIsConfirming(false)
    }

    // Handles submitting number of rounds per player
    const onSaveRounds = (e) => {
        e.preventDefault()
        if (!isConfirming) {
            setIsConfirming(true)
            return
        }
        setIsAddingRounds(false)
        setIsStartReady(true)
    }

    const onStart = () => {
        startGame({ players, rounds })
    }

    const onReset = () => {
        setPlayer()
        setPlayers([])
        setEditPlayer({})
        setPlayerCount(1)
        setRounds()
        setIsEditing(false)
        setIsConfirming(false)
        setIsAddingPlayers(true)
        setIsAddingRounds(false)
        setIsStartReady(false)
    }

    return (
        <>
            {/* Adding Players */}
            {isAddingPlayers && <> <h3>Enter player names:</h3>
                <form>
                    <Grid container wrap='nowrap' spacing={2} sx={{ width: 95 / 100 }}>
                        <Grid item>
                            <TextField label="Player" variant="outlined" value={player}
                                onChange={(e) => setPlayer(e.target.value)}
                            />
                        </Grid>
                        <Grid item sx={{ my: 'auto' }}>
                            <Button size="small" variant="contained" type="submit" onClick={(e) => onNewPlayer(e)}> Add Player </Button>
                        </Grid>
                    </Grid>
                </form>

                {playerCount > 2 && <Grid container wrap='nowrap' spacing={2} sx={{ width: 95 / 100, my: 1 }}>
                    {isConfirming
                        ?
                        <>
                            <Grid item>
                                <Button color="warning" size="small" variant="contained" type="submit" onClick={onConfirmPlayers}> Yes, Confirm Players </Button>
                            </Grid>
                            <Grid item>
                                <Button color="success" size="small" variant="contained" type="submit" onClick={() => setIsConfirming(false)}> No, Go Back </Button>
                            </Grid>
                        </>
                        :
                        <Grid item>
                            <Button color="success" size="small" variant="contained" type="submit" onClick={onConfirmPlayers}> Confirm Players </Button>
                        </Grid>}
                </Grid>}
            </>}

            {/* Set Number of Rounds */}
            {isAddingRounds && <> <h3>Enter number of times each player will deal:</h3>
                <form>
                    <Grid container wrap='nowrap' spacing={2} sx={{ width: 95 / 100 }}>
                        <Grid item>
                            <TextField label="Rounds" variant="outlined"
                                onChange={(e) => setRounds(e.target.value)}
                            />
                        </Grid>
                        {rounds && <Grid item sx={{ my: 'auto' }}>
                            {isConfirming
                                ?
                                <ButtonGroup>
                                    <Button color="warning" size="small" variant="contained" type="submit" onClick={(e) => onSaveRounds(e)}> Yes, Confirm Rounds </Button>
                                    <Button color="success" size="small" variant="contained" onClick={() => setIsConfirming(false)}> No, Go Back </Button>
                                </ButtonGroup>
                                :
                                <Button color="success" size="small" variant="contained" type="submit" onClick={(e) => onSaveRounds(e)}> Confirm Rounds </Button>}
                        </Grid>}
                    </Grid>
                </form>
            </>}

            {/* Ready message and button */}
            {isStartReady && <>
                <h3>Ready to begin with {playerCount - 1} players dealing {rounds} hands each for a total of {(playerCount - 1) * rounds} hands?</h3>
                <Grid container wrap='nowrap' spacing={2} sx={{ width: 95 / 100 }}>
                    <Grid item>
                        <Button color="success" variant="contained" type="submit" onClick={onStart}> Start Game </Button>
                    </Grid>
                    <Grid item>
                        <Button color="warning" variant="contained" type="submit" onClick={onReset}> Redo Game Setup </Button>
                    </Grid>
                </Grid>
            </>}

            {/* Editing Dialogue Box */}
            {isEditing && <>
                <p>Editing {editPlayer.name} </p>
                <Grid container spacing={2} sx={{ width: 95 / 100 }}>
                    <Grid item>
                        <TextField label="Player" variant="outlined"
                            onChange={(e) => setEditPlayer(prevState => ({ ...prevState, name: e.target.value }))}
                        />
                    </Grid>
                    <Grid item sx={{ my: 'auto' }}>
                        <Button variant="contained" type="submit" onClick={onSaveEdit}> Update </Button>
                    </Grid>
                </Grid>
            </>}

            <TableContainer sx={{ my: 2 }}>
                <Table sx={{ minWidth: 200 }}>
                    <TableHead sx={isAddingPlayers ? "" : { background: 'rgba(76, 175, 80, 1)' }}>
                        <TableRow>
                            <TableCell> Number </TableCell>
                            <TableCell> Player Name </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((row) => (
                            <TableRow
                                key={row.id}>
                                <TableCell component="th" scope="row">
                                    Player {row.id}
                                </TableCell>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell>
                                    {isAddingPlayers && <ButtonGroup size="small">
                                        <Button type="submit" onClick={() => onEditPlayer(row.id)}> Edit </Button>
                                        <Button type="submit" onClick={() => onDeletePlayer(row.id)}> Delete </Button>
                                    </ButtonGroup>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default GameSetup
