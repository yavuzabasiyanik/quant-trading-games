import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

// Define our data structure
interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChartProps {
  data: CandleData[];
  indicators?: string[];
  showFuture?: boolean;
}

const CandlestickChart = ({ data, indicators = [], showFuture = false }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Clear any existing chart
    chartContainerRef.current.innerHTML = '';
    
    // Create chart
    const chart = createChart(chartContainerRef.current);
    
    // Set chart options
    chart.applyOptions({
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#1f2937' }, // Dark background
        textColor: '#d1d5db', // Light gray text
      },
      grid: {
        vertLines: { color: '#374151' }, // Darker grid lines
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 0, // CrosshairMode.Normal
        vertLine: {
          color: '#6b7280',
          width: 1,
          style: 1, // LineStyle.Dashed
        },
        horzLine: {
          color: '#6b7280',
          width: 1,
          style: 1, // LineStyle.Dashed
        },
      },
      timeScale: {
        borderColor: '#4b5563', // Gray border
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Prepare data
    const displayData = showFuture ? data : data.slice(0, -5);

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    candlestickSeries.setData(displayData.map(item => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    })));

    // Add decision point marker if not showing future
    if (!showFuture && displayData.length > 0) {
      const lastPoint = displayData[displayData.length - 1];
      candlestickSeries.setMarkers([
        {
          time: lastPoint.time,
          position: 'aboveBar',
          color: '#2196F3',
          shape: 'arrowDown',
          text: 'Decision Point',
        }
      ]);
    }

    // Add indicators
    if (indicators.includes('sma')) {
      const smaData = calculateSMA(displayData, 20);
      const smaSeries = chart.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
        title: 'SMA 20',
      });
      smaSeries.setData(smaData);
    }

    if (indicators.includes('ema')) {
      const emaData = calculateEMA(displayData, 20);
      const emaSeries = chart.addLineSeries({
        color: '#C2185B',
        lineWidth: 2,
        title: 'EMA 20',
      });
      emaSeries.setData(emaData);
    }

    if (indicators.includes('bollinger')) {
      const bollingerData = calculateBollingerBands(displayData, 20);
      
      const upperSeries = chart.addLineSeries({
        color: '#7B1FA2',
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dashed
        title: 'Upper Band',
      });
      
      const lowerSeries = chart.addLineSeries({
        color: '#7B1FA2',
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dashed
        title: 'Lower Band',
      });

      upperSeries.setData(bollingerData.upper);
      lowerSeries.setData(bollingerData.lower);
    }

    if (indicators.includes('volume') && displayData.length > 0 && displayData[0].volume !== undefined) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Create a separate scale for volume
      });
      
      volumeSeries.setData(displayData.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close >= item.open ? '#26a69a80' : '#ef535080',
      })));
    }

    // Fit content
    chart.timeScale().fitContent();

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, indicators, showFuture]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

// Helper functions for indicators
function calculateSMA(data: CandleData[], period: number) {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  
  return result;
}

function calculateEMA(data: CandleData[], period: number) {
  const result = [];
  const multiplier = 2 / (period + 1);
  let ema = data[0].close;
  
  for (let i = 0; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    
    result.push({
      time: data[i].time,
      value: ema,
    });
  }
  
  return result;
}

function calculateBollingerBands(data: CandleData[], period: number, multiplier = 2) {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sumSquaredDiff = 0;
    
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - sma[i - (period - 1)].value;
      sumSquaredDiff += diff * diff;
    }
    
    const stdDev = Math.sqrt(sumSquaredDiff / period);
    const smaValue = sma[i - (period - 1)].value;
    
    upper.push({
      time: data[i].time,
      value: smaValue + multiplier * stdDev,
    });
    
    lower.push({
      time: data[i].time,
      value: smaValue - multiplier * stdDev,
    });
  }
  
  return { upper, lower };
}

export default CandlestickChart;