import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '& > label': {
    left: 0,
    top: 20,
    '&[data-shrink="false"]': {
      top: 4
    }
  },
  '& .MuiOutlinedInput-root': {
    minHeight: 52,
    borderRadius: 14,
    paddingRight: 0,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      minHeight: 50,
      borderRadius: 12
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '28px 14px 12px !important',
    [theme.breakpoints.down('sm')]: {
      padding: '26px 14px 10px !important'
    }
  },
  '& .MuiOutlinedInput-adornedEnd .MuiOutlinedInput-input': {
    paddingRight: '10px !important'
  },
  '& .MuiOutlinedInput-adornedEnd': {
    paddingRight: 6
  },
  '& .MuiInputAdornment-root': {
    marginTop: '0 !important',
    alignSelf: 'center',
    maxHeight: 'none'
  },
  '& .MuiInputAdornment-positionEnd': {
    marginLeft: 0
  },
  '& .MuiInputAdornment-positionEnd .MuiIconButton-root': {
    marginRight: 2
  },
  '& legend': {
    display: 'none'
  },
  '& fieldset': {
    top: 0
  }
}));

export default CustomFormControl;
