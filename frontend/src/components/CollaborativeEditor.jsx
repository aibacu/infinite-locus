import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { io } from 'socket.io-client';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

const socket = io('http://localhost:5000', { withCredentials: true });

const CollaborativeEditor = () => {
  const [content, setContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const [documentId] = useState(() => `doc-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  const quillRef = useRef(null);

  useEffect(() => {
    socket.on('receive-changes', (data) => {
      setContent(data);
    });
    return () => {
      socket.off('receive-changes');
    };
  }, []);

  const handleChange = (value) => {
    setContent(value);
    socket.emit('edit-document', value);
  };

   
  const handleAddCollaborator = async () => {
    if (!collaboratorEmail) {
      alert('Please enter a collaborator email.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/document/add-collaborator',
        { documentId, collaborator: collaboratorEmail },
        { withCredentials: true }
      );
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail('');
      alert('Collaborator added!');
    } catch (err) {
      alert('Failed to add collaborator');
    }
  };

  const handleSave = async () => {
    if (!documentName) {
      alert('Please enter document name.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/document/save',
        {
          documentId,
          documentName,
          content,
          createdBy,
          collaborators
        },
        { withCredentials: true }
      );
      alert('Document saved!');
    } catch (err) {
      alert('Failed to save document');
    }
  };

  return (
    <div>
      <h2>Collaborative Editor</h2>
      <input
        type="text"
        placeholder="Document Name"
        value={documentName}
        onChange={e => setDocumentName(e.target.value)}
        style={{ marginBottom: '10px', width: '300px' }}
      /><br />
      <input
        type="email"
        placeholder="Collaborator Email"
        value={collaboratorEmail}
        onChange={e => setCollaboratorEmail(e.target.value)}
        style={{ marginBottom: '10px', width: '220px' }}
      />
      <button onClick={handleAddCollaborator} style={{ marginLeft: '10px' }}>Add Collaborator</button>
      <div style={{ margin: '10px 0' }}>
        <strong>Collaborators:</strong>
        <ul>
          {collaborators.map((email, idx) => (
            <li key={idx}>{email}</li>
          ))}
        </ul>
      </div>
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleChange}
        theme="snow"
        style={{ height: '400px', marginBottom: '50px' }}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CollaborativeEditor;