import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { withAlpha } from 'utils/colorUtils';

// constant
const headerContainerSx = {
  px: { xs: 1.5, sm: 2.5 },
  py: { xs: 1.5, sm: 2 },
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25
};

const headerTitleSx = {
  minWidth: 0,
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  lineHeight: 1.25
};

const headerActionSx = {
  width: '100%',
  display: 'flex',
  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
  alignItems: 'center',
  '& > *': {
    maxWidth: '100%'
  },
  '& .responsive-action-bar': {
    width: '100%',
    flexDirection: { xs: 'row', sm: 'row' },
    flexWrap: 'wrap',
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
    alignItems: 'center'
  },
  '& .responsive-action-bar > .MuiButton-root': {
    width: 'auto !important',
    flex: '0 0 auto'
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
  const resolvedTitle = darkTitle
    ? typeof title === 'string'
      ? <Typography variant="h3">{title}</Typography>
      : title
    : typeof title === 'string'
      ? <Typography variant="h4">{title}</Typography>
      : title;

  return (
    <Card
      ref={ref}
      {...others}
      sx={(theme) => ({
        ...theme.applyStyles('light', {
          boxShadow: border ? 'none' : `0 10px 24px ${withAlpha('#0f172a', 0.1)}`
        }),
        minWidth: 0,
        maxWidth: '100%',
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
      {title && (
        <Box sx={(theme) => ({ ...headerContainerSx, ...(typeof headerSX === 'function' ? headerSX(theme) : headerSX || {}) })}>
          <Box sx={headerTitleSx}>{resolvedTitle}</Box>
          {secondary ? <Box sx={headerActionSx}>{secondary}</Box> : null}
        </Box>
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
  contentSX: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headerSX: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  darkTitle: PropTypes.bool,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  ref: PropTypes.object,
  others: PropTypes.any
};
