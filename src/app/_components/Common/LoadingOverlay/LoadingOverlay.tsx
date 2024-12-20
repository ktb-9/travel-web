export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent" />
          <span className="text-lg">처리중...</span>
        </div>
      </div>
    </div>
  );
};
