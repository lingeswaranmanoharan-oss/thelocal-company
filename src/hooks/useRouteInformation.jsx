import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const useRouteInformation = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const pathParams = useParams();
  let [queryParams] = useSearchParams();
  queryParams = Object.fromEntries(queryParams);
  const activepageNumber = queryParams.page || 0;

  const navigateToLogin = () => {
    navigate(`/login?ref=${pathname}`, { replace: true });
  };

  const navigateToRoute = (navigatepath, state) => {
    if (state) {
      navigate(navigatepath, { state });
    } else {
      if (location.state) {
        navigate(navigatepath, { state: location.state });
      } else {
        navigate(navigatepath);
      }
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const navigateWithFunction = (existingQueryParams) => {
    const params = new URLSearchParams({ ...existingQueryParams });
    const path = `${pathname}?${params.toString()}`;
    navigateToRoute(path);
  };

  const setPageNumberToInitial = () => {
    const pageNumber = queryParams.page;
    if (pageNumber !== null && parseInt(pageNumber)) {
      const existingQueryParams = { ...queryParams, page: parseInt(0) };
      navigateWithFunction(existingQueryParams);
    }
  };

  const setQueryParams = (params) => {
    const existingQueryParams = { ...queryParams, ...params };

    for (const [key, _] of Object.entries(existingQueryParams)) {
      if (!existingQueryParams[key]) {
        delete existingQueryParams[key];
      }
    }
    navigateWithFunction(existingQueryParams);
  };

  return {
    pathname,
    location,
    pathParams,
    navigate,
    navigateToLogin,
    navigateBack,
    navigateToRoute,
    queryParams,
    setQueryParams,
    activepageNumber,
    setPageNumberToInitial,
  };
};
export default useRouteInformation;
