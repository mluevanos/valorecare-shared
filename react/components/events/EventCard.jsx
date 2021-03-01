/* eslint-disable react/boolean-prop-naming */
import React, { PureComponent } from "react";
import PreviewMap from "../eventwizard/eventpreview/PreviewMap";
import PropTypes from "prop-types";
import "./EventCard.css";
import { buildDateLength, buildAddress } from "../../services/utilityService";
import defaultImage from "../../assets/images/brand/Valorecare_logo.png";

export default class EventCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
  }

  flipCard = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  onRegisterClicked = () => {
    this.props.onRegisterClicked(this.props.values);
  };

  onEditClicked = () => {
    this.props.onEditClicked(this.props.values);
  };

  onDeleteClicked = () => {
    this.props.onDeleteClicked(this.props.values);
  };

  imageField = (imageSrc) => {
    const handleError = (e) => {
      if (e.target.src !== imageSrc) {
        e.target.src = defaultImage;
      }
    };

    return (
      <img
        className="card-img-top"
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={imageSrc}
        alt={this.props.values.name}
        onError={handleError}
      />
    );
  };

  render() {
    const date = buildDateLength(
      this.props.values.dateStart,
      this.props.values.dateEnd
    );

    const address = buildAddress(this.props.values.venueV2.location);

    return (
      <div className="card-container col-md-4 p-3">
        <div className={this.state.flipped ? "card-flip flipped" : "card-flip"}>
          <div className="front h-100">
            <div className="card h-100">
              {this.imageField(this.props.values.imageUrl)}
              <div className="card-body mx-3 mt-0 mb-5">
                <div className="card-title text-center">
                  {this.props.values.name}
                </div>
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
                    {this.props.values.isFree
                      ? "Free"
                      : `$${
                          this.props.values.price ? this.props.values.price : 0
                        }`}
                  </p>
                </div>
                <div className="row">Link:</div>
                <div className="row">
                  {this.props.values.externalSiteUrl ? (
                    <a
                      className="ml-auto text-primary"
                      href={this.props.values.externalSiteUrl.toString()}
                    >
                      Event Website
                    </a>
                  ) : (
                    <p className="ml-auto">None</p>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="row d-flex justify-content-center align-items-end">
                  <button
                    className="col-4 btn btn-primary m-1"
                    onClick={this.flipCard}
                    type="button"
                  >
                    View More
                  </button>
                  <button
                    className={
                      this.props.values.participantUserId !== null
                        ? "col-4 btn btn-danger m-1"
                        : "col-4 btn btn-success m-1"
                    }
                    disabled={
                      this.props.values.participantUserId !== null &&
                      this.props.values.price > 0
                    }
                    onClick={() => {
                      this.props.values.participantUserId !== null
                        ? this.props.onCancelRegistrationClicked(
                            this.props.values
                          )
                        : this.onRegisterClicked(this.props.values);
                    }}
                  >
                    {this.props.values.participantUserId !== null
                      ? "Cancel Signup"
                      : "Register"}
                  </button>
                </div>
                {this.props.currentUser.roles.includes("SysAdmin") && (
                  <div className="row justify-content-center">
                    <button
                      className="col-4 btn btn-primary m-1"
                      onClick={this.onEditClicked}
                    >
                      Edit
                    </button>
                    <button
                      className="col-4 btn btn-danger m-1"
                      onClick={this.onDeleteClicked}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="back h-100">
            <div className="card h-100">
              <div className="preview-map">
                <PreviewMap
                  location={{
                    latitude: this.props.values.venueV2.location.latitude,
                    longitude: this.props.values.venueV2.location.longitude,
                  }}
                />
              </div>
              <div className="card-body">
                <div className="card-title text-center">
                  {this.props.values.summary}
                </div>
                <small>{this.props.values.shortDescription}</small>
              </div>
              <div className="card-footer">
                <div className="row justify-content-center">
                  <button
                    className="btn btn-primary m-1"
                    onClick={this.flipCard}
                    type="button"
                  >
                    Go Back
                  </button>
                  <button
                    className={
                      this.props.values.participantUserId !== null
                        ? "btn btn-danger m-1"
                        : "btn btn-success m-1"
                    }
                    onClick={() => {
                      this.props.values.participantUserId !== null &&
                      this.props.values.price === 0
                        ? this.props.onCancelRegistrationClicked(
                            this.props.values
                          )
                        : this.onRegisterClicked(this.props.values);
                    }}
                  >
                    {this.props.values.participantUserId !== null
                      ? "Cancel Signup"
                      : "Register"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventCard.propTypes = {
  values: PropTypes.shape({
    name: PropTypes.string,
    summary: PropTypes.string,
    shortDescription: PropTypes.string,
    externalSiteUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    price: PropTypes.number,
    participantUserId: PropTypes.number,
    capacity: PropTypes.number,
    isFree: PropTypes.bool,
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    venueV2: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        state: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    }),
  }),
  onRegisterClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func,
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  onCancelRegistrationClicked: PropTypes.func,
};
