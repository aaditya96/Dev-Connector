import {
  PROFILE_ERROR,
  GET_PROFILE,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  REPOS_ERROR,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case PROFILE_ERROR:
      return { ...state, loading: false, error: payload, profile: null };

    case REPOS_ERROR:
      return { ...state, loading: false, error: payload, repos: [] };

    case GET_PROFILES:
      return { ...state, profiles: payload, loading: false };

    case GET_REPOS:
      return { ...state, repos: payload, loading: false };

    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false, error: {} };

    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], loading: false };
    default:
      return state;
  }
}
