import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message?: React.ReactNode;       // teks alternatif bila children kosong
  variant?: string;                // class utilitas opsional (misal: "bg-black")
}

/**
 * Button fleksibel:
 * - menerima semua atribut button standar (onClick, type, disabled, className, dsb)
 * - variant = class utilitas default (misal untuk bg color)
 * - className akan digabungkan bersama variant
 */
const Button: React.FC<ButtonProps> = ({
  message,
  variant = "bg-black",
  className = "",
  children,
  ...rest // menangkap onClick, type, disabled, dsb.
}) => {
  return (
    <button
      {...rest}
      className={`h-10 px-6 font-semibold rounded-full ${variant} sm:h-12 sm:px-8 ${className}`}
    >
      {children ?? message}
    </button>
  );
};

export default Button;
