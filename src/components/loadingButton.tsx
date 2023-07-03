import { useInterval } from '@/hooks/useInterval';
import { useState } from 'react';

export function LoadingButtonWithChangingText({
  action,
  isLoading,
  loadingTextArray,
}: {
  action: () => void;
  isLoading: boolean;
  loadingTextArray: string[];
}) {
  const [currentLoadingTextIndex, setCurrentLoadingTextIndex] = useState(0);

  useInterval(() => {
    setCurrentLoadingTextIndex((currentLoadingTextIndex + 1) % loadingTextArray.length);
  }, 2000); // 2 seconds

  return (
    <button onClick={action} className={`btn-primary btn-block btn ${isLoading && 'loading'}`}>
      {isLoading ? `${loadingTextArray[currentLoadingTextIndex]}...` : 'Get Judged'}
    </button>
  );
}
