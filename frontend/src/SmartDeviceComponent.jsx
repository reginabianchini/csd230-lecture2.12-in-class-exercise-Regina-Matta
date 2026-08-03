import { useState } from 'react';
import { useAuth } from './provider/AuthProvider';
import api from './api/axiosConfig';

function SmartDeviceComponent({ id, name, brand, price, productType, batteryLifeHours, smartAssistant, onDelete, onUpdate }) {
    const { isAdmin } = useAuth(); // Snatch global admin flag
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState({ name, price, batteryLifeHours, smartAssistant });

    const handleSave = () => {
        const updated = {
            ...tempData,
            price: parseFloat(tempData.price),
            batteryLifeHours: parseInt(tempData.batteryLifeHours)
        };

        api.put(`/rest/smart-devices/${id}`, updated)
            .then(res => {
                onUpdate(res.data);
                setIsEditing(false);
            })
            .catch(() => alert("Update failed: Admin permissions required."));
    };

    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid #28a745', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fafffa' }}>
                <input style={{ flex: 2 }} type="text" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} />
                <input style={{ width: '80px' }} type="number" step="0.01" value={tempData.price} onChange={(e) => setTempData({...tempData, price: e.target.value})} />

                {productType === "SmartWatch" ? (
                    <input style={{ width: '60px' }} type="number" value={tempData.batteryLifeHours} onChange={(e) => setTempData({...tempData, batteryLifeHours: e.target.value})} />
                ) : (
                    <input style={{ width: '100px' }} type="text" value={tempData.smartAssistant} onChange={(e) => setTempData({...tempData, smartAssistant: e.target.value})} />
                )}

                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
            <div className="info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{name} <small style={{ color: '#28a745' }}>[{productType}]</small></h3>
                <p style={{ margin: 0 }}>
                    <strong>Brand:</strong> {brand} |
                    <strong> Price:</strong> ${Number(price).toFixed(2)} |
                    {productType === 'SmartWatch' ?
                        ` 🔋 ${batteryLifeHours}hrs Battery` :
                        ` 🤖 Assistant: ${smartAssistant}`
                    }
                </p>
            </div>

            {/* RBAC: Only render actions if user is an admin */}
            {isAdmin && (
                <div className="actions">
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default SmartDeviceComponent;