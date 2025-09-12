// Simplified Essential Components - Direct JSX functions, no registry
// Each component is a simple function that returns JSX
import { h, css } from "./simple.tsx";

/**
 * Button Component - Essential interactive element
 */
export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = ""
}: {
  children: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}) {
  const sizeClasses = {
    sm: "btn-sm",
    md: "btn-md", 
    lg: "btn-lg"
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost"
  };

  return (
    <button
      type={type}
      className={`btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Sizes */
        .btn-sm { padding: 6px 12px; font-size: 14px; }
        .btn-md { padding: 8px 16px; font-size: 16px; }
        .btn-lg { padding: 12px 24px; font-size: 18px; }
        
        /* Variants */
        .btn-primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
          border-color: #2563eb;
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
          border-color: #6b7280;
        }
        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
          border-color: #4b5563;
        }
        
        .btn-outline {
          background: transparent;
          color: #3b82f6;
          border-color: #3b82f6;
        }
        .btn-outline:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
        }
        
        .btn-ghost {
          background: transparent;
          color: #3b82f6;
          border-color: transparent;
        }
        .btn-ghost:hover:not(:disabled) {
          background: #eff6ff;
        }
      `}</style>
    </button>
  );
}

/**
 * Input Component - Essential form element
 */
export function Input({
  type = "text",
  placeholder,
  value,
  disabled = false,
  required = false,
  className = "",
  name,
  id,
  onInput,
  onChange,
  dataBind
}: {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  onInput?: string;
  onChange?: string;
  dataBind?: string; // For state binding
}) {
  return (
    <input
      type={type}
      className={`input ${className}`.trim()}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
      onInput={onInput}
      onChange={onChange}
      data-bind={dataBind}
    >
      <style>{`
        .input {
          display: block;
          width: 100%;
          padding: 8px 12px;
          font-size: 16px;
          line-height: 1.5;
          color: #1f2937;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        
        .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .input:disabled {
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }
        
        .input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </input>
  );
}

/**
 * Card Component - Essential layout element
 */
export function Card({
  children,
  title,
  className = "",
  padding = true
}: {
  children: string;
  title?: string;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div className={`card ${padding ? 'card-padded' : ''} ${className}`.trim()}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
      <style>{`
        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .card-padded {
          padding: 16px;
        }
        
        .card-title {
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .card-content {
          color: #374151;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

/**
 * Alert Component - Essential feedback element
 */
export function Alert({
  children,
  variant = "info",
  title,
  dismissible = false,
  className = ""
}: {
  children: string;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
  className?: string;
}) {
  const variantClasses = {
    info: "alert-info",
    success: "alert-success", 
    warning: "alert-warning",
    error: "alert-error"
  };

  return (
    <div className={`alert ${variantClasses[variant]} ${className}`.trim()}>
      {title && <strong className="alert-title">{title}</strong>}
      <div className="alert-content">{children}</div>
      {dismissible && (
        <button 
          className="alert-dismiss" 
          onClick="this.parentElement.remove()"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
      <style>{`
        .alert {
          position: relative;
          padding: 12px 16px;
          border: 1px solid transparent;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .alert-title {
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .alert-content {
          line-height: 1.4;
        }
        
        .alert-dismiss {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          opacity: 0.7;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .alert-dismiss:hover {
          opacity: 1;
        }
        
        /* Variants */
        .alert-info {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1e40af;
        }
        
        .alert-success {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }
        
        .alert-warning {
          background: #fffbeb;
          border-color: #fde68a;
          color: #92400e;
        }
        
        .alert-error {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}

/**
 * Container Component - Essential layout wrapper
 */
export function Container({
  children,
  size = "md",
  className = ""
}: {
  children: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}) {
  const sizeClasses = {
    sm: "container-sm",
    md: "container-md",
    lg: "container-lg", 
    xl: "container-xl",
    full: "container-full"
  };

  return (
    <div className={`container ${sizeClasses[size]} ${className}`.trim()}>
      {children}
      <style>{`
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 0 16px;
        }
        
        .container-sm { max-width: 640px; }
        .container-md { max-width: 768px; }
        .container-lg { max-width: 1024px; }
        .container-xl { max-width: 1280px; }
        .container-full { max-width: none; }
        
        @media (max-width: 640px) {
          .container {
            padding: 0 12px;
          }
        }
      `}</style>
    </div>
  );
}