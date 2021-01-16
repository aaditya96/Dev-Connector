import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_COMMENT,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload, loading: false, error: null };
    case GET_POST:
      return { ...state, post: payload, loading: false };
    case ADD_POST:
      return { ...state, loading: false, posts: [payload, ...state.posts] };
    case POST_ERROR:
      return { ...state, error: payload, loading: false };
    case UPDATE_LIKES:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
      };
    case DELETE_POST:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post._id !== payload),
      };
    case ADD_COMMENT:
      return { ...state, post: { ...state.post, comments: payload } };
    case DELETE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
      };
    default:
      return state;
  }
}
