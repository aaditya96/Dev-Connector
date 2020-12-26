import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import Education from './Education';
import Experience from './Experience';

const Dashboard = ({
  auth: { user },
  profile: { loading, profile },
  getCurrentProfile,
  deleteAccount,
}) => {
  useEffect(() => getCurrentProfile(), []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='dash-buttons'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary'></i> Edit Profile
            </Link>
            <Link to='/add-experience' className='btn btn-light'>
              <i className='fab fa-black-tie text-primary'></i> Add Experience
            </Link>
            <Link to='/add-education' className='btn btn-light'>
              <i className='fas fa-graduation-cap text-primary'></i> Add
              Education
            </Link>
          </div>
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not created a profile yet. Please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}

      <div className='my-2'>
        <button className='btn btn-danger' onClick={() => deleteAccount()}>
          <i className='fas fa-user-minus'></i> Delete My Account
        </button>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
