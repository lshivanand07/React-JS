import './Button.css';
type ButtonProps = {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

function Button({ text, onClick, disabled }: Readonly<ButtonProps>) {
  return (
    <button className="btn" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
