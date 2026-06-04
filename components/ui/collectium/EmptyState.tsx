import React, { HTMLAttributes } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
  description?: string;
};

export default function EmptyState({ message, description, className = "", ...props }: EmptyStateProps) {
  return (
    <div className={`ct-empty-state ${className}`} {...props}>
      <strong>{message}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}
