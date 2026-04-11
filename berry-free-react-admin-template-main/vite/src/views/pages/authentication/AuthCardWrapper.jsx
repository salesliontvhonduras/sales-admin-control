import PropTypes from 'prop-types';
// material-ui
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

export default function AuthCardWrapper({ children, ...other }) {
  return (
    <MainCard
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: { xs: '100%', sm: 460, lg: 490 },
        margin: 0,
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        borderRadius: { xs: 3, sm: 4 },
        boxShadow: (theme) =>
          theme.palette.mode === 'dark' ? '0 22px 54px rgba(2, 8, 23, 0.54)' : '0 18px 44px rgba(15, 23, 42, 0.14)',
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%',
          minWidth: 0
        }
      }}
      content={false}
      {...other}
    >
      <Box sx={{ p: { xs: 1.25, sm: 2.5, xl: 5 }, minWidth: 0 }}>{children}</Box>
    </MainCard>
  );
}

AuthCardWrapper.propTypes = { children: PropTypes.any, other: PropTypes.any };
