import '../styles/Buttons.css';

const MainButton = ({ children, onClick, type = 'button', className = '', disabled, ...props }) => (
  <button
    type={type}
    className={`main-btn ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default MainButton;
