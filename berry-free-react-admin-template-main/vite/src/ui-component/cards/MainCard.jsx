import PropTypes from 'prop-types';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { withAlpha } from 'utils/colorUtils';

// constant
const headerStyle = {
  '& .MuiCardHeader-root': {
    gap: 12
  },
  '& .MuiCardHeader-content': {
    minWidth: 0
  },
  '& .MuiCardHeader-action': {
    mr: 0,
    alignSelf: 'center'
  }
};

export default function MainCard({
  border = false,
  boxShadow,
  children,
  content = true,
  contentClass = '',
  contentSX = {},
  headerSX = {},
  darkTitle,
  secondary,
  shadow,
  sx = {},
  title,
  ref,
  ...others
}) {
  const defaultShadow = '0 2px 14px 0 rgb(32 40 45 / 8%)';

  return (
    <Card
      ref={ref}
      {...others}
      sx={(theme) => ({
        ...theme.applyStyles('light', {
          boxShadow: border ? 'none' : `0 10px 24px ${withAlpha('#0f172a', 0.1)}`
        }),
        border: border ? '1px solid' : 'none',
        borderColor: 'divider',
        borderRadius: 3.5,
        backgroundColor: theme.vars.palette.surface.card,
        boxShadow: border
          ? 'none'
          : `0 14px 32px ${withAlpha('#020617', 0.5)}`,
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        ':hover': {
          ...theme.applyStyles('light', {
            boxShadow: boxShadow ? shadow || defaultShadow : `0 14px 30px ${withAlpha('#0f172a', 0.14)}`,
            borderColor: withAlpha(theme.vars.palette.primary.main, 0.18)
          }),
          boxShadow: boxShadow
            ? shadow || defaultShadow
            : `0 16px 36px ${withAlpha('#020617', 0.56)}`,
          borderColor: withAlpha(theme.vars.palette.primary.main, 0.45),
          transform: 'none'
        },
        ...(typeof sx === 'function' ? sx(theme) : sx || {})
      })}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader
          sx={{
            ...headerStyle,
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            '& .MuiCardHeader-root': {
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' }
            },
            '& .MuiCardHeader-action': {
              mr: 0,
              mt: { xs: 1.25, sm: 0 },
              ml: { xs: 0, sm: 'auto' },
              width: { xs: '100%', sm: 'auto' },
              alignSelf: { xs: 'stretch', sm: 'center' }
            },
            ...headerSX
          }}
          title={title}
          action={secondary}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={{
            ...headerStyle,
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            '& .MuiCardHeader-root': {
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' }
            },
            '& .MuiCardHeader-action': {
              mr: 0,
              mt: { xs: 1.25, sm: 0 },
              ml: { xs: 0, sm: 'auto' },
              width: { xs: '100%', sm: 'auto' },
              alignSelf: { xs: 'stretch', sm: 'center' }
            },
            ...headerSX
          }}
          title={<Typography variant="h3">{title}</Typography>}
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {title && <Divider />}

      {/* card content */}
      {content && (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
}

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  headerSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  ref: PropTypes.object,
  others: PropTypes.any
};
