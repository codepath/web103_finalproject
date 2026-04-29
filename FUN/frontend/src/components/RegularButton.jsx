import '../styles/Buttons.css';

const RegularButton = ({ children, onClick, type = 'button', className = '', disabled, ...props }) => (
  <button
    type={type}
    className={`regular-btn ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default RegularButton;
