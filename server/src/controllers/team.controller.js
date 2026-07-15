const Collaboration = require('../models/Collaboration');
const TeamChat = require('../models/TeamChat');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

const checkPendingStatus = async (user) => {
  const invite = await Collaboration.findOne({ email: user.email.toLowerCase() });
  return invite && invite.status === 'Pending';
};

const getMembers = async (req, res) => {
  try {
    if (await checkPendingStatus(req.user)) {
      return sendError(res, 'Access denied. Please accept your pending team invitation first.', {}, 403);
    }

    let members = await Collaboration.find({});
    
    // Seed initial mock members if database is empty
    if (members.length === 0) {
      const initialMembers = [
        { name: 'Neha Sharma', email: 'neha.sharma@codemind.ai', role: 'Reviewer', status: 'Active', joinedDate: '2026-07-01', invitedBy: req.user.id },
        { name: 'Aditya Kumar', email: 'aditya.k@codemind.ai', role: 'Viewer', status: 'Active', joinedDate: '2026-07-08', invitedBy: req.user.id },
        { name: 'Rohan Sen', email: 'rohan.sen@codemind.ai', role: 'Reviewer', status: 'Pending', joinedDate: '2026-07-14', invitedBy: req.user.id }
      ];
      await Collaboration.insertMany(initialMembers);
      members = await Collaboration.find({});
    }

    // Include the primary user (the current logged in user) as Admin
    const primaryMember = {
      _id: req.user.id,
      name: `${req.user.name} (You)`,
      email: req.user.email,
      role: 'Admin',
      status: 'Active',
      joinedDate: new Date(req.user.createdAt || Date.now()).toISOString().split('T')[0]
    };

    return sendSuccess(res, 'Team members fetched successfully', [primaryMember, ...members]);
  } catch (error) {
    return sendError(res, 'Failed to fetch team members', error.message, 500);
  }
};

const inviteCollaborator = async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return sendError(res, 'Name and email are required', {}, 400);
  }

  try {
    const existing = await Collaboration.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 'User already invited or part of team', {}, 400);
    }

    const member = await Collaboration.create({
      name,
      email: email.toLowerCase(),
      role: role || 'Reviewer',
      status: 'Pending',
      invitedBy: req.user.id
    });

    return sendSuccess(res, 'Invitation sent successfully', member, 201);
  } catch (error) {
    return sendError(res, 'Failed to invite collaborator', error.message, 500);
  }
};

const removeCollaborator = async (req, res) => {
  const { id } = req.params;
  try {
    await Collaboration.findByIdAndDelete(id);
    return sendSuccess(res, 'Collaborator removed successfully');
  } catch (error) {
    return sendError(res, 'Failed to remove collaborator', error.message, 500);
  }
};

const getChat = async (req, res) => {
  try {
    if (await checkPendingStatus(req.user)) {
      return sendError(res, 'Access denied. Please accept your pending team invitation first.', {}, 403);
    }

    let logs = await TeamChat.find({}).sort({ createdAt: 1 });
    
    // Seed initial chat logs if empty
    if (logs.length === 0) {
      const initialLogs = [
        { senderId: req.user.id, senderName: 'Neha Sharma', message: 'Hey team, I just pushed the new audit script.' },
        { senderId: req.user.id, senderName: 'Aditya Kumar', message: 'Looks clean! Can someone run it on client files?' },
        { senderId: req.user.id, senderName: 'System Bot', message: 'Audit triggered on project CodeMind-Client by Neha Sharma.' }
      ];
      await TeamChat.insertMany(initialLogs);
      logs = await TeamChat.find({}).sort({ createdAt: 1 });
    }

    return sendSuccess(res, 'Team chat loaded successfully', logs);
  } catch (error) {
    return sendError(res, 'Failed to load team chat', error.message, 500);
  }
};

const postChatMessage = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return sendError(res, 'Message is required', {}, 400);
  }

  try {
    if (await checkPendingStatus(req.user)) {
      return sendError(res, 'Access denied. Please accept your pending team invitation first.', {}, 403);
    }

    const chat = await TeamChat.create({
      senderId: req.user.id,
      senderName: req.user.name,
      message
    });
    return sendSuccess(res, 'Message posted successfully', chat, 201);
  } catch (error) {
    return sendError(res, 'Failed to post message', error.message, 500);
  }
};

const checkMyInvitation = async (req, res) => {
  try {
    const invite = await Collaboration.findOne({ email: req.user.email.toLowerCase() })
      .populate('invitedBy', 'name email');

    if (!invite) {
      return sendSuccess(res, 'No invitation found', { exists: false });
    }
    return sendSuccess(res, 'Invitation status retrieved', {
      exists: true,
      status: invite.status,
      role: invite.role,
      name: invite.name,
      invitedBy: invite.invitedBy ? {
        name: invite.invitedBy.name,
        email: invite.invitedBy.email
      } : { name: 'Workspace Admin', email: 'admin@codemind.ai' }
    });
  } catch (error) {
    return sendError(res, 'Failed to check invitation status', error.message, 500);
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const invite = await Collaboration.findOne({ email: req.user.email.toLowerCase(), status: 'Pending' });
    if (!invite) {
      return sendError(res, 'No pending invitation found for your user profile', {}, 400);
    }

    invite.status = 'Active';
    invite.joinedDate = new Date().toISOString().split('T')[0];
    await invite.save();

    // Sync role changes to User
    await User.findByIdAndUpdate(req.user.id, { role: invite.role });

    return sendSuccess(res, 'Invitation accepted successfully, access granted.', invite);
  } catch (error) {
    return sendError(res, 'Failed to accept invitation', error.message, 500);
  }
};

const rejectInvitation = async (req, res) => {
  try {
    const invite = await Collaboration.findOneAndDelete({ email: req.user.email.toLowerCase(), status: 'Pending' });
    if (!invite) {
      return sendError(res, 'No pending invitation found for your user profile', {}, 400);
    }
    return sendSuccess(res, 'Invitation rejected successfully.');
  } catch (error) {
    return sendError(res, 'Failed to reject invitation', error.message, 500);
  }
};

module.exports = {
  getMembers,
  inviteCollaborator,
  removeCollaborator,
  getChat,
  postChatMessage,
  checkMyInvitation,
  acceptInvitation,
  rejectInvitation
};
