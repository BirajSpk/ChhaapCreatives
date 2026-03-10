import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput Component
 * 
 * Reusable password input field with show/hide toggle.
 * Features:
 * - Eye icon toggle for password visibility
 * - Customizable placeholder and label
 * - Error state styling
 * - Disabled state support
 * - Dark mode support
 * 
 * Usage:
 * <PasswordInput
 *   name="password"
 *   placeholder="Enter password"
 *   label="Password"
 *   value={formData.password}
 *   onChange={handleChange}
 *   error={errors.password}
 *   disabled={isLoading}
 * />
 */
export const PasswordInput = ({
  name,
  placeholder = '••••••••',
  label,
  value,
  onChange,
  error,
  disabled = false,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        )}
        <input
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-field ${
            Icon ? 'pl-12' : 'pl-4'
          } pr-12 ${error ? 'border-red-500 focus:ring-red-500/50' : ''}`}
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-500 ml-1 mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default PasswordInput;
