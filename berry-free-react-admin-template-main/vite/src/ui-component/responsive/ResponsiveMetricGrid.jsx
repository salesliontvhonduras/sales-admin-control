import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

const toTemplate = (count = 1) => `repeat(${count}, minmax(0, 1fr))`;

export default function ResponsiveMetricGrid({
  children,
  columns = { xs: 1, md: 2, lg: 4 },
  gap = { xs: 1.5, sm: 2 },
  sx = {}
}) {
  const resolvedColumns = {
    xs: columns.xs ?? 1,
    sm: columns.sm ?? columns.xs ?? 1,
    md: columns.md ?? columns.sm ?? columns.xs ?? 1,
    lg: columns.lg ?? columns.md ?? columns.sm ?? columns.xs ?? 1,
    xl: columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.xs ?? 1
  };

  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        width: '100%',
        minWidth: 0,
        justifyItems: 'stretch',
        alignItems: 'stretch',
        gap,
        gridTemplateColumns: {
          xs: toTemplate(resolvedColumns.xs),
          sm: toTemplate(resolvedColumns.sm),
          md: toTemplate(resolvedColumns.md),
          lg: toTemplate(resolvedColumns.lg),
          xl: toTemplate(resolvedColumns.xl)
        },
        '& > *': {
          minWidth: 0,
          width: '100%',
          maxWidth: '100%'
        },
        ...(typeof sx === 'function' ? sx(theme) : sx || {})
      })}
    >
      {children}
    </Box>
  );
}

ResponsiveMetricGrid.propTypes = {
  children: PropTypes.node,
  columns: PropTypes.object,
  gap: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]),
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};
