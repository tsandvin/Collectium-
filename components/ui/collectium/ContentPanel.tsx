import React, { HTMLAttributes, ReactNode } from "react";

type ContentPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function ContentPanel({ children, className = "", ...props }: ContentPanelProps) {
  return (
    <div className={`ct-panel ${className}`} {...props}>
      {children}
    </div>
  );
}
