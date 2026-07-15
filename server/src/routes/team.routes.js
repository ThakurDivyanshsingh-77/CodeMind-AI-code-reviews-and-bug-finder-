const express = require('express');
const { 
  getMembers, 
  inviteCollaborator, 
  removeCollaborator, 
  getChat, 
  postChatMessage, 
  checkMyInvitation, 
  acceptInvitation,
  rejectInvitation
} = require('../controllers/team.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/members', getMembers);
router.post('/invite', inviteCollaborator);
router.delete('/members/:id', removeCollaborator);
router.get('/chat', getChat);
router.post('/chat', postChatMessage);
router.get('/my-invitation', checkMyInvitation);
router.post('/accept-invitation', acceptInvitation);
router.post('/reject-invitation', rejectInvitation);

module.exports = router;
