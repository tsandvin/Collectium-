import React, { HTMLAttributes } from "react";

type StatusCardProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  label: string;
  note?: string;
  tone?: "green" | "gold" | "red" | "blue" | "neutral";
};

export default function StatusCard({ value, label, note, tone = "neutral", className = "", ...props }: StatusCardProps) {
  return (
    <div className={`ct-status-card ct-status-card-${tone} ${className}`} {...props}>
      <strong className="ct-status-card-value">{value}</strong>
      <span className="ct-status-card-label">{label}</span>
      {note && <small className="ct-status-card-note">{note}</small>}
    </div>
  );
}
