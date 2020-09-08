import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Provider, createClient, useQuery } from 'urql';
import { actions } from '../Features/Dashboard/reducer';
import {
  CardHeader,
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Theme,
  createStyles,
  MenuItem,
  FormHelperText,
  LinearProgress,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../store';
import { DeleteForever } from '@material-ui/icons';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query{
    getMetrics
   }
  `;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: '90%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export default () => {
  return (
    <Provider value={client}>
      <MetricSelector />
    </Provider>
  );
};

const MetricSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics } = useSelector((state: IState) => state.metricsList);
  const [metricsSelected, setSelectedMetrics] = useState('');

  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      console.log(error);
      //
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    console.log(getMetrics);
    dispatch(actions.storeMetrics(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <FormControl className={classes.formControl}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={metrics}
        getOptionLabel={option => option}
        onChange={(event, newInputValue) => {
          dispatch(actions.selectedMetrics(newInputValue));
        }}
        renderInput={params => (
          <TextField {...params} variant="standard" label="Select" placeholder="Select measurments" />
        )}
      />

      <FormHelperText>select one of the metrics</FormHelperText>
    </FormControl>
  );
};
