import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleBreadCrubms } from '../components/Breadcrumb/BreadcrumbSlice';

const useBreadcrumbs = (items) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (items?.length) {
      dispatch(handleBreadCrubms(items));
    }
  }, [dispatch, items]);
};

export default useBreadcrumbs;
