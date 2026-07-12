import './Error.css';
import Button from '../Buttons/Button';

type ErrorProps = {
  message: string;
};

function ErrorHandling({ message }: Readonly<ErrorProps>) {
  return (
    <div className="container">
      <div className="error-page">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p className="error-message">{message}</p>
        <Button text="Retry" onClick={() => globalThis.location.reload()} />
      </div>
    </div>
  );
}

export default ErrorHandling;
