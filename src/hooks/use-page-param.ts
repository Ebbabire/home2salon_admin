import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function usePageParam(paramName: string = "page") {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = Number(params.get(paramName)) || 1;
    const normalizedPage = page > 0 ? Math.floor(page) : 1;
    setCurrentPage(normalizedPage);
  }, [location.search, paramName]);

  const setPage = useCallback(
    (page: number) => {
      const normalizedPage = page > 0 ? Math.floor(page) : 1;
      const params = new URLSearchParams(location.search);

      if (normalizedPage > 1) {
        params.set(paramName, String(normalizedPage));
      } else {
        params.delete(paramName);
      }

      const query = params.toString();
      navigate(`${location.pathname}${query ? `?${query}` : ""}`, {
        replace: false,
      });
    },
    [location.pathname, location.search, navigate, paramName],
  );

  return { page: currentPage, setPage };
}
