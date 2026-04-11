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
        maxWidth: { xs: '100%', sm: 440, lg: 475 },
        margin: { xs: 0, md: 0 },
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%'
        }
      }}
      content={false}
      {...other}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2.5, xl: 5 } }}>{children}</Box>
    </MainCard>
  );
}

AuthCardWrapper.propTypes = { children: PropTypes.any, other: PropTypes.any };
