export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
