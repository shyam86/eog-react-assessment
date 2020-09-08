import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader, createStyles, Grid, makeStyles, Paper, Theme } from '@material-ui/core';
import MetricSelector from '../../components/MetricSelector';
import MetricCard from '../../components/MetricCard';
import { useDispatch, useSelector } from 'react-redux';

import Plotly from 'plotly.js';
import { IState } from '../../store';

import createPlotlyComponent from 'react-plotly.js/factory';

var randomColor = require('randomcolor');
const Plot = createPlotlyComponent(Plotly);

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
    card: {
      margin: '5% 5%',
    },
  }),
);

function Dashboard() {
  const classes = useStyles();
  const { selectedMeasurements, metricsSelected } = useSelector((state: IState) => state.metricsList);

  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <MetricCard />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <MetricSelector />
              </Paper>
            </Grid>

            {selectedMeasurements.length > 0 && (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Plot
                    data={selectedMeasurements.map((measurement: any) => ({
                      x: measurement.measurements.map((list: { at: string }) => list.at),
                      y: measurement.measurements.map((list: { value: string }) => list.value),
                      type: 'scatter',
                      mode: 'lines',
                      hovertemplate: `%{x}<extra></extra>` + `<br><i><b>%{text.metric}</b> :%{y}</i>`,
                      line: { color: randomColor() },
                      text: measurement.measurements,
                    }))}
                    layout={{
                      xaxis: {
                        type: 'date',
                        title: 'Time',
                        titlefont: {
                          family: 'Arial, sans-serif',
                          size: 20,
                          color: 'red',
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
