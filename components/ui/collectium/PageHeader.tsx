import React, { HTMLAttributes, ReactNode } from "react";

type PageHeaderProps = HTMLAttributes<HTMLDivElement> & {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHeader({ kicker, title, description, children, className = "", ...props }: PageHeaderProps) {
  return (
    <div className={`ct-page-header ${className}`} {...props}>
      <div className="ct-page-header-main">
        {kicker && <p className="ct-kicker">{kicker}</p>}
        <h1 className="ct-title">{title}</h1>
        {description && <p className="ct-description">{description}</p>}
      </div>
      {children && <div className="ct-page-header-actions">{children}</div>}
    </div>
  );
}
