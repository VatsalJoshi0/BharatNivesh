function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="theme-toggle" onClick={onToggle}>
      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    </button>
  );
}

export default ThemeToggle;
