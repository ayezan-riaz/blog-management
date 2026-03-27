import './Loader.css';

const Loader = ({ fullScreen = false, size = 'md' }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen" id="loader">
        <div className="loader-content">
          <div className={`loader-spinner ${size}`} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <div className={`loader-spinner ${size}`} id="loader-inline" />;
};

export default Loader;
