import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' && 
    error !== null && 
    'message' in error
  );
}
