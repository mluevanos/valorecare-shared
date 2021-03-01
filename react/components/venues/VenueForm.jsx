import React from "react";
import * as venuesService from "../../services/venuesService";
import swal from "sweetalert";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getAll } from "../../services/locationService";
import { SelectFormikV2 } from "../utilities/select-formik/SelectFormikV2";

import venueValidationSchema from "./VenueValidationSchema";

const _logger = logger.extend("Venues");

class VenueForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venueForm: {
        id:
          props.location.state !== undefined
            ? props.location.state.id
            : undefined,
        name:
          props.location.state !== undefined
            ? props.location.state.name
            : undefined,
        description:
          props.location.state !== undefined
            ? props.location.state.description
            : undefined,
        url:
          props.location.state !== undefined
            ? props.location.state.url
            : undefined,
        locationId:
          props.location.state !== undefined
            ? props.location.state.locationId
            : undefined,
        createdBy:
          props.location.state !== undefined
            ? props.location.state.createdBy
            : props.currentUser.id,
      },
      locations: [],
      locationOptions: [],
    };
  }

  componentDidMount() {
    const venueId = this.props.match.params;

    if (venueId) {
      const { state } = this.props.location;
      if (state) {
        this.setForm(state);
      } else {
        venuesService
          .getById(venueId)
          .then(this.onGetByIdSuccess)
          .catch(this.onGetByIdError);
      }
    }

    getAll(0, 100)
      .then(this.onLocationSuccess)
      .then(this.setLocation)
      .catch(this.onLocationError);

    _logger("componentDidMount userId:", venueId);
  }

  setLocation = (locations) => {
    const locationOptions = locations.map(this.mapNames);
    this.setState((prevState) => ({ ...prevState, locationOptions }));
  };

  mapNames = (location) => {
    const locationOptions = {
      value: parseInt(location.id),
      label: `${location.lineOne} ${location.city}`,
    };
    return locationOptions;
  };

  onLocationSuccess = (response) => {
    _logger(response);
    let locations = response.item.pagedItems;
    return locations;
  };

  onLocationError = (response) => {
    _logger("Get Id Error", response);
  };
  setForm = (formData) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        venueForm: {
          ...formData,
        },
      };
    });
  };

  onGetByIdSuccess = (response) => {
    _logger("Get By ID:", response);
    return response.item;
  };

  onGetByIdError = (response) => {
    _logger("Cant Find Venue", response);
  };

  onEditSuccess = (response) => {
    const venue = response;
    _logger("Edit success response:", venue);

    // resetForm(this.state.venueForm);
    swal({
      title: "Thank you!",
      text: "You have added a venue sucessfully!",
      icon: "success",
      button: "ok",
    });

    this.props.history.push("/venues");
  };

  onEditError = (response) => {
    _logger("Edit Error response:", response);
  };

  handleSubmit = (values) => {
    _logger("handleSubmit values:", values);

    this.state.venueForm.id
      ? this.handleUpdateClick(values)
      : this.handleAddClick(values);
  };

  handleUpdateClick = (values) => {
    venuesService
      .update(values)
      .then(this.onEditSuccess)
      .catch(this.onEditError);
  };

  handleAddClick = (values) => {
    _logger("add payload", values);
    venuesService.add(values).then(this.onAddSuccess).catch(this.onAddError);
  };

  onAddSuccess = (response) => {
    const venue = response.item;
    _logger("success response:", venue);

    this.props.history.push("/venues");
  };

  onAddError = (response) => {
    _logger("addVenueError:", JSON.stringify(response, null, 2));
    swal({
      title: "Oops!",
      text: "Try again",
      icon: "error",
      button: "Ok",
    });
  };

  handleCancel = () => {
    this.props.history.push(`/venues`);
  };

  onLocationChange = (e) => {
    e.preventDefault();
    _logger(e.target.value);
    if (e.target.value) {
      let locationId = parseInt(e.target.value);

      this.setState((prevState) => {
        return {
          ...prevState,
          venueForm: {
            ...prevState.venueForm,
            locationId,
          },
        };
      });
    }
  };

  render() {
    const locationOptions = this.state.locationOptions;
    return (
      <React.Fragment>
        <div>
          <h4>Add A Venue</h4>
          <Formik
            enableReinitialize={true}
            initialValues={this.state.venueForm}
            onSubmit={this.handleSubmit}
            validationSchema={venueValidationSchema}
          >
            {(props) => {
              const { values, handleSubmit } = props;

              return (
                <div className="venue-container row">
                  <div className="col-md-6">
                    <div className="card">
                      <Form onSubmit={handleSubmit}>
                        <div className="card-body">
                          <div className="form-row">
                            <div className="form-group col-md-6">
                              <label>Name</label>
                              <Field
                                name="name"
                                type="text"
                                values={values.name}
                                placeholder="Venue Name"
                                className="form-control"
                              ></Field>
                              <ErrorMessage name="name">
                                {(errorMsg) => (
                                  <div className="text-danger">{errorMsg}</div>
                                )}
                              </ErrorMessage>
                            </div>
                            <div className="form-group col-md-6">
                              <label>Url</label>
                              <Field
                                name="url"
                                type="text"
                                values={values.url}
                                placeholder="Venue Url"
                                className="form-control"
                              ></Field>
                              <ErrorMessage name="url">
                                {(errorMsg) => (
                                  <div className="text-danger">{errorMsg}</div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Description</label>
                            <Field
                              name="description"
                              component="textarea"
                              rows="5"
                              values={values.description}
                              placeholder="Venue Description"
                              className="form-control"
                            ></Field>
                            <ErrorMessage name="description">
                              {(errorMsg) => (
                                <div className="text-danger">{errorMsg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                          <label>Location</label>
                          <Field
                            name="locationId"
                            component={SelectFormikV2}
                            placeholder="Select a location"
                            options={locationOptions}
                            isSearchable
                            isClearable
                          />
                        </div>
                        <div className="card-btn d-flex justify-content-between">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={this.handleCancel}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-success">
                            {this.state.venueForm.id ? "Update" : "Add"}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h1 className="venueName h4">{values.name}</h1>
                        <p className="venueDescription">{values.description}</p>
                      </div>
                      <div className="card-footer" style={{ height: 40 }}>
                        <div className="row justify-content-between">
                          <p className="venueLocationId">
                            Location Id: {values.locationId}
                          </p>
                          <a href={values.url} className="venueUrl">
                            {values.url}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Formik>
        </div>
      </React.Fragment>
    );
  }
}

VenueForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      locationId: PropTypes.number,
      createdBy: PropTypes.object,
      url: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    history: PropTypes.func,
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default VenueForm;
