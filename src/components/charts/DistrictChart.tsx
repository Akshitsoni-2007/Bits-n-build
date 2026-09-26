'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

interface DistrictChartProps {
  data: { district: string; count: number }[];
  onSelectDistrict?: (district: string) => void;
  selectedDistrict?: string;
}

export default function DistrictChart({
  data,
  onSelectDistrict,
  selectedDistrict,
}: DistrictChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
          <XAxis
            type="number"
            stroke="#A1A1AA"
            tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#27272A' }}
          />
          <YAxis
            type="category"
            dataKey="district"
            stroke="#A1A1AA"
            tick={{ fill: '#FFFFFF', fontSize: 11, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#27272A' }}
            width={85}
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
            cursor={{ fill: 'rgba(200, 42, 42, 0.08)' }}
            formatter={(value: any) => [`${value} incidents`, 'Count']}
          />
          <Bar
            dataKey="count"
            radius={[0, 6, 6, 0]}
            onClick={(entry: any) => onSelectDistrict && entry?.district && onSelectDistrict(entry.district)}
            className="cursor-pointer"
          >
            {sortedData.map((entry) => {
              const isSelected = selectedDistrict && selectedDistrict.toLowerCase() === entry.district.toLowerCase();
              return (
                <Cell
                  key={`cell-${entry.district}`}
                  fill={isSelected ? '#c82a2a' : '#cea03d'}
                  opacity={isSelected || !selectedDistrict ? 1 : 0.4}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
