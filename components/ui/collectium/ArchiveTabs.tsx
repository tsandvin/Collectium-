import React, { HTMLAttributes } from "react";

type TabItem = {
  key: string;
  label: React.ReactNode;
};

type ArchiveTabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function ArchiveTabs({ items, activeKey, onChange, className = "", ...props }: ArchiveTabsProps) {
  return (
    <div className={`ct-archive-tabs ${className}`} {...props}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={`ct-archive-tab-btn ${activeKey === item.key ? "active" : ""}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
