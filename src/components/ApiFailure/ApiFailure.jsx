import { Button } from '../Button/Button';

export const ApiFailure = ({ text, callBackFunction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <i className="fas fa-exclamation-circle text-[var(--hrm-error)] text-5xl mb-4"></i>
      <p className="text-gray-600 mb-4">{text || 'Failed to load data'}</p>
      {callBackFunction && (
        <Button onClick={callBackFunction} size="sm">
          Retry
        </Button>
      )}
    </div>
  );
};
