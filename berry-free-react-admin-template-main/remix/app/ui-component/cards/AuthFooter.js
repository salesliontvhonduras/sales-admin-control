// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://liontvpremium.com" target="_blank" underline="hover">
            &copy; Lion Services
        </Typography>
    </Stack>
);

export default AuthFooter;
