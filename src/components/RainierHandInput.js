import { useState, useEffect } from "react"
import { TextField, Button, Grid, ButtonGroup } from "@mui/material"

const RainierHandInput = ({ setBet, player, dealerID }) => {
    const [value, setValue] = useState("")
    const [status, setStatus] = useState("")
    const [playerID, setPlayerID] = useState(player.id)
    const [prevDealerID, setPrevDealerID] = useState(dealerID)

    const onSubmit = (e, status) => {
        e.preventDefault()

        setStatus(status)
        setBet({ playerID, value, status })
    };

    // resets value and status fields upon dealer change
    useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
        if (dealerID !== prevDealerID) {
            setPrevDealerID(dealerID)
            setValue("")
            setStatus("")
        }
    })

    return (
        <>
            <Grid container spacing={{ xs: 1, md: 2 }}>
                <Grid item xs={4}>
                    <TextField style={{ width: 100 }} size="small" type="number" variant="outlined" label="Bet" value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
                </Grid>
                <Grid item xs={8} align="left">
                    {playerID === dealerID ?
                        <> <Button size="small" variant="contained" onClick={(e) => onSubmit(e, "dealer")}> Confirm </Button> </>
                        :
                        <>
                            <ButtonGroup>
                                <Button size="small" variant="contained" color="success" onClick={(e) => onSubmit(e, "win")}> Win </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button size="small" variant="contained" color="error" onClick={(e) => onSubmit(e, "lose")}> Lose </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button size="small" variant="contained" color="warning" onClick={(e) => onSubmit(e, "push")}> Push </Button>
                            </ButtonGroup> </>}
                </Grid>
            </Grid>
        </>
    )
}

export default RainierHandInput
