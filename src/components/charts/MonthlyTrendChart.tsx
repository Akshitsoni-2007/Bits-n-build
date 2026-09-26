'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Dot,
} from 'recharts';

interface MonthlyTrendChartProps {
  data: { month: string; count: number }[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#A1A1AA"
            tick={{ fill: '#A1A1AA', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#27272A' }}
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
            formatter={(value: any) => [`${value} recorded`, 'Aggregated Monthly Volume']}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#cea03d"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#cea03d', stroke: '#191C21', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#c82a2a', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
