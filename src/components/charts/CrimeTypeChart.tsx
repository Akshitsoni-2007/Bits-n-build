'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface CrimeTypeChartProps {
  data: { crime_type: string; count: number }[];
  onSelectCrime?: (crime: string) => void;
  selectedCrime?: string;
}

const COLORS = [
  '#c82a2a', // Primary Crimson
  '#cea03d', // Gold Accent
  '#e05d38', // Amber-Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Yellow-Amber
  '#ec4899', // Pink
];

export default function CrimeTypeChart({
  data,
  onSelectCrime,
  selectedCrime,
}: CrimeTypeChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="w-full h-72 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="count"
            nameKey="crime_type"
            onClick={(entry: any) => onSelectCrime && entry?.crime_type && onSelectCrime(entry.crime_type)}
            className="cursor-pointer"
          >
            {sortedData.map((entry, index) => {
              const isSelected = selectedCrime && selectedCrime.toLowerCase() === entry.crime_type.toLowerCase();
              return (
                <Cell
                  key={`cell-${entry.crime_type}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#191C21"
                  strokeWidth={2}
                  opacity={isSelected || !selectedCrime ? 1 : 0.35}
                />
              );
            })}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#191C21',
              border: '1px solid #27272A',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#FFFFFF',
            }}
            formatter={(value: any, name: any) => [`${value} cases`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
