import React from 'react'

import PropTypes from 'prop-types'

import '../styles/feature-card.css'

const FeatureCard = (props) => {
  return (
    <div className="feature-card-feature-card">
      <div className="feature-card-container">
        <h3 className="feature-card-text heading3">{props.Heading}</h3>
      </div>
    </div>
  )
}

FeatureCard.defaultProps = {
  Heading: 'Lorem ipsum',
  SubHeading:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem lorem, malesuada in metus vitae, scelerisque accumsan ipsum.',
}

FeatureCard.propTypes = {
  Heading: PropTypes.string,
  SubHeading: PropTypes.string,
}

export default FeatureCard
