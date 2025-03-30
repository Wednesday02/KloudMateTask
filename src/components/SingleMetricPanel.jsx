import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import calculateFontSize from '../utils/fontStyle';


const SingleMetricPanel = ({ 
    data = { label: 'Temperature', value: 73 },
    initialWidth = 360,
    initialHeight = 200
  }) => {
    const [gridSize, setGridSize] = useState({ width: initialWidth, height: initialHeight });
  
    return (
      <Resizable
        size={gridSize}
        minWidth={120}
        minHeight={80}
        onResize={(e, direction, ref) => {
          setGridSize({ 
            width: ref.offsetWidth, 
            height: ref.offsetHeight 
          });
        }}
        style={{ 
          background: '#111',
          border: '1px solid #444',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          color: '#fff',
          fontSize: '12px',
          opacity: 0.8,
          zIndex: 10, 
          backgroundColor: 'rgba(17, 17, 17, 0.7)', 
          padding: '2px 4px',
          borderRadius: '2px',
          maxWidth: '40%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          Single Series
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2a2a2a',
          height: '100%',
          width: '100%',
          color: '#fff',
          padding: '8px',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            fontSize: `${calculateFontSize(gridSize.width, gridSize.height, data.value, false, true)}px`,
            fontWeight: 'bold',
            lineHeight: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            {data.value}
          </div>
          <div style={{ 
            fontSize: `${Math.min(32, calculateFontSize(gridSize.width, gridSize.height, data.label, true, true))}px`,
            opacity: 0.8,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {data.label}
          </div>
        </div>
      </Resizable>
    );
  };

export default SingleMetricPanel;