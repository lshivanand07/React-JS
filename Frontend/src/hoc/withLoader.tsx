/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '../components/Loader/Loader';

function withLoader(WrappedComponent: React.ComponentType<any>) {
  return function WithLoadingComponent(props: any) {
    const { loading, ...rest } = props;
    if (loading) {
      return <Loader />;
    }
    return <WrappedComponent {...rest} />;
  };
}

export default withLoader;
