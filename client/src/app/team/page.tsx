'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2, CheckCircle2, UserCheck, Calendar, Send, MessageSquare, AlertCircle, Inbox, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Reviewer' | 'Viewer';
  joinedDate: string;
  status: 'Active' | 'Pending';
}

interface ChatLog {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export default function TeamPage() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Reviewer' | 'Viewer'>('Reviewer');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [inviteStatus, setInviteStatus] = useState<'Pending' | 'Active' | 'None'>('None');
  const [inviteRoleName, setInviteRoleName] = useState('');
  const [senderInfo, setSenderInfo] = useState<{ name: string; email: string } | null>(null);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Members & Chat logs
  const fetchData = async () => {
    try {
      // 1. Check invitation status
      const statusRes = await api.get('/team/my-invitation');
      if (statusRes.data?.success && statusRes.data.data.exists) {
        const status = statusRes.data.data.status;
        setInviteStatus(status);
        setInviteRoleName(statusRes.data.data.role);
        setSenderInfo(statusRes.data.data.invitedBy || null);

        // If invitation is Pending, do not fetch members and chat logs
        if (status === 'Pending') {
          return;
        }
      } else {
        setInviteStatus('None');
        setSenderInfo(null);
      }

      // 2. Fetch team details
      const [membersRes, chatRes] = await Promise.all([
        api.get('/team/members'),
        api.get('/team/chat')
      ]);

      if (membersRes.data?.success) {
        setTeamMembers(membersRes.data.data);
      }
      if (chatRes.data?.success) {
        setChatLogs(chatRes.data.data);
      }
    } catch (err: any) {
      console.error('Failed to sync team data:', err);
    }
  };

  // Poll for updates every 3 seconds to keep it "real-time working"
  useEffect(() => {
    fetchData(); // Initial load
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new message inside container only (prevents full window scrolling)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLogs]);

  // Send Invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    setInviteLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/team/invite', {
        name: inviteName,
        email: inviteEmail,
        role: inviteRole
      });

      if (response.data?.success) {
        setSuccessMsg(`Invitation dispatched to ${inviteEmail} successfully!`);
        setInviteEmail('');
        setInviteName('');
        setInviteRole('Reviewer');
        fetchData(); // Reload
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  // Accept Invitation
  const handleAcceptInvite = async () => {
    setAcceptLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/team/accept-invitation');
      if (response.data?.success) {
        setSuccessMsg('You have successfully accepted the workspace invitation!');
        setInviteStatus('Active');
        fetchData(); // Sync members and chat logs
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setAcceptLoading(false);
    }
  };

  // Reject Invitation
  const handleRejectInvite = async () => {
    if (!confirm('Are you sure you want to reject this workspace invitation?')) return;
    setAcceptLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post('/team/reject-invitation');
      if (response.data?.success) {
        setSuccessMsg('You rejected the workspace invitation.');
        setInviteStatus('None');
        setSenderInfo(null);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to reject invitation');
    } finally {
      setAcceptLoading(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke workspace access for ${name}?`)) return;

    try {
      const response = await api.delete(`/team/members/${id}`);
      if (response.data?.success) {
        setSuccessMsg(`Collaborator ${name} removed from workspace.`);
        fetchData(); // Reload
      }
    } catch (err: any) {
      setErrorMsg('Failed to remove collaborator');
    }
  };

  // Post Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    setNewMessage('');

    try {
      const response = await api.post('/team/chat', { message: messageToSend });
      if (response.data?.success) {
        // Optimistically update
        setChatLogs(prev => [...prev, response.data.data]);
      }
    } catch (err: any) {
      console.error('Failed to post message:', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* Editorial Header */}
      <div className="border-b-4 border-ink-black pb-6 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">collaboration desk • ed. 1.0</span>
        <h1 className="text-3xl font-serif font-black uppercase text-ink-black tracking-tight">Team Access & Collaboration</h1>
        <p className="font-body italic text-sm text-neutral-600">Assign roles, invite code reviewers, and coordinate audits in real-time.</p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 border border-ink-black bg-neutral-100 text-ink-black text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <CheckCircle2 size={14} className="text-emerald-700 font-bold" />
          <span>INVITE: {successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 border border-editorial-red bg-editorial-red/5 text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <AlertCircle size={14} />
          <span>ERROR: {errorMsg}</span>
        </div>
      )}

      {/* Conditional Rendering based on Invitation Status */}
      {inviteStatus === 'Pending' ? (
        /* Invitation Pending Screen - BLOCKS all other features */
        <div className="bg-paper-bg border-2 border-ink-black p-8 flex flex-col items-center justify-center text-center gap-6 max-w-2xl mx-auto sharp-corners hard-shadow-hover font-sans my-8">
          <div className="w-16 h-16 border border-ink-black bg-ink-black text-paper-bg flex items-center justify-center sharp-corners">
            <Inbox size={28} strokeWidth={1.5} className="animate-pulse" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-serif font-black uppercase tracking-tight text-ink-black">Workspace Invitation Pending</h2>
            
            {senderInfo ? (
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wide leading-relaxed bg-neutral-100 p-3 border border-dashed border-ink-black/20 sharp-corners">
                Invited By: <strong className="text-ink-black">{senderInfo.name}</strong> ({senderInfo.email})
              </p>
            ) : (
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Invited By: Workspace Administrator
              </p>
            )}

            <p className="text-sm font-body text-neutral-600 max-w-md mt-2">
              You have been invited to join the team workspace as a <strong className="text-ink-black font-mono font-extrabold uppercase border-b border-ink-black px-1">{inviteRoleName}</strong>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
            <button
              onClick={handleAcceptInvite}
              disabled={acceptLoading}
              className="bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-400"
            >
              <CheckCircle2 size={14} />
              <span>{acceptLoading ? 'Processing...' : 'Accept Invitation'}</span>
            </button>
            <button
              onClick={handleRejectInvite}
              disabled={acceptLoading}
              className="bg-transparent hover:bg-editorial-red text-ink-black hover:text-paper-bg border border-ink-black hover:border-editorial-red px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-400"
            >
              <XCircle size={14} />
              <span>Reject Invitation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Full Workspace Access - Form & Active Members */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Invite Form & Real-time Chat */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            
            {/* Invitation Form Panel */}
            <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners hard-shadow-hover font-sans z-10">
              <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
                <UserPlus size={16} strokeWidth={1.5} />
                Invite Collaborator
              </h2>

              <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Divyansh Singh"
                    className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Authorization Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="bg-paper-bg border border-ink-black text-ink-black px-3 py-2.5 outline-none text-xs font-mono font-bold focus:bg-neutral-100 cursor-pointer w-full sharp-corners"
                  >
                    <option value="Admin">Admin (Full Control)</option>
                    <option value="Reviewer">Reviewer (Audits & Chat)</option>
                    <option value="Viewer">Viewer (Read-Only Logs)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="w-full bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:bg-neutral-300 disabled:text-neutral-400"
                >
                  {inviteLoading ? 'Sending Dispatch...' : 'Dispatch Invitation'}
                </button>
              </form>
            </div>

            {/* Real-time Team Chat Box */}
            <div className="bg-paper-bg border border-ink-black p-5 flex flex-col gap-4 sharp-corners hard-shadow-hover font-sans h-[380px] z-10">
              <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
                <MessageSquare size={16} strokeWidth={1.5} />
                Team Wire Chat
              </h2>

              {/* Chat Messages Log */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-[11px] leading-relaxed">
                {chatLogs.map((log) => {
                  const isBot = log.senderName === 'System Bot';
                  return (
                    <div key={log._id} className="flex flex-col gap-0.5 border-b border-dashed border-ink-black/5 pb-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${isBot ? 'text-editorial-red' : 'text-ink-black'}`}>
                          {log.senderName}
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`mt-0.5 ${isBot ? 'italic text-neutral-500' : 'text-neutral-700'}`}>{log.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Input Message Bar */}
              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-ink-black pt-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type wire transmission..."
                  className="flex-1 border-b border-ink-black bg-transparent px-2 py-1 font-mono text-xs focus:outline-none w-full"
                />
                <button 
                  type="submit"
                  className="p-2 bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black sharp-corners transition-colors cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Active Members List (2 spans) */}
          <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
            <div className="flex items-center gap-2 border-b border-ink-black pb-2">
              <Users size={16} strokeWidth={1.5} className="text-ink-black" />
              <h2 className="text-lg font-serif font-black uppercase text-ink-black tracking-tight">Active Workspace Members</h2>
            </div>

            <div className="flex flex-col gap-5">
              {teamMembers.map((member) => {
                const isSelf = member.email === user?.email || member.name.includes('(You)');
                const isActive = member.status === 'Active';
                return (
                  <div 
                    key={member._id} 
                    className="bg-paper-bg border border-ink-black p-5 flex flex-col gap-4 sharp-corners hard-shadow-hover transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-5">
                      {/* Square Avatar Block */}
                      <div className="w-14 h-14 border-2 border-ink-black bg-ink-black text-paper-bg flex items-center justify-center font-serif font-black text-xl sharp-corners select-none flex-shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Metadata Grid (Matches Profile Information layout) */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1 text-xs font-mono uppercase tracking-wider w-full">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-400 font-bold text-[8px] tracking-widest">Full Name</span>
                          <span className="text-ink-black font-sans font-bold text-xs capitalize truncate">{member.name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-400 font-bold text-[8px] tracking-widest">Email Address</span>
                          <span className="text-ink-black font-sans font-bold text-xs lowercase select-all truncate">{member.email}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-400 font-bold text-[8px] tracking-widest">Access Role</span>
                          <span className="text-ink-black font-sans font-bold text-xs capitalize flex items-center gap-1">
                            <Shield size={10} className="text-ink-black" /> {member.role}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-400 font-bold text-[8px] tracking-widest">Membership Status</span>
                          <span className="text-ink-black font-sans font-bold text-xs flex items-center gap-1.5">
                            {isActive ? (
                              <>
                                <UserCheck size={11} className="text-emerald-700" />
                                <span className="text-emerald-700 uppercase font-bold text-[10px]">Active Member</span>
                              </>
                            ) : (
                              <>
                                <Mail size={11} className="text-editorial-red animate-pulse" />
                                <span className="text-editorial-red uppercase font-bold text-[10px] animate-pulse">Invite Pending</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Revoke/Remove Member Button */}
                      {!isSelf && (
                        <button
                          onClick={() => handleRemoveMember(member._id, member.name)}
                          title="Remove Collaborator"
                          className="p-2.5 border border-ink-black hover:border-editorial-red hover:bg-editorial-red hover:text-paper-bg transition-colors sharp-corners flex-shrink-0 cursor-pointer self-end md:self-center"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    
                    {/* Subtle Date Footer */}
                    <div className="border-t border-ink-black/10 pt-3 flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={10} /> Joined: {member.joinedDate}</span>
                      <span>ID: {member._id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
