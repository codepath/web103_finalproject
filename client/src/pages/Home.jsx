import { Container, Typography, Grid2, Paper } from '@mui/material';
import '../css/Home.css';

const Home = () => {
    const handleClick = (section) => {
        if (section === 'Track Expenses') {
            window.location.href = '/track-expenses';
        } else if (section === 'Set Budgets') {
            window.location.href = '/set-budgets';
        }
    };

    return (
        <Container>
            <Grid2 container spacing={3} style={{ marginTop: '2rem' }}>
                <Grid2 item xs={12} sm={6}>
                    <Paper style={{ padding: '1rem' }} onClick={() => handleClick('Track Expenses')}>
                        <Typography variant="h6" gutterBottom>
                            Track Expenses
                        </Typography>
                        <Typography>
                            Easily track your daily expenses and categorize them to see where your money is going.
                        </Typography>
                    </Paper>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                    <Paper style={{ padding: '1rem' }} onClick={() => handleClick('Set Budgets')}>
                        <Typography variant="h6" gutterBottom>
                            Set Budgets
                        </Typography>
                        <Typography>
                            Set monthly budgets to manage your spending and save more money.
                        </Typography>
                    </Paper>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default Home;