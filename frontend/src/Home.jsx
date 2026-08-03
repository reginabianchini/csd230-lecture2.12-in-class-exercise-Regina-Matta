import { useLocation } from 'react-router';

function Home() {
    /**
     * S26 Logic: Technical URL Parsing
     * We look for the ?expired=true flag added by the Axios Interceptor
     */
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isExpired = queryParams.get("expired");

    const containerStyle = {
        textAlign: "center",
        padding: "50px",
        fontFamily: "Arial, sans-serif"
    };

    const warningStyle = {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffeeba',
        marginBottom: '30px',
        fontWeight: 'bold',
        display: 'inline-block',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    };

    const iconStyle = {
        fontSize: "120px",
        margin: "40px 0",
        display: "block"
    };

    return (
        <div style={containerStyle}>
            <h1>Welcome to DigitalReads Admin</h1>

            {/* S26 SECURITY FEEDBACK: Shown only if kicked out by the Robot */}
            {isExpired && (
                <div style={warningStyle}>
                    ⚠️ Security Alert: Your RSA session has expired or was invalid.
                    <br/>
                    Please log in again to restore your access.
                </div>
            )}

            <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Use the navigation bar above to manage your Digital Library inventory.
            </p>

            <div style={iconStyle}>
                📖🚀
            </div>

            <p style={{ marginTop: '20px', color: '#28a745', fontWeight: 'bold' }}>
                Status: ● Connected to RSA Asymmetric Resource Server
            </p>
        </div>
    );
}

export default Home;
