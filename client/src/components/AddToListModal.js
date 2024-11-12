import React, { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { GET_MY_LISTS, GET_MY_RECIPIENTS } from "../utils/queries";

export default function AddToListModal({ isOpen, onClose, productToAdd, modalGiftRoute}) {
    const { data, loading, error } = useQuery(GET_MY_LISTS);
    const [userLists, setUserLists] = useState([]);
    const [recList, setRecList] = useState([]);
    const [selectedList, setSelectedList] = useState(null); // State to hold selected list details
    const { data: recData, loading: recLoading, error: recError } = useQuery(GET_MY_RECIPIENTS);
    

    useEffect(() => {
        if (data && data.getMyLists) {
            setUserLists(data.getMyLists);
        }
        if (recData && recData.getMyRecipients) {
            setRecList(recData.getMyRecipients);
        }
    }, [data, recData]);

    if (loading || recLoading) {
        return <h2>Loading...</h2>;
    }

    if (error || recError) {
        return <p>Error: {error ? error.message : recError.message}</p>;
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
        <>
        {modalGiftRoute === "list" ? 
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
     : 
     <div className="modal-overlay" onClick={onClose}>
     <div className="modal" onClick={(e) => e.stopPropagation()}>
         <h2>Choose a Recipient</h2>
         <form onSubmit={handleSubmit}>
                  <select onChange={handleSelectChange} required>
                      <option value="">Choose Recipient</option> {/* Placeholder option */}
                      {recList.map((rec) => (
                          <option key={rec._id} value={rec._id}>
                              {rec.firstName}
                          </option>
                      ))}
                  </select>
                  <button type="submit">Add to List</button>
              </form>
         <button onClick={onClose}>Close</button>
     </div>
 </div>
     }
        </>
      
    );
};

