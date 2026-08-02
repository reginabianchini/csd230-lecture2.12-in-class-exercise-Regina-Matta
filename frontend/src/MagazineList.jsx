import { useEffect, useState } from 'react';

function MagazineList({ token }) {
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        // Assuming the backend endpoint follows your existing REST pattern
        fetch('/api/rest/magazines', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch magazines");
                return res.json();
            })
            .then(data => {
                setMagazines(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <h3>Loading Magazines...</h3>;

    return (
        <div className="magazine-list" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Magazine Catalog</h1>
            {magazines.length === 0 ? (
                <p>No magazines found in inventory.</p>
            ) : (
                magazines.map((mag) => (
                    <div key={mag.id} className="book-row" style={{
                        border: '1px solid #ccc',
                        margin: '10px 0',
                        padding: '15px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <div className="book-info" style={{ textAlign: 'left' }}>
                            <h3 style={{ margin: '0 0 5px 0' }}>{mag.title}</h3>
                            <p style={{ margin: 0 }}>
                                <strong>Issue:</strong> {mag.currentIssue ? new Date(mag.currentIssue).toLocaleDateString() : 'N/A'} |
                                <strong> Order Qty:</strong> {mag.orderQty} |
                                <strong> Price:</strong> ${Number(mag.price).toFixed(2)}
                            </p>
                        </div>
                        <div className="book-actions">
                            <span style={{
                                padding: '5px 10px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '4px',
                                fontSize: '0.8em',
                                color: '#666'
                            }}>
                                {mag.productType}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MagazineList;