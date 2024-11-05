import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { CREATE_LIST } from '../utils/mutations';

const CreateList = ({ isOpen, onClose, onListCreated }) => {
    const [listName, setListName] = useState("");
    const [createList] = useMutation(CREATE_LIST, {
        onCompleted: (data) => {
            onListCreated(data.createList);
            onClose();
        }
    });

    if (!isOpen) {
        console.log("Modal not open");
        return null; // Prevent rendering if modal is not open
    }
    
    console.log("Modal is open");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (listName.trim()) {
            await createList({ variables: { listName } });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}> {/* Close modal when overlay is clicked */}
            <div className="modal" onClick={(e) => e.stopPropagation()}> {/* Prevent close on modal click */}
                <h2>Create New List</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="List Name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        required
                    />
                    <button type="submit">Create List</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export default CreateList;
