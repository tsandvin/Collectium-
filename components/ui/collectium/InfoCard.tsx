import React, { HTMLAttributes, ReactNode } from "react";

type InfoCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
};

export default function InfoCard({ title, children, className = "", ...props }: InfoCardProps) {
  return (
    <div className={`ct-card ${className}`} {...props}>
      {title && <h3 className="ct-card-title">{title}</h3>}
      <div className="ct-card-content">{children}</div>
    </div>
  );
}
