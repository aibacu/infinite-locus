import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [showEditDocs, setShowEditDocs] = useState(false);

  const handleEditDocuments = async () => {
    const email = prompt('Enter your email to fetch your documents:');
    if (!email) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/document/by-collaborator',
        { email },
        { withCredentials: true }
      );
      setDocuments(res.data.documents || []);
      setShowEditDocs(true);
    } catch (err) {
      alert('Failed to fetch documents');
      setDocuments([]);
      setShowEditDocs(true);
    }
  };

  const handleDocumentClick = (docId) => {
    navigate(`/editor/${docId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <button style={{ marginRight: 10 }} onClick={() => navigate('/editor')}>
        Create Document
      </button>
      <button onClick={handleEditDocuments}>Edit Document</button>
      <div style={{ marginTop: 30 }}>
        <h3>{showEditDocs ? 'Your Editable Documents' : 'Your Documents'}</h3>
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul>
            {documents.map(doc => (
              <li
                key={doc.documentId}
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => handleDocumentClick(doc.documentId)}
              >
                <strong>{doc.documentName}</strong>
                <br />
                <span style={{ fontSize: '0.9em', color: '#555' }}>ID: {doc.documentId}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;