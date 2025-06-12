import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true
  },
  documentName: {
    type: String,
    required: true
  },
  collaborators: {
    type: [String],  
    default: []
  },
  content: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String  
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

export default Document;
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