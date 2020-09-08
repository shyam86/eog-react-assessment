import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { actions } from '../Features/Dashboard/reducer';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
const query = `
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      measurements{ 
      metric
      at
      value
      unit
      }
    }
   }
  `;

export default () => {
  return (
    <Provider value={client}>
      <MetricCard />
    </Provider>
  );
};

const MetricCard = () => {
  const { metricsSelected, currentTime, currentMeasurementValue, selectedMeasurements } = useSelector(
    (state: IState) => state.metricsList,
  );
  const dispatch = useDispatch();
  const metricQuery = metricsSelected.map(metric => ({ metricName: metric, after: currentTime }));

  const [result] = useQuery({
    query,
    variables: {
      input: metricQuery,
    },
    pause: metricsSelected.length == 0,
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    console.log(metricsSelected);
    console.log(currentTime);
    if (!metricsSelected) return;
    if (error) {
      console.log(error);
      // dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    console.log(data);
    dispatch(actions.storeSelectedMeasurements(getMultipleMeasurements));
  }, [data, error]);

  return (
    <Provider value={client}>
      <div>
        {selectedMeasurements.length > 0 ? (
          <>
            {selectedMeasurements.map((list: any) => (
              <CardContent>
                <Typography variant={'h6'}> {list.measurements[list.measurements.length - 1]['metric']}</Typography>
                <Typography variant={'h6'}> {list.measurements[list.measurements.length - 1]['value']}</Typography>
              </CardContent>
            ))}
          </>
        ) : (
          <h3>Please select a metrics</h3>
        )}
      </div>
    </Provider>
  );
};
