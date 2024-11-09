import React, { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { GET_MY_LISTS } from "../utils/queries";

export default function AddToListModal({ isOpen, onClose, productToAdd }) {
    const { data, loading, error } = useQuery(GET_MY_LISTS);
    const [userLists, setUserLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null); // State to hold selected list details

    useEffect(() => {
        if (data && data.getMyLists) {
            setUserLists(data.getMyLists);
        }
    }, [data]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (!isOpen) {
        return null;
    }

    const handleSelectChange = (e) => {
        const selectedListId = e.target.value;
        const selectedListName = userLists.find(list => list._id === selectedListId)?.listName;
        setSelectedList({ id: selectedListId, name: selectedListName });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedList) {
            console.log(`Adding product to list: ${selectedList.name} (ID: ${selectedList.id})`, "product id: " , productToAdd.itemId);
            // Here you can perform any action with the selected list and product data.
        }
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Choose List</h2>
                <form onSubmit={handleSubmit}>
                    <select onChange={handleSelectChange} required>
                        <option value="">Select a list</option> {/* Placeholder option */}
                        {userLists.map((list) => (
                            <option key={list._id} value={list._id}>
                                {list.listName}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Add to List</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

