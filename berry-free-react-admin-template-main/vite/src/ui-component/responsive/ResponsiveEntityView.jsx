import Divider from '@mui/material/Divider';

export default function ResponsiveEntityView({
  isMobile,
  mobileContent,
  desktopContent,
  pagination,
  showDivider = true,
  dividerSx
}) {
  return (
    <>
      {isMobile ? mobileContent : desktopContent}
      {pagination ? (
        <>
          {showDivider ? <Divider sx={dividerSx || { my: 1 }} /> : null}
          {pagination}
        </>
      ) : null}
    </>
  );
}
