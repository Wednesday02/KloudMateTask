import React from 'react';
import SingleMetricPanel from './components/SingleMetricPanel';
import ResponsiveMetricsGrid from './components/ResponsiveMetricsPanel';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const App = () => {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      background: '#0a0a0a',
      minHeight: '100vh'
    }}>
      <SingleMetricPanel 
        data={{ label: 'Temperature', value: 73 }}
        initialWidth={360}
        initialHeight={200}
      />
      <ResponsiveMetricsGrid 
        data={[
          { label: 'Temperature', value: 73 },
          { label: 'Humidity', value: 65 },
          { label: 'Wind Speed', value: 15 },
          { label: 'UV', value: 3 },
          { label: 'Air Quality Index', value: 42 },
          { label: 'Precipitation', value: 30 },
          { label: 'Cloud Cover', value: 75 },
          { label: 'Visibility', value: 8 },
          { label: 'Pressure', value: 1013 }
        ]}
        initialWidth={800}
        initialHeight={400}
      />
    </div>
  );
};

export default App;