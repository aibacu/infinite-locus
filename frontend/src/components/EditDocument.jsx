import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import 'react-quill/dist/quill.snow.css';

const socket = io('http://localhost:5000', { withCredentials: true });

const EditDocument = () => {
  const { documentId } = useParams();
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

   
  useEffect(() => {
    if (documentId) {
      socket.emit('join-document', documentId);
      axios
        .get(`http://localhost:5000/api/document/${documentId}`, { withCredentials: true })
        .then(res => {
          setContent(res.data.document?.content || '');
        })
        .catch(() => {
          alert('Failed to load document');
        });
    }
     
    return () => {
      socket.emit('leave-document', documentId);
    };
  }, [documentId]);

   
  useEffect(() => {
    socket.on('receive-changes', (newContent) => {
      setContent(newContent);
    });
    return () => {
      socket.off('receive-changes');
    };
  }, []);

  const handleChange = (value) => {
    setContent(value);
    socket.emit('edit-document', { documentId, content: value });
  };

  const handleSave = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/document/save',
        { documentId, content },
        { withCredentials: true }
      );
      alert('Document saved!');
    } catch (err) {
      alert('Failed to save document');
    }
  };

  return (
    <div>
      <h2>Edit Document</h2>
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

export default EditDocument;