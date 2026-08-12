import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
      <span className="stat-title">{title}</span>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
};