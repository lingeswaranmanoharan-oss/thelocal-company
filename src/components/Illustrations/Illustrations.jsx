export const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>
  );
};
export const ApiFailure = ({ text, callBackFunction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
      <p className="text-gray-600 mb-4">{text || 'Failed to load data'}</p>
      {callBackFunction && (
        <button
          onClick={callBackFunction}
          className="px-4 py-2 bg-#dc2626-500 text-white rounded-lg hover:bg-#dc2626-600 transition-all"
        >
          Retry
        </button>
      )}
    </div>
  );
};
