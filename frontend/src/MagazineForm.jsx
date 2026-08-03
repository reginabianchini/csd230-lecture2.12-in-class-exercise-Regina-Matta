import { useState } from 'react';
import api from './api/axiosConfig';

function MagazineForm({ onAdded }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(5.99);
    const [orderQty, setOrderQty] = useState(50);
    const [isDiscMag, setIsDiscMag] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Match Java Entity properties exactly
        const payload = {
            title,
            price: parseFloat(price),
            orderQty: parseInt(orderQty),
            copies: 10,
            currentIssue: new Date().toISOString(), // Standard LocalDateTime ISO format
            ...(isDiscMag ? { hasDisc: true } : {})
        };

        api.post('/rest/magazines', payload)
            .then(res => {
                alert("Department Updated: Magazine Saved!");
                onAdded(res.data);
                setTitle('');
            })
            .catch(() => alert("Access Denied: Admin role required for POST operations."));
    };

    return (
        <div style={{ border: '2px solid #aa3bff', padding: '20px', borderRadius: '8px', background: '#fcfaff' }}>
            <h3>New Magazine Inventory</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Magazine Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={{ flex: 1 }} />
                    <input type="number" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} placeholder="Order Qty" style={{ flex: 1 }} />
                </div>
                <label style={{ fontWeight: 'bold', color: '#555' }}>
                    <input type="checkbox" checked={isDiscMag} onChange={(e) => setIsDiscMag(e.target.checked)} />
                    Include Companion Software Disc? (DiscMagEntity)
                </label>
                <button type="submit" style={{ backgroundColor: '#aa3bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Add to Department
                </button>
            </form>
        </div>
    );
}

export default MagazineForm;