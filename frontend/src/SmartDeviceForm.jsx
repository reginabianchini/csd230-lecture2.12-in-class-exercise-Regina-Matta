import { useState } from 'react';
import api from './api/axiosConfig';

function SmartDeviceForm({ onAdded }) {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState(0.0);
    const [deviceType, setDeviceType] = useState('SmartWatch'); // Discriminator
    const [batteryLife, setBatteryLife] = useState(24); // Watch field
    const [smartAssistant, setSmartAssistant] = useState('Alexa'); // Speaker field

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert types correctly for Java Backend (Double/Integer)
        const payload = {
            name,
            brand,
            price: parseFloat(price),
            // Subclass specific logic
            ...(deviceType === 'SmartWatch'
                ? { batteryLifeHours: parseInt(batteryLife), productType: 'SmartWatch' }
                : { smartAssistant: smartAssistant, productType: 'SmartSpeaker' })
        };

        api.post('/rest/smart-devices', payload)
            .then(res => {
                alert(`${deviceType} saved successfully!`);
                onAdded(res.data);
                // Reset Form
                setName(''); setPrice(0.0);
            })
            .catch(err => {
                console.error(err);
                alert("Access Denied: You must be an Admin to add products.");
            });
    };

    return (
        <div style={{ border: '2px solid #28a745', padding: '20px', borderRadius: '8px', background: '#f8fff9', marginBottom: '20px' }}>
            <h3>Add New Niche Product</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} style={{ padding: '8px' }}>
                    <option value="SmartWatch">Smart Watch (Battery Life Focus)</option>
                    <option value="SmartSpeaker">Smart Speaker (Assistant Focus)</option>
                </select>

                <input type="text" placeholder="Device Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }}/>
                <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required style={{ padding: '8px' }}/>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Price ($):</label>
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    {deviceType === 'SmartWatch' ? (
                        <div style={{ flex: 1 }}>
                            <label>Battery (Hours):</label>
                            <input type="number" value={batteryLife} onChange={(e) => setBatteryLife(e.target.value)} style={{ width: '100%', padding: '8px' }}/>
                        </div>
                    ) : (
                        <div style={{ flex: 1 }}>
                            <label>Assistant:</label>
                            <input type="text" value={smartAssistant} onChange={(e) => setSmartAssistant(e.target.value)} style={{ width: '100%', padding: '8px' }}/>
                        </div>
                    )}
                </div>

                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Save to Niche Department
                </button>
            </form>
        </div>
    );
}

export default SmartDeviceForm;