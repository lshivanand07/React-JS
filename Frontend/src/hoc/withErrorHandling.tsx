/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import ErrorHandling from '../components/ErrorHandle/Error';

const withErrorHandling = (WrappedComponent: React.ComponentType<any>) => {
  return function WithErrorHandlingComponent(props: any) {
    const { serverError, ...rest } = props;
    let serverErrorMessage = null;

    if (serverError instanceof TypeError) {
      console.log(serverError.message);
      serverErrorMessage =
        'Unable to connect to the server. Please try again later.';
    } else if (serverError instanceof Error) {
      console.log(serverError.message);
      serverErrorMessage = serverError.message;
    } else {
      serverErrorMessage = 'Something went wrong. Please try again later.';
    }

    if (serverError) {
      return <ErrorHandling message={serverErrorMessage} />;
    }
    return <WrappedComponent {...rest} />;
  };
};

export default withErrorHandling;
