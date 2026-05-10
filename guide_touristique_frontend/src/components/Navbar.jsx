import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isBusiness, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__logo" onClick={() => navigate('/')}>TRIPOVA</div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/tours" className="navbar__link">Tours</Link>
        <Link to="/hotels" className="navbar__link">Hotels</Link>
        <Link to="/restaurants" className="navbar__link">Restaurants</Link>
        {user && (
          <Link
            to={isAdmin() ? '/admin-dashboard' : isBusiness() ? '/business-dashboard' : '/dashboard'}
            className="navbar__link"
          >
            {isAdmin() ? 'Admin' : isBusiness() ? 'Business' : 'Dashboard'}
          </Link>
        )}
      </div>
      <div className="navbar__actions">
        {user ? (
          <>
            <span className="navbar__user">Welcome, {user.username || user.name || user.email}</span>
            <button
              className="navbar__button navbar__button--ghost"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="navbar__button navbar__button--ghost" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="navbar__button navbar__button--primary" onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;