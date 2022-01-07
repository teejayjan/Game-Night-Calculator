import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Box, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, IconButton } from '@mui/material'
import axios from 'axios';
import GlobalState from './GlobalState';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const History = () => {
    const backupURL = "http://localhost:5000"
    const [gState, setGState] = useContext(GlobalState)
    const [history, setHistory] = useState([])
    const [open, setOpen] = useState(false)
    // const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)

    const handleOpen = () => {
        setOpen(true)
        axios({
            method: "GET",
            url: `${backupURL}/${gState.email}`,
        })
            .then(function (response) {
                setHistory(response.data)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const dateFromID = (id) => {
        const d = new Date(parseInt(id.substring(0, 8), 16) * 1000)
        return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear()
    }

    const [checked, setChecked] = useState([0]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const populateRow = (game) => {
        let s
        s = dateFromID(game._id) + " "
        game.players.forEach((player) => (
            s = s + player.name + " "
        ))
        return s
    }

    return (
        <>
            <Button variant="contained" onClick={handleOpen}> History </Button>

            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Grid container wrap="nowrap" spacing={2} sx={{ width: 95 / 100 }}>
                        <Grid item>
                            <h2> {gState.email}'s Game History </h2>
                        </Grid>
                    </Grid>
                    { history.length === 0 && <p> It doesn't look like you've saved any games! </p>}
                    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                        {history.map((game) => {
                            return (
                                <ListItem
                                    key={game._id}>
                                    <ListItemButton role={undefined} onClick={handleToggle(game._id)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(game._id) !== -1}
                                                tabIndex={-1}
                                                disableRipple />
                                        </ListItemIcon>
                                        <ListItemText primary={populateRow(game)} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </Box>
            </Modal>
        </>
    )
}

export default History
