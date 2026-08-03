import { useState } from 'react';
import { useAuth } from './provider/AuthProvider'; // 1. Snatch Global Auth

function Book({ id, title, author, price, onDelete, onUpdate }) {
    const { isAdmin } = useAuth(); // 2. Hook into admin status

    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempAuthor, setTempAuthor] = useState(author);
    const [tempPrice, setTempPrice] = useState(price);

    const handleSave = () => {
        onUpdate(id, { title: tempTitle, author: tempAuthor, price: parseFloat(tempPrice), copies: 10 });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="book-row editing" style={{ border: '2px solid orange', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fffdf5' }}>
                <input style={{ flex: 2 }} type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                <input style={{ flex: 1 }} type="text" value={tempAuthor} onChange={(e) => setTempAuthor(e.target.value)} />
                <input style={{ width: '80px' }} type="number" step="0.01" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        );
    }

    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="book-info">
                <h3>{title}</h3>
                <p><strong>Author:</strong> {author} | <strong>Price:</strong> ${Number(price).toFixed(2)}</p>
            </div>

            {/* 3. RBAC UI LOGIC: Only draw the buttons if the user is an Admin */}
            {isAdmin && (
                <div className="book-actions">
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', cursor: 'pointer' }}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Book;

