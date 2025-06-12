
import Document from '../models/documents.js';

 
export const saveDocument = async (req, res) => {
  const { documentId, documentName, content, createdBy, collaborators } = req.body;

  try {
    let doc = await Document.findOneAndUpdate(
      { documentId }, 
      {
        documentId,
        documentName,
        content,
        createdBy,
        collaborators: collaborators || []
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save document' });
  }
};

 
export const addCollaborator = async (req, res) => {
  const { documentId, collaborator } = req.body;

  try {
    let doc = await Document.findOneAndUpdate(
      { documentId },
      { $addToSet: { collaborators: collaborator } },  
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
};
export const getDocumentsByCollaborator = async (req, res) => {
  const { email } = req.body;  

  try {
    const documents = await Document.find({
      $or: [
        { collaborators: email },
        { createdBy: email }
      ]
    });
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};
export const getDocumentById = async (req, res) => {
  const { documentId } = req.params;
  try {
    const document = await Document.findOne({ documentId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ document });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};