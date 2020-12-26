import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
  experience: { from, to, current, company, title, location, description },
}) => (
  <div>
    <h3 class='text-dark'>{company}</h3>
    <p>
      <Moment format='DD/MM/YYYY'>{from}</Moment> -{' '}
      {current ? ' Now' : <Moment format='DD/MM/YYYY'>{to}</Moment>}
    </p>
    <p>
      <strong>Title: </strong>
      {title}
    </p>
    <p>
      <strong>Location: </strong>
      {location}
    </p>
    <p>
      <strong>Description: </strong>
      {description}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
