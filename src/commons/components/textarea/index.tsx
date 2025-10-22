/**
 * Textarea Component
 * Design Source: Figma (Input 기준 확장)
 * Last Updated: 2025-10-22
 */

import React from "react";
import styles from "./styles.module.css";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      required,
      error = false,
      errorMessage,
      containerClassName = "",
      className = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const containerClassNames = [
      styles.container,
      containerClassName,
    ].filter(Boolean).join(" ");

    const textareaClassNames = [
      styles.textarea,
      error && styles.error,
      disabled && styles.disabled,
      className,
    ].filter(Boolean).join(" ");

    return (
      <div className={containerClassNames}>
        {label && (
          <div className={styles.labelArea}>
            <label className={styles.label}>{label}</label>
            {required && <span className={styles.required}>*</span>}
          </div>
        )}
        <textarea ref={ref} className={textareaClassNames} disabled={disabled} {...rest} />
        {error && errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
