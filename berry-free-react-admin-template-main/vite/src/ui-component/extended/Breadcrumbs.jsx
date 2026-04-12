import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';

// project imports
import navigation from 'menu-items';

// assets
import { IconChevronRight, IconTallymark1 } from '@tabler/icons-react';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

// ==============================|| BREADCRUMBS TITLE ||============================== //

function BTitle({ title }) {
  return (
    <Grid sx={{ minWidth: 0, width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 500, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
        {title}
      </Typography>
    </Grid>
  );
}

export default function Breadcrumbs({
  card,
  custom = false,
  divider = false,
  heading,
  icon = true,
  icons,
  links,
  maxItems,
  rightAlign = true,
  separator = IconChevronRight,
  title = true,
  titleBottom,
  sx,
  ...others
}) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { t } = useTranslation();
  const [main, setMain] = useState();
  const [item, setItem] = useState();

  const iconSX = {
    marginRight: 6,
    marginTop: -2,
    width: '1rem',
    height: '1rem',
    color: theme.vars.palette.secondary.main
  };

  const linkSX = {
    display: 'flex',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
  };

  let customLocation = location.pathname;

  useEffect(() => {
    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === 'group') {
        if (menu?.url && menu.url === customLocation) {
          setMain(menu);
          setItem(menu);
        } else {
          getCollapse(menu);
        }
      }
      return false;
    });
  });

  // set active item state
  const getCollapse = (menu) => {
    if (!custom && menu.children) {
      menu.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse);
          if (collapse.url === customLocation) {
            setMain(collapse);
            setItem(collapse);
          }
        } else if (collapse.type && collapse.type === 'item') {
          if (customLocation === collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator;
  const separatorIcon = separator ? <SeparatorIcon stroke={1.5} size="16px" /> : <IconTallymark1 stroke={1.5} size="16px" />;

  let mainContent;
  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse') {
    CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
    mainContent = (
      <Typography
        {...(main.url && { component: Link, to: main.url })}
        variant="h6"
        sx={{
          lineHeight: 1.5,
          mb: -0.625,
          maxWidth: { xs: '100%', sm: 'unset' },
          display: 'inline-flex',
          minWidth: 0,
          whiteSpace: 'normal'
        }}
        color={window.location.pathname === main.url ? 'text.primary' : 'text.secondary'}
      >
        {icons && <CollapseIcon style={{ ...iconSX }} />}
        {t(main.title, { defaultValue: main.title })}
      </Typography>
    );
  }

  if (!custom && main && main.type === 'collapse' && main.breadcrumbs === true) {
    const baseCardSx = {
      mb: { xs: 2, sm: 3 },
      bgcolor: card === false ? 'transparent' : 'background.default',
      width: { xs: '100%', sm: 'min(1200px, 90vw)' },
      mx: 'auto',
      ...sx
    };

    breadcrumbContent = (
      <Card sx={baseCardSx} {...others}>
        <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
          <Grid
            container
            direction={downSM ? 'column' : rightAlign ? 'row' : 'column'}
            sx={{
              justifyContent: downSM ? 'flex-start' : rightAlign ? 'space-between' : 'flex-start',
              alignItems: downSM ? 'flex-start' : rightAlign ? 'center' : 'flex-start'
            }}
            spacing={1}
          >
            {title && !titleBottom && <BTitle title={t(main.title, { defaultValue: main.title })} />}
            <Grid>
              <MuiBreadcrumbs
                aria-label={t('layout.aria.breadcrumb')}
                maxItems={maxItems || (downSM ? 3 : 8)}
                separator={separatorIcon}
                sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
              >
                <Typography component={Link} to="/" variant="h6" sx={{ ...linkSX, color: 'text.secondary' }}>
                  {icons && <HomeTwoToneIcon style={iconSX} />}
                  {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
                  {(!icon || icons) && t('menu.dashboard', { defaultValue: 'Dashboard' })}
                </Typography>
                {mainContent}
              </MuiBreadcrumbs>
            </Grid>
            {title && titleBottom && <BTitle title={t(main.title, { defaultValue: main.title })} />}
          </Grid>
        </Box>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </Card>
    );
  }

  // items
  if ((item && item.type === 'item') || (item?.type === 'group' && item?.url) || custom) {
    itemTitle = item?.title ? t(item.title, { defaultValue: item.title }) : '';

    ItemIcon = item?.icon ? item.icon : AccountTreeTwoToneIcon;
    itemContent = (
      <Typography
        variant="h6"
        sx={{
          ...linkSX,
          color: 'text.secondary',
          display: 'inline-flex',
          minWidth: 0,
          lineHeight: 1.5,
          mb: -0.625,
          maxWidth: { xs: '100%', sm: 'unset' },
          whiteSpace: 'normal'
        }}
      >
        {icons && <ItemIcon style={{ ...iconSX }} />}
        {itemTitle}
      </Typography>
    );

    let tempContent = (
      <MuiBreadcrumbs
        aria-label={t('layout.aria.breadcrumb')}
        maxItems={maxItems || (downSM ? 3 : 8)}
        separator={separatorIcon}
        sx={{ '& .MuiBreadcrumbs-separator': { width: 16, mx: 0.75 } }}
      >
        <Typography component={Link} to="/" variant="h6" sx={{ ...linkSX, color: 'text.secondary' }}>
          {icons && <HomeTwoToneIcon style={{ ...iconSX }} />}
          {icon && !icons && <HomeIcon style={{ ...iconSX, marginRight: 0 }} />}
          {(!icon || icons) && t('menu.dashboard', { defaultValue: 'Dashboard' })}
        </Typography>
        {mainContent}
        {itemContent}
      </MuiBreadcrumbs>
    );

    if (custom && links && links?.length > 0) {
      tempContent = (
        <MuiBreadcrumbs
          aria-label={t('layout.aria.breadcrumb')}
          maxItems={maxItems || 8}
          separator={separatorIcon}
          sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
        >
          {links?.map((link, index) => {
            CollapseIcon = link.icon ? link.icon : AccountTreeTwoToneIcon;

            return (
              <Typography
                key={index}
                {...(link.to && { component: Link, to: link.to })}
                variant="h6"
                sx={{ ...linkSX, color: 'text.secondary' }}
              >
                {link.icon && <CollapseIcon style={iconSX} />}
                {t(link.title, { defaultValue: link.title })}
              </Typography>
            );
          })}
        </MuiBreadcrumbs>
      );
    }

    // main
    if (item?.breadcrumbs !== false || custom) {
      breadcrumbContent = (
        <Card
          sx={
            card === false
              ? { mb: 3, bgcolor: 'transparent', ...sx }
              : {
                  mb: 3,
                  bgcolor: 'background.default',
                  ...sx
                }
          }
          {...others}
        >
          <Box sx={{ p: 1.25, px: card === false ? 0 : 2 }}>
            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              sx={{ justifyContent: rightAlign ? 'space-between' : 'flex-start', alignItems: rightAlign ? 'center' : 'flex-start' }}
              spacing={1}
            >
              {title && !titleBottom && <BTitle title={custom ? heading : itemTitle} />}
              <Grid>{tempContent}</Grid>
              {title && titleBottom && <BTitle title={custom ? heading : itemTitle} />}
            </Grid>
          </Box>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </Card>
      );
    }
  }

  return breadcrumbContent;
}

BTitle.propTypes = { title: PropTypes.string };

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  custom: PropTypes.bool,
  divider: PropTypes.bool,
  heading: PropTypes.string,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  links: PropTypes.array,
  maxItems: PropTypes.number,
  rightAlign: PropTypes.bool,
  separator: PropTypes.any,
  IconChevronRight: PropTypes.any,
  title: PropTypes.bool,
  titleBottom: PropTypes.bool,
  sx: PropTypes.any,
  others: PropTypes.any
};
