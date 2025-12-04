/**
 * Data Access Layer - Index
 * 모든 데이터 접근 함수 중앙 export
 */

// Posts
export {
  getPostsByCategory,
  getPostById,
  getNewsPosts,
  getQuestionPosts,
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

// Answers
export {
  getAnswersByQuestionId,
  getAnswersByUser,
  getAnswerById,
} from './answers';

// Home Page (병렬 페칭 + 캐싱)
export {
  getHomePageData,
  type HomePageData,
  type FeaturedPost,
  type NewsItem,
  type Project,
} from './home';
