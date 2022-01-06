import { useState, useContext } from 'react';
import { Modal, Button, Box, TextField, Grid } from '@mui/material'
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

const Login = () => {
    const [email, setEmail] = useState("")
    const [gState, setGState] = useContext(GlobalState)
    const [isDisabled, setIsDisabled] = useState(true)
    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false)

    const onNewEmail = (e) => {
        e.preventDefault()

        setGState({ email: email })
    }

    const validateEmail = (email) => {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    }

    const handleInput = (input) => {
        setEmail(input)
        if (validateEmail(email)) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }

    return (
        <>
            <Button variant="contained" onClick={onOpen}> Login </Button>

            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>
                    <Grid container wrap='nowrap' spacing={2} sx={{ width: 95 / 100 }}>
                        <Grid item>
                            <h2>Game History</h2>
                            <p>Providing your email address will allow you to track your history across multiple games.</p>
                            <p>Addresses are saved in a secure database.</p>
                        </Grid>

                    </Grid>
                    <form>
                        <Grid item>
                            <TextField label="email" variant="outlined" value={email} onChange={(e) => handleInput(e.target.value)} />
                        </Grid>
                        <Grid item sx={{ my: 'auto' }}>
                            <Button sx={{ my: 1 }} variant="contained" type="submit" disabled={isDisabled} onClick={(e) => onNewEmail(e)}> Login </Button>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default Login
