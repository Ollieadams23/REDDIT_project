# Reddify

Reddify - A modern, responsive Reddit client built with React and Redux, featuring real-time post browsing, search functionality, and an elegant user interface.

![Reddify](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![Redux](https://img.shields.io/badge/Redux-5.0.1-764ABC?style=flat&logo=redux)
![Tests](https://img.shields.io/badge/Tests-112%20Passed-success)

## 📋 Table of Contents

- [Wireframes](#wireframes)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Concepts Used](#concepts-used)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Future Work](#future-work)

## 🎨 Wireframes

### Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│  Reddify              🔍 Search...           ☰ Subreddits   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────┐  ┌──────────────┐ │
│  │  ▲  Post Title                      │  │              │ │
│  │ 1.2k                                 │  │  Subreddits  │ │
│  │  ▼  r/subreddit • u/author          │  │              │ │
│  │     💬 45 comments                   │  │  • reactjs   │ │
│  └─────────────────────────────────────┘  │  • javascript│ │
│                                             │  • pics      │ │
│  ┌─────────────────────────────────────┐  │  • askreddit │ │
│  │  ▲  Another Post Title              │  │  • funny     │ │
│  │ 856                                  │  │              │ │
│  │  ▼  r/subreddit • u/author          │  └──────────────┘ │
│  │     💬 23 comments                   │                    │
│  └─────────────────────────────────────┘                    │
│                                                               │
│                 [Load More Posts]                            │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────┐
│  ☰  Reddify  🔍     │
├──────────────────────┤
│                      │
│  ┌────────────────┐ │
│  │  ▲             │ │
│  │ 1.2k Post Title│ │
│  │  ▼             │ │
│  │  💬 45         │ │
│  └────────────────┘ │
│                      │
│  ┌────────────────┐ │
│  │  ▲             │ │
│  │ 856 Post Title │ │
│  │  ▼             │ │
│  │  💬 23         │ │
│  └────────────────┘ │
│                      │
│   [Load More]        │
└──────────────────────┘
```

### Post Detail View
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to feed                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ▲                                                            │
│ 1.2k  Post Title                                             │
│  ▼                                                            │
│                                                               │
│       r/subreddit • Posted by u/author • 2 hours ago        │
│                                                               │
│       Post body text goes here...                            │
│                                                               │
│       [Image/Video if present]                               │
│                                                               │
│       💬 45 Comments  Share  Save  Report                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  u/commenter • 1 hour ago                              │ │
│  │  Comment text goes here...                             │ │
│  │  ↑ 23  ↓  Reply                                        │ │
│  │                                                         │ │
│  │    ┌──────────────────────────────────────────────┐   │ │
│  │    │  u/replier • 30 min ago                      │   │ │
│  │    │  Nested reply text...                        │   │ │
│  │    │  ↑ 5  ↓  Reply                               │   │ │
│  │    └──────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Technologies Used

### Core Technologies
- **React** (18.3.1) - UI library for building component-based interfaces
- **Redux Toolkit** (2.5.0) - State management with modern Redux patterns
- **React Redux** (9.2.0) - Official React bindings for Redux

### Development Tools
- **Create React App** - Project scaffolding and build configuration
- **Jest** - Testing framework for unit and integration tests
- **React Testing Library** - Testing utilities for React components
- **ESLint** - Code linting and quality checks

### API Integration
- **Reddit JSON API** - Public Reddit API for fetching posts and comments
- **CORS Proxy** - Proxy service to handle CORS restrictions

### Styling
- **CSS3** - Custom styling with modern CSS features
- **CSS Grid & Flexbox** - Responsive layout systems
- **CSS Animations** - Smooth transitions and micro-interactions

## ✨ Features

### Core Functionality
- ✅ **Browse Reddit Posts** - View posts from default and custom subreddits
- ✅ **Search Posts** - Search across all of Reddit with customizable filters
- ✅ **Post Details** - View full post content with images, videos, and external links
- ✅ **Comment Threads** - Browse nested comment threads with visual hierarchy
- ✅ **Subreddit Filtering** - Quick access to popular subreddits

### Search Features
- 🔍 **Real-time Search** - Search posts as you type
- 📊 **Sort Options** - Sort by relevance, hot, top, new, or comments
- ⏰ **Time Filters** - Filter by hour, day, week, month, year, or all time
- 🎯 **Subreddit Scope** - Search within specific subreddits or all of Reddit

### Media Support
- 🎬 **Video Support** - Embedded playback for Reddit videos
- 🖼️ **Image Display** - Full-resolution image viewing
- 🔗 **External Links** - Support for YouTube and external content
- 📱 **Responsive Media** - Optimized media display for all screen sizes

### Pagination
- 📄 **Infinite Scroll Ready** - Load more posts with a single click
- 🔄 **Search Pagination** - Paginate through search results
- ⚡ **Optimized Loading** - Efficient data fetching with loading states

### User Experience
- 📱 **Fully Responsive** - Seamless experience on mobile, tablet, and desktop
- 🎨 **Modern UI** - Clean, Reddit-inspired design with smooth animations
- ⌨️ **Keyboard Accessible** - Full keyboard navigation support
- 🎯 **Loading States** - Skeleton screens and loading indicators
- 🔝 **Scroll to Top** - Quick navigation back to the top of the page
- 🍔 **Mobile Menu** - Collapsible hamburger menu for mobile devices

### Performance Optimizations
- ⚡ **React.memo** - Memoized components to prevent unnecessary re-renders
- 🔀 **Code Splitting** - Lazy loading for PostDetail component
- 🎣 **useCallback Hooks** - Memoized callbacks for optimal performance
- 🐌 **Throttled Events** - Throttled scroll events for smooth scrolling
- 💾 **Redux Normalization** - Efficient state management

## 🧠 Concepts Used

### React Concepts
- **Functional Components** - Modern React with hooks
- **Custom Hooks** - Reusable stateful logic
- **Component Composition** - Building complex UIs from simple components
- **Controlled Components** - Form inputs controlled by React state
- **Conditional Rendering** - Dynamic UI based on state
- **Lists and Keys** - Efficient rendering of dynamic lists
- **Event Handling** - User interaction management
- **Lifting State Up** - Shared state between components

### React Hooks
- `useState` - Local component state management
- `useEffect` - Side effects and lifecycle management
- `useSelector` - Accessing Redux state
- `useDispatch` - Dispatching Redux actions
- `useCallback` - Memoizing callback functions
- `React.memo` - Memoizing components
- `React.lazy` - Dynamic imports for code splitting
- `Suspense` - Handling lazy-loaded components

### Redux Patterns
- **Redux Toolkit** - Modern Redux with less boilerplate
- **createSlice** - Simplified reducer and action creation
- **createAsyncThunk** - Handling async operations
- **Selectors** - Deriving data from state
- **Normalized State** - Flat state structure for efficiency
- **Immutable Updates** - Immer-powered state updates

### State Management
- **Global State** - Application-wide state with Redux
- **Local State** - Component-specific state
- **Derived State** - Computed values from state
- **Loading States** - Managing async operation status
- **Error Handling** - Graceful error state management

### Async Operations
- **Promise Handling** - Modern async/await syntax
- **Error Boundaries** - Catching and handling errors
- **Loading States** - User feedback during data fetching
- **Retry Logic** - Handling failed requests
- **Debouncing/Throttling** - Performance optimization for events

### Performance Optimization
- **Memoization** - Caching computed values and components
- **Code Splitting** - Loading code on demand
- **Lazy Loading** - Deferring component initialization
- **Event Throttling** - Limiting event handler frequency
- **Shallow Comparison** - Efficient re-render prevention

### Testing Strategies
- **Unit Tests** - Testing individual functions and utilities
- **Component Tests** - Testing React components in isolation
- **Integration Tests** - Testing component interactions
- **Async Testing** - Testing async operations with waitFor
- **Mocking** - Mocking API calls and external dependencies
- **Test Coverage** - 112 passing tests across 11 test suites

### CSS Techniques
- **CSS Grid** - Two-dimensional layouts
- **Flexbox** - One-dimensional flexible layouts
- **CSS Variables** - Reusable design tokens
- **Media Queries** - Responsive breakpoints
- **Animations** - Keyframe animations and transitions
- **Pseudo-elements** - Decorative UI elements
- **BEM Naming** - Block Element Modifier methodology

### API Integration
- **REST API** - RESTful Reddit JSON API
- **CORS Handling** - Proxy server for cross-origin requests
- **Query Parameters** - Dynamic API request configuration
- **Response Parsing** - Transforming API data
- **Error Handling** - Managing API failures gracefully

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Ollieadams23/REDDIT_project.git

# Navigate to project directory
cd reddit_api_project

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Browsing Posts
1. View posts from the default subreddit on the homepage
2. Click on any post to view full details and comments
3. Use the "Load More Posts" button to fetch additional posts

### Searching
1. Enter a search term in the search bar
2. Select sort order (relevance, hot, top, new, comments)
3. Choose time filter (all time, year, month, week, day, hour)
4. Optionally specify a subreddit to search within
5. Click "Search" or press Enter

### Subreddit Navigation
1. Click the hamburger menu (mobile) or use the sidebar (desktop)
2. Select from popular subreddits: reactjs, javascript, pics, askreddit, funny
3. Posts from that subreddit will load automatically

### Viewing Post Details
1. Click on any post card to view full details
2. Read the complete post content and view media
3. Browse comment threads with nested replies
4. Click "Back to feed" to return to the main feed

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- PostCard.test.js
```

### Test Coverage
- **11** test suites
- **112** passing tests
- **1** skipped test (placeholder)
- Components: PostCard, PostDetail, SearchBar, Sidebar, Comment, CommentThread, ScrollToTop
- Features: postsSlice (Redux)
- Services: redditAPI
- Utils: performance utilities
- Integration: App component

## 🔮 Future Work

### Features
- [ ] **User Authentication** - Login with Reddit account for personalized experience
- [ ] **Voting System** - Upvote/downvote posts and comments (requires auth)
- [ ] **Save Posts** - Bookmark posts for later viewing
- [ ] **Share Functionality** - Share posts via native share API
- [ ] **Dark Mode** - Toggle between light and dark themes
- [ ] **Infinite Scroll** - Automatic loading as user scrolls
- [ ] **Advanced Filters** - Filter by post type (image, video, text)
- [ ] **Comment Sorting** - Sort comments by top, new, controversial
- [ ] **Post Creation** - Submit new posts (requires auth)
- [ ] **User Profiles** - View user post history and karma

### Technical Improvements
- [ ] **Service Worker** - Offline support with PWA
- [ ] **Image Optimization** - Lazy loading and responsive images
- [ ] **Caching Strategy** - Redux persist for offline viewing
- [ ] **Virtual Scrolling** - Optimize long lists with react-window
- [ ] **End-to-End Tests** - Cypress or Playwright integration
- [ ] **Accessibility Audit** - WCAG 2.1 AA compliance
- [ ] **Performance Monitoring** - Analytics and error tracking
- [ ] **TypeScript Migration** - Type safety across the codebase
- [ ] **Storybook Integration** - Component documentation and testing
- [ ] **GraphQL Layer** - Alternative to REST API for better performance

### UI/UX Enhancements
- [ ] **Customizable Layout** - Compact, card, or classic view modes
- [ ] **Keyboard Shortcuts** - Power user navigation
- [ ] **Gestures** - Swipe actions on mobile
- [ ] **Custom Themes** - User-selectable color schemes
- [ ] **Animations** - More polished micro-interactions
- [ ] **Skeleton Improvements** - More accurate loading states
- [ ] **Toast Notifications** - User feedback for actions
- [ ] **Modal Dialogs** - Image lightbox and confirmation dialogs
- [ ] **Drag and Drop** - Reorder subreddit list
- [ ] **Context Menus** - Right-click actions on posts

### Performance
- [ ] **Image CDN** - Serve images through CDN
- [ ] **Bundle Optimization** - Further reduce bundle size
- [ ] **Preloading** - Prefetch data for anticipated navigation
- [ ] **Web Workers** - Offload heavy processing
- [ ] **Database Layer** - Local IndexedDB for caching

### Developer Experience
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Docker Support** - Containerized development environment
- [ ] **Documentation** - JSDoc comments throughout codebase
- [ ] **Contribution Guide** - Guidelines for contributors
- [ ] **Code Generation** - Scripts for creating new components

## 📜 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Oliver Adams**
- GitHub: [@Ollieadams23](https://github.com/Ollieadams23)

## 🙏 Acknowledgments

- Reddit API for providing free access to content
- CORS Proxy service for handling cross-origin requests
- Create React App for project scaffolding
- React and Redux communities for excellent documentation

## 📚 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Redux Toolkit documentation](https://redux-toolkit.js.org/)
- [Reddit API documentation](https://www.reddit.com/dev/api/)

---

**Built with ❤️ using React and Redux**
