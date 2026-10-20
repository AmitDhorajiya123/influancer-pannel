import React, { useState } from 'react';
import { CHART_DATA_SETS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

export default function EarningsChart({ currency }) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' or 'monthly'
  const [activeRange, setActiveRange] = useState('30D');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(3); // default hovered on peak Oct 22 / Week 4

  const data = CHART_DATA_SETS[timeframe] || CHART_DATA_SETS.weekly;
  const maxGross = Math.max(...data.map(d => d.gross), 12000);

  // SVG Chart dimensions
  const width = 640;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates for SVG paths
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const yGross = paddingTop + chartHeight - (d.gross / maxGross) * chartHeight;
    const yCommission = paddingTop + chartHeight - ((d.commission * 4) / maxGross) * chartHeight * 0.9;
    return { ...d, x, yGross, yCommission };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts, keyY) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0][keyY]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1[keyY] + (p2[keyY] - p0[keyY]) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2[keyY] - (p3[keyY] - p1[keyY]) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2[keyY]}`;
    }
    return d;
  };

  const commissionLinePath = generateSmoothPath(points, 'yCommission');
  const grossLinePath = generateSmoothPath(points, 'yGross');
  
  // Area path for commission fill
  const commissionAreaPath = `${commissionLinePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredData = points[hoveredPointIndex] || points[3];

  return (
    <div className="earnings-chart-card">
      {/* Chart Header */}
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <h3 className="chart-title">Earnings & Conversion Trend</h3>
          <p className="chart-subtitle">
            Track net-gross volume against affiliate creator revenue share.
          </p>
        </div>

        <div className="chart-controls-wrap">
          {/* Monthly / Weekly toggle */}
          <div className="timeframe-toggle">
            <button 
              className={`toggle-btn ${timeframe === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${timeframe === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </button>
          </div>

          {/* Time range pills */}
          <div className="range-pills">
            {['7D', '30D', '90D', 'YTD', 'All'].map((range) => (
              <button 
                key={range}
                className={`range-pill-btn ${activeRange === range ? 'active' : ''}`}
                onClick={() => setActiveRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="svg-chart-container">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="spline-chart-svg"
          onMouseLeave={() => setHoveredPointIndex(3)}
        >
          <defs>
            <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#D97706" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal Gridlines */}
          {[12000, 9000, 6000, 3000, 0].map((val, idx) => {
            const y = paddingTop + (idx / 4) * chartHeight;
            return (
              <g key={val} className="gridline-group">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  className="chart-grid-line"
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="chart-axis-text"
                  fontSize="10"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area Fill for Commission */}
          <path 
            d={commissionAreaPath} 
            fill="url(#commissionGradient)" 
          />

          {/* Gross User Volume Line (Dashed) */}
          <path 
            d={grossLinePath} 
            fill="none" 
            className="chart-gross-line"
            strokeWidth="2" 
            strokeDasharray="4 4"
            opacity="0.65"
          />

          {/* Net Share Commission Line (Smooth Solid Gold) */}
          <path 
            d={commissionLinePath} 
            fill="none" 
            stroke="#D97706" 
            strokeWidth="3" 
            filter="url(#glow)"
          />

          {/* Interactive Data Dots & Hitboxes */}
          {points.map((pt, index) => (
            <g key={pt.label} className="chart-interactive-point">
              {/* Invisible wide hitbox for mouse tracking */}
              <rect 
                x={pt.x - chartWidth / (points.length * 2)}
                y={paddingTop}
                width={chartWidth / points.length}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPointIndex(index)}
              />

              {/* Point marker on Commission line */}
              <circle 
                cx={pt.x} 
                cy={pt.yCommission} 
                r={hoveredPointIndex === index ? 6 : 3.5} 
                className="chart-dot-marker"
                stroke="#D97706" 
                strokeWidth={hoveredPointIndex === index ? 3 : 2}
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* X Axis Label */}
              <text 
                x={pt.x} 
                y={height - 10} 
                textAnchor="middle" 
                className={`chart-axis-label ${hoveredPointIndex === index ? 'active' : ''}`}
                fontSize="11"
                fontWeight={hoveredPointIndex === index ? "700" : "500"}
              >
                {pt.label}
              </text>
            </g>
          ))}

          {/* Vertical tracker line on hovered point */}
          {hoveredData && (
            <line 
              x1={hoveredData.x} 
              y1={paddingTop} 
              x2={hoveredData.x} 
              y2={paddingTop + chartHeight} 
              stroke="rgba(217, 119, 6, 0.45)" 
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredData && (
          <div 
            className="chart-floating-tooltip"
            style={{
              left: `${Math.min(Math.max((hoveredData.x / width) * 100, 20), 75)}%`,
              top: `24%`
            }}
          >
            <div className="tooltip-badge">
              <span>{hoveredData.label.toUpperCase()} ATTRIBUTED</span>
            </div>
            <div className="tooltip-metrics">
              <span className="tooltip-gross">
                <strong>{formatCurrency(hoveredData.gross, currency)}</strong> Gross
              </span>
              <span className="tooltip-commission">
                • <strong className="text-gold">{formatCurrency(hoveredData.commission, currency)}</strong> Net (25%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="chart-legend-row">
        <div className="legend-item">
          <span className="legend-swatch gold-swatch" />
          <span className="legend-label">Net Commission (25%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch dashed-swatch" />
          <span className="legend-label">Gross User Volume</span>
        </div>
      </div>
    </div>
  );
}
