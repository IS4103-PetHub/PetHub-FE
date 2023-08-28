import React from "react";
import PasswordStrengthBar from "react-password-strength-bar";

interface PasswordBarProps {
  password: string;
}

const PasswordBar = ({ password }: PasswordBarProps) => {
  return <PasswordStrengthBar password={password} minLength={8} />;
};

export default PasswordBar;
