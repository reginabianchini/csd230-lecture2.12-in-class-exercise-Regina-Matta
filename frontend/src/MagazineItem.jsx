import { useState } from 'react';
import { useAuth } from './provider/AuthProvider';
import api from './api/axiosConfig';

function MagazineItem({ id, title, price, orderQty, currentIssue, productType, hasDisc, onDelete, onUpdate }) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState({ title, price, orderQty, hasDisc });

    const handleSave = () => {
        const updated = {
            ...tempData,
            price: parseFloat(tempData.price),
            orderQty: parseInt(tempData.orderQty),
            copies: 10 // Defaulting inventory copies
        };

        api.put(`/rest/magazines/${id}`, updated)
            .then(res => {
                onUpdate(res.data);
                setIsEditing(false);
            })
            .catch(() => alert("Update failed. Check Admin permissions."));
    };

    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid #aa3bff', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fdfaff' }}>
                <input style={{ flex: 2 }} type="text" value={tempData.title} onChange={(e) => setTempData({...tempData, title: e.target.value})} />
                <input style={{ width: '80px' }} type="number" step="0.01" value={tempData.price} onChange={(e) => setTempData({...tempData, price: e.target.value})} />
                <input style={{ width: '60px' }} type="number" value={tempData.orderQty} onChange={(e) => setTempData({...tempData, orderQty: e.target.value})} />
                {productType === "DiscMagEntity" && (
                    <label><input type="checkbox" checked={tempData.hasDisc} onChange={(e) => setTempData({...tempData, hasDisc: e.target.checked})} /> Disc?</label>
                )}
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
            <div className="book-info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{title} <small style={{ color: '#888', fontSize: '0.7em' }}>({productType})</small></h3>
                <p style={{ margin: 0 }}>
                    <strong>Price:</strong> ${Number(price).toFixed(2)} |
                    <strong> Qty:</strong> {orderQty} |
                    <strong> Issue:</strong> {new Date(currentIssue).toLocaleDateString()}
                    {hasDisc && <span style={{ marginLeft: '10px', color: '#aa3bff' }}>💿 Included</span>}
                </p>
            </div>

            {isAdmin && (
                <div className="book-actions">
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default MagazineItem;