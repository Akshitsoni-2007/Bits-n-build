'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from 'recharts';

interface TimeOfDayChartProps {
  data: { hour: number; count: number }[];
}

export default function TimeOfDayChart({ data }: TimeOfDayChartProps) {
  const formattedData = data.map((d) => ({
    hourLabel: `${d.hour.toString().padStart(2, '0')}:00`,
    hour: d.hour,
    count: d.count,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="crimeTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c82a2a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#c82a2a" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis
            dataKey="hourLabel"
            stroke="#A1A1AA"
            tick={{ fill: '#A1A1AA', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#27272A' }}
            interval={3}
          />
          <YAxis
            stroke="#A1A1AA"
            tick={{ fill: '#A1A1AA', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#27272A' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#191C21',
              border: '1px solid #27272A',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
            formatter={(value: any) => [`${value} incidents`, 'Density']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#c82a2a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#crimeTimeGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
