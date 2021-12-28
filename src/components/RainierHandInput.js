import { useState } from "react"
import { TextField, Button, Grid, ButtonGroup } from "@mui/material"

const RainierHandInput = ({ playerName, playerID, setBet, isDealer }) => {
    const [value, setValue] = useState()
    const [status, setStatus] = useState()

    const onSubmit = (e, status) => {
        e.preventDefault()

        setStatus(status)
        setBet({ playerID, value, status })
    }

    return (
        <>
            <Grid>
                {isDealer && <h4> {playerName} is dealing{value && status ? `: $${value} House` : ""} </h4>}
                {!isDealer && <h4> {playerName}'s bet{value && status ? `: $${value} ${status}` : ""} </h4>}
            </Grid>
            <Grid>
                <TextField style={{ width: 100 }} size="small" type="number" variant="outlined" label="Bet" value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
            </Grid>
            <Grid sx={{ my: 2 }} >
                {isDealer ?
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
        </>
    )
}

export default RainierHandInput
