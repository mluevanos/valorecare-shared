import React from "react";
import PropTypes from "prop-types";
import { buildDateLength, buildAddress } from "../../services/utilityService";

export default function EventRegisterDescription({ values }) {
  const date =
    values.dateStart && values.dateEnd
      ? buildDateLength(values.dateStart, values.dateEnd)
      : "";

  const address = values.venueV2 ? buildAddress(values.venueV2.location) : "";

  return (
    <div className="p-3">
      <div className="row">
        <p className="font-weight-bold">Please confirm your registration.</p>
      </div>
      <div className="row"></div>
      <div className="row">Day: </div>
      <div className="row mb-3">
        <p className="ml-auto">{date.day}</p>
      </div>
      <div className="row">Time:</div>
      <div className="row mb-3">
        <p className="ml-auto">{date.time}</p>
      </div>
      <div className="row">Location:</div>
      <div className="row">
        <p className="ml-auto">{address}</p>
      </div>
      <div className="row">Price:</div>
      <div className="row">
        <p className="ml-auto">
          {values.isFree ? "Free" : `$${values.price ? values.price : 0}`}
        </p>
      </div>
    </div>
  );
}

EventRegisterDescription.propTypes = {
  values: PropTypes.shape({
    name: PropTypes.string,
    summary: PropTypes.string,
    shortDescription: PropTypes.string,
    externalSiteUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    capacity: PropTypes.number,
    isFree: PropTypes.bool,
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    venueV2: PropTypes.shape({
      location: PropTypes.object,
    }),
  }).isRequired,
};
