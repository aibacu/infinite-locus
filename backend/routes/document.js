import express from 'express';
import { saveDocument, addCollaborator, getDocumentsByCollaborator ,getDocumentById} from '../controllers/documents.js';

const router = express.Router();

router.post('/save', saveDocument);
router.post('/add-collaborator', addCollaborator);
router.post('/by-collaborator', getDocumentsByCollaborator); // POST with { email }
router.get('/:documentId', getDocumentById);

export default router;