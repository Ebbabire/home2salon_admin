import { useEffect, useState } from "react";

const queryConfig = {
  onSuccess: (data: any) => {},
  onError: (error: string) => {},
};

type ConfigProp = {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
};

type ApiFn = () => any;
const useQuery = (apiFn: ApiFn, config: ConfigProp = queryConfig) => {
  const [state, setState] = useState({
    data: null,
    isSuccess: true,
    isError: false,
    isLoading: false,
    error: "",
  });

  const { onSuccess, onError } = config;

  async function fetchData() {
    if (!apiFn) return;

    setState((prevState) => ({ ...prevState, isLoading: true }));
    try {
      const data = await apiFn();

      console.log("data", data);
      setState((prevState) => ({
        ...prevState,
        data: data,
        isSuccess: true,
        isError: false,
      }));
      onSuccess && onSuccess(data);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        data: null,
        isSuccess: false,
        isError: true,
        error: error.message,
      }));
      onError && onError(error.message);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);
  return state;
};

export default useQuery;
