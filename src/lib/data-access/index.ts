/**
 * Data Access Layer - Index
 * 모든 데이터 접근 함수 중앙 export
 */

// Posts
export {
  getPostsByCategory,
  getPostById,
  getRecentPosts,
  getPostsByUser,
} from './posts';

// Categories
export {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  getCategoriesWithPostCount,
} from './categories';

// Users
export {
  getUserByUsername,
  getUserById,
  getTopUsersByReputation,
  searchUsers,
} from './users';

// Comments
export {
  getCommentsByPostId,
  getCommentsByUser,
} from './comments';

// Home Page (병렬 페칭 + 캐싱)
export {
  getHomePageData,
  getBlogHomePageData,
  type HomePageData,
  type BlogHomePageData,
  type FeaturedPost,
  type BlogFeedPost,
  type NewsItem,
  type Project,
} from './home';
