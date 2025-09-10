import React from "react";
import { 
  checkPasswordStrength, 
  getPasswordRequirements, 
  getPasswordStrengthText, 
  getPasswordStrengthColor,
  type PasswordStrength,
  type PasswordRequirement 
} from "@/utils/passwordUtils";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  className = ""
}) => {
  const strength = checkPasswordStrength(password);
  const requirements = getPasswordRequirements(password);

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Password Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={`font-medium ${strength.color}`}>
            {getPasswordStrengthText(strength.score)}
          </span>
        </div>
        
        {/* Strength Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(strength.score)}`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {strength.feedback.length > 0 && (
        <div className="space-y-2">
          {strength.feedback.map((message, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Password Requirements */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Password requirements:
          </p>
          <div className="space-y-1">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  requirement.met ? "text-green-600" : "text-red-500"
                }`}
              >
                {requirement.met ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{requirement.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for Weak Passwords */}
      {!strength.isStrong && password.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Weak password detected</p>
              <p className="mt-1">
                Your password doesn't meet security requirements. Please choose a stronger password to protect your account.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 