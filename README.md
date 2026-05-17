<div align="center">

<img src="https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge" alt="version"/>
<img src="https://img.shields.io/badge/PRs-welcome-teal?style=for-the-badge" alt="PRs Welcome"/>
<img src="https://img.shields.io/github/repo-size/Ankita15k/GitNest?style=for-the-badge" alt="Repo_Size"/>
<img src="https://img.shields.io/badge/license-MIT-red?style=for-the-badge" alt="MIT License"/>
<img src="https://img.shields.io/badge/stack-MERN-pink?style=for-the-badge" alt="MERN Stack"/>


![Visitors](https://api.visitorbadge.io/api/visitors?path=Ankita15k%2FGitNest%20&countColor=%23263759&style=flat)

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![GitHub forks](https://img.shields.io/github/forks/Ankita15k/GitNest)
![GitHub Repo stars](https://img.shields.io/github/stars/Ankita15k/GitNest)
![GitHub contributors](https://img.shields.io/github/contributors/Ankita15k/GitNest)
![GitHub last commit](https://img.shields.io/github/last-commit/Ankita15k/GitNest)
[![Join Discord](https://img.shields.io/discord/1505228467086823504?color=5865F2&label=Join%20Discord&logo=discord&logoColor=white)](https://discord.gg/QHSNsRuA)

## <img width="120" height="110" alt="Logo" src="https://github.com/user-attachments/assets/b4cf9a44-aa69-4256-bae9-7f67b5246278" />

# GitNest - Lightweight Collaborative Code Hosting Platform

**A full-featured GitHub-inspired platform built with the MERN stack.**  
Create repositories, browse code, manage issues, review pull requests, and collaborate — all in one open-source app.

[🚀 Live Demo](#) · [📖 Docs](#) · [🐛 Report Bug](../../issues/new?template=bug_report.md) · [✨ Request Feature](../../issues/new?template=feature_request.md)

</div>

---

## 📸 Screenshots

> _Screenshots / GIF demo will be added soon. Contributors are welcome to help build the UI!_

---

## ✨ Features

- 🔐 **Authentication** — Register, login, JWT sessions, GitHub OAuth
- 📁 **Repository Management** — Create, delete, fork, and star repos
- 🌲 **File Browser** — Navigate repo tree, view files with syntax highlighting (Monaco Editor)
- 📝 **Issues & Pull Requests** — Full issue tracker with labels, milestones, and comments
- 👥 **User Profiles** — Follow users, view activity feed, manage settings
- 🔍 **Search** — Search repos, users, and code
- 🔔 **Real-time Notifications** — Live updates via Socket.io
- 🌙 **Dark Mode** — Full dark/light theme support

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Zustand, React Query |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Cache** | Redis |
| **Real-time** | Socket.io |
| **Auth** | JWT, bcrypt |
| **Storage** | Cloudinary, Supabase |
| **DevOps** | GitHub Actions |

---

## 📁 Project Structure

```
gitnest/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── store/          # Zustand global state
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # Axios API layer
│   │   └── utils/          # Helper functions
├── backend/                # Express.js backend
│   ├── config/             # DB, Redis connections
│   ├── controllers/        # Route controllers
│   ├── middleware/          # Auth, error handling, rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── services/           # Business logic, Socket.io
│   ├── utils/              # Logger, response helpers
│   └── .env.example        # Environment variable template
└── .github/               # Issue templates, workflows, PR template
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v20+
- [VS Code](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/)

### Installation

⭐ Star The Repo

**1. Fork and clone the repository**

```bash
# Fork this repo first using the Fork button above, then:
git clone https://github.com/<your-username>/gitnest.git
cd gitnest
```

**2. Set up environment variables**

```bash
# Backend env variables
cp backend/.env.example backend/.env
# Open backend/.env and fill in your values

# Frontend env variables
cp frontend/.env.example frontend/.env
# Open frontend/.env and fill in your values
```

**3. Install dependencies and run**

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (in a new terminal)
cd frontend && npm install && npm run dev
```

**4. Open the app**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- Health check: http://localhost:5000/health

### Docker Setup (Recommended)

You can easily run the entire application (Frontend, Backend, MongoDB, Redis) using Docker.

1. Ensure Docker Desktop is running.
2. Run the following command in the root of the project:
   ```bash
   docker-compose up --build
   ```
3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1

---

Proposed Frontend Structure to buid components
```
frontend/
├── src/
│   ├── app/
│   │   ├── router/
│   │   │   ├── AppRouter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── GuestRoute.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── RootLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── RepositoryLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   └── SettingsLayout.jsx
│   │   │
│   │   └── providers/
│   │       ├── ThemeProvider.jsx
│   │       ├── QueryProvider.jsx
│   │       ├── AuthProvider.jsx
│   │       └── SocketProvider.jsx
│   │
│   ├── pages/
│   │   ├── home/
│   │   │   ├── HomePage.jsx
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── ExploreRepositories.jsx
│   │   │   │   ├── OpenSourceBanner.jsx
│   │   │   │   ├── CollaborationSection.jsx
│   │   │   │   ├── GitnestWorkflow.jsx
│   │   │   │   ├── TestimonialsSection.jsx
│   │   │   │   ├── CTASection.jsx
│   │   │   │   └── FooterSection.jsx
│   │   │   │
│   │   │   └── components/
│   │   │       ├── RepoPreviewCard.jsx
│   │   │       ├── FeatureCard.jsx
│   │   │       ├── WorkflowCard.jsx
│   │   │       └── StatCard.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   └── VerifyEmailPage.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FeedPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── StarsPage.jsx
│   │   │   └── FollowingPage.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── FollowersPage.jsx
│   │   │   ├── FollowingPage.jsx
│   │   │   ├── UserRepositoriesPage.jsx
│   │   │   └── UserActivityPage.jsx
│   │   │
│   │   ├── repositories/
│   │   │   ├── ExploreRepositoriesPage.jsx
│   │   │   ├── CreateRepositoryPage.jsx
│   │   │   ├── RepositoryPage.jsx
│   │   │   ├── RepositorySettingsPage.jsx
│   │   │   ├── RepositoryInsightsPage.jsx
│   │   │   ├── ForksPage.jsx
│   │   │   └── StarsPage.jsx
│   │   │
│   │   ├── code/
│   │   │   ├── FileExplorerPage.jsx
│   │   │   ├── BlobViewPage.jsx
│   │   │   ├── CommitHistoryPage.jsx
│   │   │   ├── BranchesPage.jsx
│   │   │   ├── ReleasesPage.jsx
│   │   │   └── CompareChangesPage.jsx
│   │   │
│   │   ├── issues/
│   │   │   ├── IssuesPage.jsx
│   │   │   ├── IssueDetailsPage.jsx
│   │   │   ├── CreateIssuePage.jsx
│   │   │   ├── LabelsPage.jsx
│   │   │   └── MilestonesPage.jsx
│   │   │
│   │   ├── pull-requests/
│   │   │   ├── PullRequestsPage.jsx
│   │   │   ├── PullRequestDetailsPage.jsx
│   │   │   ├── CreatePullRequestPage.jsx
│   │   │   ├── ReviewChangesPage.jsx
│   │   │   └── MergePreviewPage.jsx
│   │   │
│   │   ├── organizations/
│   │   │   ├── OrganizationsPage.jsx
│   │   │   ├── OrganizationProfilePage.jsx
│   │   │   ├── OrganizationMembersPage.jsx
│   │   │   └── OrganizationRepositoriesPage.jsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchPage.jsx
│   │   │   ├── SearchRepositories.jsx
│   │   │   ├── SearchUsers.jsx
│   │   │   └── SearchIssues.jsx
│   │   │
│   │   ├── settings/
│   │   │   ├── AccountSettingsPage.jsx
│   │   │   ├── AppearanceSettingsPage.jsx
│   │   │   ├── SecuritySettingsPage.jsx
│   │   │   ├── NotificationsSettingsPage.jsx
│   │   │   └── SSHKeysPage.jsx
│   │   │
│   │   └── errors/
│   │       ├── NotFoundPage.jsx
│   │       ├── UnauthorizedPage.jsx
│   │       └── ServerErrorPage.jsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── MarkdownRenderer.jsx
│   │   │
│   │   ├── navbar/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── UserMenu.jsx
│   │   │   └── NotificationDropdown.jsx
│   │   │
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── RepositorySidebar.jsx
│   │   │   └── SettingsSidebar.jsx
│   │   │
│   │   ├── repository/
│   │   │   ├── RepositoryHeader.jsx
│   │   │   ├── RepositoryTabs.jsx
│   │   │   ├── RepositoryStats.jsx
│   │   │   ├── RepositoryCard.jsx
│   │   │   ├── FileTree.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── CommitCard.jsx
│   │   │   └── BranchSelector.jsx
│   │   │
│   │   ├── issues/
│   │   │   ├── IssueCard.jsx
│   │   │   ├── IssueFilters.jsx
│   │   │   ├── CommentBox.jsx
│   │   │   └── LabelBadge.jsx
│   │   │
│   │   ├── pull-requests/
│   │   │   ├── PullRequestCard.jsx
│   │   │   ├── ReviewComment.jsx
│   │   │   ├── ChangedFiles.jsx
│   │   │   └── MergeBox.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── ContributionGraph.jsx
│   │   │   ├── ActivityTimeline.jsx
│   │   │   └── PinnedRepositories.jsx
│   │   │
│   │   └── skeletons/
│   │       ├── RepositorySkeleton.jsx
│   │       ├── ProfileSkeleton.jsx
│   │       └── IssueSkeleton.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useDebounce.js
│   │   ├── useRepositories.js
│   │   ├── useIssues.js
│   │   ├── usePullRequests.js
│   │   └── useSocket.js
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── auth.api.js
│   │   │   ├── repository.api.js
│   │   │   ├── issue.api.js
│   │   │   ├── pullRequest.api.js
│   │   │   ├── profile.api.js
│   │   │   └── notification.api.js
│   │   │
│   │   └── socket/
│   │       └── socket.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── repositoryStore.js
│   │   ├── issueStore.js
│   │   ├── pullRequestStore.js
│   │   └── uiStore.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── formatNumber.js
│   │   ├── generateSlug.js
│   │   ├── parseMarkdown.js
│   │   ├── constants.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── markdown.css
│   │   └── animations.css
│   │
│   ├── data/
│   │   ├── mockRepositories.js
│   │   ├── mockUsers.js
│   │   └── mockIssues.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── routes.js
│   │   └── navigation.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css


```

---
## 🤝 Contributing

We love contributions! GitNest is a **GSSoC 2026** project and welcomes developers of all experience levels.

**Before you start:**
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) carefully
2. Check [open issues](../../issues) — look for `good first issue` if you're new
3. Comment on the issue you want to work on and wait for it to be assigned to you
4. Don't submit PRs for unassigned issues — they may be closed

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full details on the workflow, coding standards, and commit message format.

---

## 🗺️ Roadmap

- [ ] Project scaffolding & Express server setup
- [ ] MongoDB schemas & Mongoose models
- [ ] Auth service (JWT + GitHub OAuth)
- [ ] Repository CRUD & file browser
- [ ] Issues & Pull Requests
- [ ] User profiles & social features
- [ ] Search
- [ ] Real-time notifications
- [ ] Tests (unit + integration)
- [x] Docker setup (docker-compose for full stack)
- [ ] Deployment & CI/CD

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

⭐ **Star this repo** if you find it helpful — it helps the project get more visibility!

Made with ❤️ for Open Source Community

</div>
