import React, { HTMLAttributes, ReactNode } from "react";

type DataTableProps = HTMLAttributes<HTMLDivElement> & {
  headers?: ReactNode[];
  children: ReactNode;
};

export default function DataTable({ headers, children, className = "", ...props }: DataTableProps) {
  return (
    <div className={`ct-data-table-container ${className}`} {...props}>
      {headers && (
        <div className="ct-data-table-header">
          {headers.map((header, index) => (
            <div key={index} className="ct-data-table-header-col">
              {header}
            </div>
          ))}
        </div>
      )}
      <div className="ct-data-table-body">{children}</div>
    </div>
  );
}
