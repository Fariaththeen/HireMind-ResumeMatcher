import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-48 w-full">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
    </div>
  );
}
