import { ErrorMessageProps } from "../../../../../type/ErrorMessage/ErrorMessage";

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 text-red-600">
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};
