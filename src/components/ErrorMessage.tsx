///components/errormensaje
import React from 'react';

interface ErrorMessageProps {
  children: React.ReactNode;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <p className="text-red-600 text-sm mt-1">
      {children}
    </p>
  );
}
