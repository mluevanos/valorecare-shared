import React from "react";
import logger from "sabio-debug";
import * as venuesService from "../../services/venuesService";
import Pagination from "rc-pagination";
import PropTypes from "prop-types";
import "rc-pagination/assets/index.css";
import VenueCard from "./VenueCard";

const _logger = logger.extend("Venues");

class Venue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      mappedVenues: [],
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageIndex: 0,
        pageSize: 6,
      },
    };
  }

  componentDidMount() {
    const pageIndex = this.state.pagination.pageIndex;
    const pageSize = this.state.pagination.pageSize;

    venuesService
      .getAllPaginatedV2(pageIndex, pageSize)
      .then(this.onGetPaginationSuccess)
      .catch(this.onPaginationError);
  }

  //--------Venue Pagination --------------
  onGetPaginationSuccess = (response) => {
    const venues = response.data.item.pagedItems;
    _logger("venue:", venues, response.data.item);

    const pagination = {
      totalCount: response.data.item.totalCount,
      currentPage: response.data.item.pageIndex + 1,
      pageSize: response.data.item.pageSize,
      pageIndex: response.data.item.pageIndex,
    };

    this.setState(() => {
      return {
        venues,
        pagination,
        mappedVenues: venues.map(this.mapVenue),
      };
    });
  };

  onPaginationError = (response) => {
    _logger("pagErrorResponse:", response);
  };

  onPaginationChange = (page) => {
    let pageIndex = page - 1;
    let pageSize = this.state.pagination.pageSize;
    let currentPage = page;
    this.setState((prevState) => {
      return {
        ...prevState,
        pagination: {
          ...prevState.pagination,
          currentPage,
          pageSize,
          pageIndex,
        },
      };
    });

    venuesService
      .getAllPaginatedV2(pageIndex, pageSize)
      .then(this.onGetPaginationSuccess)
      .catch(this.onPaginationError);
  };

  //------Add Venue---------

  onAddFormClick = () => {
    _logger("onAddFormClick:");
    this.props.history.push("/venues/create");
  };

  //------Edit Venue ------------
  handleEditVenue = (venue) => {
    _logger("Edit this dude", venue);
    this.props.history.push(`venues/${venue.id}/edit`, venue);
  };
  //------Remove Venue -----------
  handleRemoveVenue = (id) => {
    venuesService
      .remove(id)
      .then(this.onRemovalSuccess)
      .catch(this.onRemovalError);
  };

  //Cant remove due to dependency with events
  onRemovalSuccess = (id) => {
    _logger("removing friendId success:", id);
    this.setState((prevState) => {
      let venues = [...prevState.venues];
      venues = venues.filter((venue) => venue.id !== id);
      return {
        ...prevState,
        venues,
        mappedVenue: venues.map(this.mapVenue),
      };
    });
  };

  onRemovalError = (response) => {
    _logger("Removal Error:", response);
  };
  //----------Venue Mapper -----------------------

  mapVenue = (venueData) => {
    return (
      <VenueCard
        key={venueData.id}
        venue={venueData}
        handleEdit={this.handleEditVenue}
        handleRemove={this.handleRemoveVenue}
        currentUser={this.props.currentUser}
      ></VenueCard>
    );
  };

  render() {
    return (
      <div className="venues-container">
        <h1 className="venues-header text-center">
          <span>Venues</span>
        </h1>
        <div className="row">
          {this.props.currentUser.roles.includes("SysAdmin", "Provider") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onAddFormClick}
            >
              Create New Venue
            </button>
          )}
        </div>
        <div className="card-group">
          <div className="row">{this.state.mappedVenues}</div>
        </div>

        <div className="row justify-content-center">
          <Pagination
            locale={"en_US"}
            onChange={this.onPaginationChange}
            current={this.state.pagination.currentPage}
            total={this.state.pagination.totalCount}
            pageSize={this.state.pagination.pageSize}
          />
        </div>
      </div>
    );
  }
}

Venue.propTypes = {
  history: PropTypes.shape({
    history: PropTypes.func,
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.string,
    }).isRequired,
    path: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    userName: PropTypes.string,
  }),
};

export default Venue;
