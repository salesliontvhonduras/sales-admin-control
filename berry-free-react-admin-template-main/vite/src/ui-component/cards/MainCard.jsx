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
  '& .MuiCardHeader-action': { mr: 0 }
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
        border: border ? '1px solid' : 'none',
        borderColor: 'divider',
        borderRadius: 3.5,
        backgroundColor: theme.palette.surface?.card || theme.palette.background.paper,
        boxShadow: border
          ? 'none'
          : theme.palette.mode === 'dark'
            ? `0 14px 32px ${withAlpha('#020617', 0.5)}`
            : `0 10px 24px ${withAlpha('#0f172a', 0.1)}`,
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        ':hover': {
          boxShadow: boxShadow
            ? shadow || defaultShadow
            : theme.palette.mode === 'dark'
              ? `0 16px 36px ${withAlpha('#020617', 0.56)}`
              : `0 14px 30px ${withAlpha('#0f172a', 0.14)}`,
          borderColor: withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.45 : 0.18),
          transform: 'none'
        },
        ...(typeof sx === 'function' ? sx(theme) : sx || {})
      })}
    >
      {/* card header and action */}
      {!darkTitle && title && <CardHeader sx={{ ...headerStyle, ...headerSX }} title={title} action={secondary} />}
      {darkTitle && title && (
        <CardHeader sx={{ ...headerStyle, ...headerSX }} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
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
