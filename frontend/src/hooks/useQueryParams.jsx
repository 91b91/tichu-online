import { useLocation, useNavigate } from 'react-router-dom';

export function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  // Get the base URL (everything before the query params)
  const baseUrl = `${window.location.origin}${location.pathname}`;

  function setQueryParams(params) {
    const newQuery = new URLSearchParams(params).toString();
    navigate(`?${newQuery}`);
  }

  return { queryParams, setQueryParams, baseUrl };
}
