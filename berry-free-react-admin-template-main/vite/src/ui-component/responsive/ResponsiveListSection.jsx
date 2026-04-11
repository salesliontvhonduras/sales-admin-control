import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

export default function ResponsiveListSection({
  isMobile,
  desktopContent,
  mobileContent,
  pagination,
  spacing = 1.5,
  dividerSx,
  sx = {}
}) {
  return (
    <Stack spacing={spacing} sx={sx}>
      <Box sx={{ minWidth: 0 }}>{isMobile ? mobileContent : desktopContent}</Box>
      {pagination ? <Divider sx={dividerSx || { my: 0.5 }} /> : null}
      {pagination ? <Box sx={{ minWidth: 0 }}>{pagination}</Box> : null}
    </Stack>
  );
}
