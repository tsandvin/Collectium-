import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "gold";
};

export default function ActionButton({ children, variant = "secondary", className = "", ...props }: ActionButtonProps) {
  return (
    <button className={`ct-btn ct-btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
