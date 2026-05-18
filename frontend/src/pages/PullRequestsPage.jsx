import { useState } from 'react';
import { GitPullRequest, GitMerge, XCircle, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import PRCard from '../components/PRCard';

//  Mock data (to be replaced with API call when backend is ready)
const MOCK_PRS = [
  {
    id: '1',
    number: 24,
    title: 'feat(auth): add JWT refresh token rotation',
    status: 'open',
    author: 'ravi_dev',
    fromBranch: 'feat/jwt-refresh',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    comments: 3,
  },
  {
    id: '2',
    number: 23,
    title: 'fix(ui): resolve sidebar overflow on mobile viewports',
    status: 'open',
    author: 'priya_codes',
    fromBranch: 'fix/sidebar-overflow',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    comments: 7,
  },
  {
    id: '3',
    number: 22,
    title: 'feat(ai): integrate PR review assistant with diff context',
    status: 'merged',
    author: 'ankit_ml',
    fromBranch: 'feat/ai-review',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    comments: 12,
  },
  {
    id: '4',
    number: 21,
    title: 'docs: add contributor onboarding guide and setup steps',
    status: 'merged',
    author: 'sneha_oss',
    fromBranch: 'docs/onboarding',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    comments: 2,
  },
  {
    id: '5',
    number: 20,
    title: 'chore(deps): bump axios from 1.4.0 to 1.6.0',
    status: 'closed',
    author: 'bot_updater',
    fromBranch: 'chore/bump-axios',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    comments: 0,
  },
  {
    id: '6',
    number: 19,
    title: 'feat(repo): add repository star and watch functionality',
    status: 'open',
    author: 'karan_web',
    fromBranch: 'feat/repo-star',
    toBranch: 'main',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    comments: 5,
  },
];


export default function PullRequestsPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PRS.filter((pr) => {
    const matchesTab =
      activeTab === 'open' ? pr.status === 'open' : pr.status !== 'open';
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.author.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openCount = MOCK_PRS.filter((p) => p.status === 'open').length;
  const closedCount = MOCK_PRS.filter((p) => p.status !== 'open').length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#06070a] text-zinc-900 dark:text-white transition-colors">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white font-medium">Pull Requests</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <GitPullRequest className="w-8 h-8 text-emerald-400" />
            Pull Requests
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Review, discuss, and merge code changes from contributors.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search pull requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-900 dark:text-white placeholder-zinc-500 outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          {/* Filter icon (placeholder for future filters) */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* PR List Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">

          {/* Tab Bar */}
          <div className="flex items-center border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] px-4">
            <button
              onClick={() => setActiveTab('open')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'open'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              Open
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs">
                {openCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('closed')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'closed'
                  ? 'border-zinc-400 text-zinc-300'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Closed
              <span className="px-2 py-0.5 rounded-full bg-zinc-400/10 text-zinc-400 text-xs">
                {closedCount}
              </span>
            </button>
          </div>

          {/* PR Rows */}
          {filtered.length > 0 ? (
            filtered.map((pr) => <PRCard key={pr.id} pr={pr} />)
          ) : (
            <div className="py-16 text-center text-zinc-500 text-sm">
              <GitPullRequest className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
              No pull requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
