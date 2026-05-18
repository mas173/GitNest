import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GitPullRequest, GitMerge, XCircle, GitBranch, User,
  Clock, MessageSquare, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Send,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

//  Mock data (to be replaced with API call: GET /api/pull-requests/:id)
const MOCK_PR = {
  id: '1',
  number: 24,
  title: 'feat(auth): add JWT refresh token rotation',
  status: 'open',
  author: 'ravi_dev',
  fromBranch: 'feat/jwt-refresh',
  toBranch: 'main',
  createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  description: `## Summary\n\nAdds JWT refresh token rotation to improve session security. When the access token expires, the client can use the refresh token to obtain a new pair without re-authentication.\n\n## Changes\n- Added \`refreshToken\` field to User model\n- New \`POST /api/auth/refresh\` endpoint\n- Middleware updated to handle 401 and auto-retry with refresh\n\n## Testing\n- Tested manually with Postman\n- Access token expiry set to 15m for testing`,
  diff: [
    {
      file: 'backend/src/models/User.model.js',
      chunks: [
        { type: 'context', line: 12, content: '  email: { type: String, required: true, unique: true },' },
        { type: 'context', line: 13, content: '  password: { type: String, required: true },' },
        { type: 'added', line: 14, content: '  refreshToken: { type: String, default: null },' },
        { type: 'context', line: 15, content: '  role: { type: String, default: "user" },' },
      ],
    },
    {
      file: 'backend/src/controllers/auth.controller.js',
      chunks: [
        { type: 'removed', line: 34, content: '  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });' },
        { type: 'added', line: 34, content: '  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });' },
        { type: 'added', line: 35, content: '  const refresh = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });' },
        { type: 'added', line: 36, content: '  user.refreshToken = refresh;' },
        { type: 'added', line: 37, content: '  await user.save();' },
        { type: 'context', line: 38, content: '  res.json({ token, user: { id: user._id, email: user.email } });' },
      ],
    },
  ],
  comments: [
    {
      id: 'c1',
      author: 'Ankita15k',
      avatar: 'A',
      body: 'Looks good overall! Could you also add a `POST /api/auth/logout` endpoint that clears the refresh token from the DB?',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: 'general',
    },
    {
      id: 'c2',
      author: 'priya_codes',
      avatar: 'P',
      body: 'LGTM on the model change. One thought — should we index `refreshToken` for faster lookups?',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'general',
    },
  ],
  reviews: [
    { author: 'Ankita15k', status: 'changes_requested', avatar: 'A' },
  ],
};

const statusConfig = {
  open: { icon: <GitPullRequest className="w-4 h-4" />, label: 'Open', classes: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
  merged: { icon: <GitMerge className="w-4 h-4" />, label: 'Merged', classes: 'bg-purple-400/10 text-purple-400 border border-purple-400/20' },
  closed: { icon: <XCircle className="w-4 h-4" />, label: 'Closed', classes: 'bg-red-400/10 text-red-400 border border-red-400/20' },
};

function DiffChunk({ file }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden mb-4">
      {/* File Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-white/[0.03] border-b border-zinc-200 dark:border-white/10 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">{file.file}</span>
        <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Diff Lines */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <tbody>
              {file.chunks.map((chunk, i) => (
                <tr
                  key={i}
                  className={
                    chunk.type === 'added'
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                      : chunk.type === 'removed'
                      ? 'bg-red-500/5 dark:bg-red-500/10'
                      : ''
                  }
                >
                  {/* Line number */}
                  <td className="w-12 px-3 py-1 text-right text-zinc-400 select-none border-r border-zinc-200 dark:border-white/5">
                    {chunk.line}
                  </td>
                  {/* Prefix */}
                  <td className="w-6 px-2 py-1 text-center select-none">
                    <span
                      className={
                        chunk.type === 'added'
                          ? 'text-emerald-400'
                          : chunk.type === 'removed'
                          ? 'text-red-400'
                          : 'text-zinc-600'
                      }
                    >
                      {chunk.type === 'added' ? '+' : chunk.type === 'removed' ? '-' : ' '}
                    </span>
                  </td>
                  {/* Content */}
                  <td className="px-3 py-1 text-zinc-800 dark:text-zinc-200 whitespace-pre">
                    {chunk.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment }) {
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex gap-3 py-4 border-b border-zinc-200 dark:border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
        {comment.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-semibold text-sm text-zinc-900 dark:text-white">{comment.author}</span>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{comment.body}</p>
      </div>
    </div>
  );
}

export default function PullRequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const pr = MOCK_PR; // Replace with: usePR(id) or API call

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(pr.comments);
  const [reviewAction, setReviewAction] = useState(null);
  const [activeTab, setActiveTab] = useState('conversation');

  const config = statusConfig[pr.status] || statusConfig.open;

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        author: user?.username || 'You',
        avatar: (user?.username?.[0] || 'Y').toUpperCase(),
        body: comment.trim(),
        createdAt: new Date().toISOString(),
        type: 'general',
      },
    ]);
    setComment('');
  };

  const handleReview = (action) => {
    setReviewAction(action);
    // TODO: POST /api/pull-requests/:id/reviews { action }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#06070a] text-zinc-900 dark:text-white transition-colors">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/pull-requests" className="hover:text-emerald-400 transition-colors">Pull Requests</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-medium">#{pr.number}</span>
        </div>

        {/* PR Title + Status */}
        <div className="mb-6">
          <div className="flex items-start gap-3 flex-wrap mb-3">
            <h1 className="text-2xl font-black tracking-tight flex-1">{pr.title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.classes}`}>
              {config.icon}
              {config.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{pr.author}</span>
              wants to merge
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" />
              <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-xs font-mono">{pr.fromBranch}</code>
              <span>→</span>
              <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-xs font-mono">{pr.toBranch}</code>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {timeAgo(pr.createdAt)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-white/10 mb-6">
          {[
            { key: 'conversation', label: 'Conversation', icon: <MessageSquare className="w-4 h-4" /> },
            { key: 'diff', label: 'Files Changed', icon: <GitBranch className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation Tab */}
        {activeTab === 'conversation' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {pr.author[0].toUpperCase()}
                </div>
                <span className="font-semibold text-sm">{pr.author}</span>
                <span className="text-xs text-zinc-500">• {timeAgo(pr.createdAt)}</span>
              </div>
              <div className="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {pr.description}
              </div>
            </div>

            {/* Comments */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
              <div className="px-5 py-3 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-medium">{comments.length} Comments</span>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-white/5 px-5">
                {comments.map((c) => <CommentItem key={c.id} comment={c} />)}
              </div>

              {/* Add Comment */}
              <div className="px-5 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01]">
                <textarea
                  rows={3}
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder-zinc-500 outline-none focus:border-emerald-400/50 resize-none transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400 text-black text-sm font-semibold hover:scale-[1.02] transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Send className="w-4 h-4" />
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Review Actions */}
            {pr.status === 'open' && (
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                <div className="px-5 py-3 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10">
                  <span className="text-sm font-medium">Review Changes</span>
                </div>
                <div className="px-5 py-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleReview('approve')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      reviewAction === 'approve'
                        ? 'bg-emerald-400/20 border-emerald-400/40 text-emerald-400'
                        : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-emerald-400/30 hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview('changes_requested')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      reviewAction === 'changes_requested'
                        ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400'
                        : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-yellow-400/30 hover:text-yellow-400'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Request Changes
                  </button>
                </div>
                {reviewAction && (
                  <div className="px-5 pb-4">
                    <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl ${
                      reviewAction === 'approve'
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-yellow-400/10 text-yellow-400'
                    }`}>
                      {reviewAction === 'approve'
                        ? <><CheckCircle className="w-4 h-4" /> Review submitted — Approved</>
                        : <><AlertCircle className="w-4 h-4" /> Review submitted — Changes requested</>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Files Changed Tab */}
        {activeTab === 'diff' && (
          <div>
            <p className="text-sm text-zinc-500 mb-4">
              {pr.diff.length} file{pr.diff.length !== 1 ? 's' : ''} changed
            </p>
            {pr.diff.map((file, i) => (
              <DiffChunk key={i} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
