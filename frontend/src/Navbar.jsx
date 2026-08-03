import { Link } from 'react-router';
import { useAuth } from './provider/AuthProvider';


function Navbar({ username, onLogout }) {
    // 1. Hook into our Global RSA Auth Context
    // We snatch 'isAdmin' to decide what links to show
    const { isAdmin } = useAuth();


    // 2. Inline Styles for a "Hardened" S26 look
    const navStyle = {
        padding: '1rem',
        backgroundColor: '#222',
        color: 'white',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };


    const linkGroupStyle = {
        display: 'flex',
        gap: '20px'
    };


    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.1rem'
    };


    const logoutButtonStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    };


    return (
        <nav style={navStyle}>
            {/* LEFT SIDE: Navigation Links */}
            <div style={linkGroupStyle}>
                <Link to="/" style={linkStyle}>🏠 Home</Link>
                <Link to="/inventory" style={linkStyle}>📚 Books</Link>
                <Link to="/magazines" style={linkStyle}>📰 Magazines</Link> {/* Public/User view */}
                <Link to="/niche" style={linkStyle}> Smart Devices</Link>

                {isAdmin && (
                    <>
                        <Link to="/add" style={{ ...linkStyle, color: '#ffc107' }}>➕ Add Book</Link>
                        <Link to="/magazines/add" style={{ ...linkStyle, color: '#aa3bff' }}>➕ Add Magazine</Link>
                        <Link to="/niche/add" style={{color: '#28a745'}}>+ Add Device</Link>
                    </>
                )}
            </div>


            {/* RIGHT SIDE: User Info and Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <span style={{ fontSize: '0.9rem', color: '#ccc' }}>
                   User: <strong style={{ color: 'white' }}>{username}</strong>
               </span>


                <button
                    onClick={onLogout}
                    style={logoutButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
