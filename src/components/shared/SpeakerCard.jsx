import React from 'react';
import './SpeakerCard.css';

const SpeakerCard = ({
    name,
    specialization,
    subText,
    badgeText,
    image,
    className = '',
    bio,
}) => {
    const defaultProfileImage = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

    return (
        <div className={`shared-speaker-card ${className}`}>
            <div className="shared-speaker-img-wrapper">
                <img
                    src={image || defaultProfileImage}
                    alt={name}
                    className="shared-speaker-img"
                    onError={(e) => { e.target.src = defaultProfileImage; }}
                />
                {specialization && <span className="shared-speaker-role-badge">{specialization}</span>}
            </div>

            <div className="shared-speaker-content">
                <h3 className="shared-speaker-name">{name || 'Unknown Speaker'}</h3>
                {subText && <p className="shared-speaker-subtext">{subText}</p>}
                {badgeText && <span className="shared-speaker-segment-badge">{badgeText}</span>}
      
            </div>
        </div>
    );
};

export default SpeakerCard;
