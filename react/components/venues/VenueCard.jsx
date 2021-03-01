import React from "react";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("VenueCard");

const VenueCard = (props) => {
  _logger("VenueCard props:", props);

  const handleEdit = () => {
    props.handleEdit(props.venue);
  };

  return (
    <div
      id={props.venue.id}
      className="col-md-4 col-sm-6"
      style={{ paddingTop: 10 }}
    >
      <div className="card" style={{ width: 270, height: 370 }}>
        <div className="card-header" style={{ height: 40 }}>
          <p className="text-muted">
            By: {props.venue.createdBy.firstName}{" "}
            {props.venue.createdBy.lastName}
          </p>
        </div>
        <div className="card-body" style={{ overflow: "hidden" }}>
          <a className="venueName h4" href={props.venue.url}>
            {props.venue.name}
          </a>

          <p className="venueDescription">{props.venue.description}</p>
        </div>
        <div className="card-btn d-flex justify-content-between">
          {props.currentUser.id === props.venue.createdBy.id && (
            <button
              type="button"
              className="btn btn-primary"
              value={props.venue.id}
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
        <div className="card-footer" style={{ height: 40 }}>
          <div className="row">
            <p className="venueLocationId">
              {props.venue.location.lineOne} {props.venue.location.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

VenueCard.propTypes = {
  venue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    createdBy: PropTypes.object,
    location: PropTypes.object,
    description: PropTypes.string,
    locationId: PropTypes.number,
    url: PropTypes.string,
  }),
  handleEditVenue: PropTypes.func,
  handleEdit: PropTypes.func,
  handleRemove: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    userName: PropTypes.string,
  }),
};

export default VenueCard;
