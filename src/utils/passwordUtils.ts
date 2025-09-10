export interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 1: weak, 2: fair, 3: good, 4: strong)
  feedback: string[];
  isStrong: boolean;
  color: string;
}

export interface PasswordRequirement {
  label: string;
  met: boolean;
  icon: string;
}

export const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (password: string) => password.length >= 8 },
  { label: "At least one uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
  { label: "At least one lowercase letter", test: (password: string) => /[a-z]/.test(password) },
  { label: "At least one number", test: (password: string) => /\d/.test(password) },
  { label: "At least one special character", test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
];

export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      feedback: ["Enter a password"],
      isStrong: false,
      color: "text-red-500"
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Password should be at least 8 characters long");
  }

  // Character variety checks
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include at least one uppercase letter");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include at least one lowercase letter");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include at least one number");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include at least one special character");
  }

  // Bonus points for longer passwords
  if (password.length >= 12) {
    score += 0.5;
  }
  if (password.length >= 16) {
    score += 0.5;
  }

  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 0.5;
    feedback.push("Avoid repeated characters");
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    score -= 1;
    feedback.push("Avoid common patterns");
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(4, Math.round(score)));

  let color = "text-red-500";
  let isStrong = false;

  if (score >= 4) {
    color = "text-green-500";
    isStrong = true;
  } else if (score >= 3) {
    color = "text-blue-500";
  } else if (score >= 2) {
    color = "text-yellow-500";
  } else if (score >= 1) {
    color = "text-orange-500";
  }

  // If no specific feedback, provide general guidance
  if (feedback.length === 0 && score < 4) {
    feedback.push("Password is good but could be stronger");
  }

  return {
    score,
    feedback,
    isStrong,
    color
  };
};

export const getPasswordRequirements = (password: string): PasswordRequirement[] => {
  return PASSWORD_REQUIREMENTS.map(req => ({
    label: req.label,
    met: req.test(password),
    icon: req.test(password) ? "✓" : "✗"
  }));
};

export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Unknown";
  }
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-orange-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}; 