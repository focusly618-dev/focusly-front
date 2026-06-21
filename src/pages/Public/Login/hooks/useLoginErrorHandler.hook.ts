import axios from 'axios';

export const useLoginErrorHandler = () => {
  const handleError = (error: unknown, context: string) => {
    if (axios.isAxiosError(error)) {
      alert(`${context}: ` + (error.response?.data?.message || error.message));
    } else if (error instanceof Error) {
      alert(`${context}: ` + error.message);
    } else {
      alert(`${context}: Ocurrió un error desconocido`);
    }
  };

  return { handleError };
};
