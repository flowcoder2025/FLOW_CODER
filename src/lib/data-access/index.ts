/**
 * Data Access Layer - Index
 * 모든 데이터 접근 함수 중앙 export
 */

// Posts
export {
  getPostsByCategory,
  getPostById,
  getPostsByType,
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
