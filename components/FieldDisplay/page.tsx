"use client"

import { useState } from 'react';
import { FieldDisplayProps } from '@/app/types/order'

function FieldDisplay({ 
    label, value, field, isEditable, onSave, inputType, options 
}: FieldDisplayProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(field, currentValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    if (!isEditing || !isEditable) {
        return (
            <div>
                <span className="label">{label}</span>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <p className={`text-lg font-medium ${!value ? 'text-gray-400' : ''}`}>{value || `No ${label.toLowerCase()}`}</p>
                    {isEditable && (
                        <div>
                            <button 
                                className="btn btn-primary text-sm" 
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <span className="label">{label} (Editing)</span>

            {inputType === 'text' && (
                <input 
                    className="input w-full border-2 border-gray-400" 
                    value={currentValue} 
                    onChange={(e) => setCurrentValue(e.target.value)} 
                    onBlur={handleSave} 
                    onKeyDown={(e) => { 
                        if (e.key === 'Enter') {
                            e.preventDefault(); 
                            handleSave(); 
                        } else if (e.key === 'Escape') {
                            handleCancel();
                        }
                    }}
                    autoFocus
                />
            )}

            {inputType === 'textarea' && (
                <>
                    <textarea 
                        className="input w-full" 
                        value={currentValue} 
                        onChange={(e) => setCurrentValue(e.target.value)}
                        rows={5}
                        autoFocus
                    />
                    <div className="flex space-x-2 mt-2">
                        <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                    </div>
                </>
            )}

            {inputType === 'select' && (
                <>
                    <select 
                        className="input w-full" 
                        value={currentValue} 
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onBlur={handleSave} 
                        autoFocus
                    >
                        {options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}

export default FieldDisplay