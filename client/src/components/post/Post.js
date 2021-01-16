import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import { Link } from 'react-router-dom';
import CommentItem from './CommentItem';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => getPost(match.params.id), [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link className='btn' to='/posts'>
        Go to Posts
      </Link>
      <PostItem showActions={false} post={post}></PostItem>
      <CommentForm postId={post._id}></CommentForm>
      <div className='comments'>
        {post.comments !== null &&
          post.comments.length > 0 &&
          post.comments.map((comment) => (
            <CommentItem
              key={comment._id}
              postId={post._id}
              comment={comment}
            ></CommentItem>
          ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
