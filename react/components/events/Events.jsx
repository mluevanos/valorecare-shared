import React, { Component } from "react";
import EventCard from "./EventCard";
import * as eventService from "../../services/eventService";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { toastError } from "../../services/utilityService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import SearchBar from "../utilities/SearchBar";
import PropTypes from "prop-types";
import EventRegisterDescription from "./EventRegisterDescription";
import SweetAlert from "react-bootstrap-sweetalert";
import InjectedEventCheckout from "../checkout/InjectedEventCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import logger from "sabio-debug";
const _logger = logger.extend("appointments");
const stripePromise = loadStripe(
  "pk_test_51GsHsuIWWaJ3XO7i8AwMa2TafAMRCOKs4uua2Z6kOws5Zd5UxDRbPAL8IimG5il9nItNfcYflKfNT9R7AU7gIa9d00CvXjzszl"
);

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.stripeCheckout = React.createRef();
    this.state = {
      searchQuery: "",
      events: [],
      mappedEvents: [],
      isOpen: false,
      isCancel: false,
      selectedEvent: {},
      showRegistered: false,
      showCanceled: false,
      stripeState: {
        error: null,
        cardComplete: false,
        processing: false,
        paymentMethod: null,
        email: "",
        phone: "",
        name: "",
      },
      pagination: {
        totalCount: 0,
        currentPage: 1,
        pageIndex: 0,
        pageSize: 9,
      },
    };
  }

  componentDidMount = () => {
    const { pageIndex, pageSize } = this.state.pagination;
    this.getEvents(pageIndex, pageSize);
  };

  //#region Events
  getEvents = (pageIndex, pageSize) => {
    eventService
      .allEvents(pageIndex, pageSize)
      .then(this.onGetEventsSuccess)
      .then(this.renderEvents)
      .catch(this.onGetEventsError);
  };

  onGetEventsSuccess = (response) => response.item;

  onGetEventsError = (error) => _logger({ error });

  renderEvents = (item) => {
    const events = item.pagedItems;
    const mappedEvents = events.map(this.mapEvent);

    const { pageIndex, pageSize, totalCount } = item;
    const pagination = {
      pageIndex,
      pageSize,
      totalCount,
      currentPage: pageIndex + 1,
    };

    this.setState((prevState) => ({
      ...prevState,
      events,
      mappedEvents,
      pagination,
    }));
  };

  mapEvent = (event) => {
    return (
      <EventCard
        key={event.id}
        values={event}
        onRegisterClicked={this.onRegisterClicked}
        onEditClicked={this.editEventClicked}
        onDeleteClicked={this.deleteEventClicked}
        onCancelRegistrationClicked={this.onCancelRegistrationClicked}
        {...this.props}
      />
    );
  };

  resetState = () => {
    const events = [];
    const mappedEvents = [];
    const pagination = {
      totalCount: 0,
      currentPage: 1,
      pageIndex: 0,
      pageSize: 9,
    };
    this.setState((prevState) => ({
      ...prevState,
      events,
      mappedEvents,
      pagination,
    }));
  };

  //#endregion

  //#region Admin
  addEventClicked = () => {
    this.props.history.push("/events/wizard");
  };

  editEventClicked = (event) => {
    this.props.history.push(`/events/wizard/${event.id}`, event);
  };

  deleteEventClicked = (event) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isDelete: true,
        selectedEvent: event,
      };
    });
  };

  onDeleteConfirmed = () => {
    eventService
      .deleteEvent(this.state.selectedEvent.id)
      .then(this.onDeleteSuccess)
      .catch((err) => toastError(err.toString()));
  };

  onDeleteSuccess = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isDelete: false,
        showDelete: true,
      };
    });
  };
  //#endregion

  //#region Registration
  onRegisterClicked = (event) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isOpen: true,
        selectedEvent: event,
      };
    });
  };

  onCancelRegistrationClicked = (event) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isCancel: true,
        selectedEvent: event,
      };
    });
  };

  onCancelConfirmed = () => {
    const payload = {
      eventId: this.state.selectedEvent.id,
    };
    eventService
      .removeEventParticipant(payload)
      .then(this.onConfirm)
      .catch((err) => toastError(err.toString()));
  };

  closeModal = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isOpen: false,
        selectedEvent: {},
      };
    });
  };

  onEventRegistrationClicked = () => {
    const payload = {
      EventId: this.state.selectedEvent.id,
      ParticipantTypeId: 2,
    };
    eventService
      .addEventParticipant(payload)
      .then(this.onRegisteredSuccess)
      .catch((err) => toastError(err.toString()));
  };

  onRegisteredSuccess = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        showRegistered: true,
      };
    });
  };

  onStripeStateChange = (stripeState) => {
    this.setState({ stripeState }, () => this.onEventRegistrationClicked());
  };

  onCancelCancel = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isCancel: false,
        isDelete: false,
      };
    });
  };

  onConfirm = () => {
    this.props.history.go();
  };
  //#endregion

  //#region Search / Pagination
  onPaginationChange = (page) => {
    const query = this.state.searchQuery;
    let pageIndex = page - 1;
    let pageSize = this.state.pagination.pageSize;
    if (query) this.searchEvents(pageIndex, pageSize, query);
    else {
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            pagination: {
              ...prevState.pagination,
              currentPage: page,
              pageIndex: page - 1,
            },
          };
        },
        () => {
          const { pageIndex, pageSize } = this.state.pagination;
          this.getEvents(pageIndex, pageSize);
        }
      );
    }
  };

  handleSearch = (query) => {
    this.setState((prevState) => ({ ...prevState, searchQuery: query }));
    const pageIndex = 0;
    const pageSize = this.state.pagination.pageSize;

    this.searchEvents(pageIndex, pageSize, query);
  };

  searchEvents = (pageIndex, pageSize, query) => {
    eventService
      .searchv2(pageIndex, pageSize, query)
      .then(this.onSearchEventsSuccess)
      .then(this.renderEvents)
      .catch(this.onSearchEventsError);
  };

  clearSearch = () => {
    const events = [];
    const mappedEvents = [];
    const pagination = {
      totalCount: 0,
      currentPage: 1,
      pageIndex: 0,
      pageSize: 9,
    };
    const searchQuery = "";
    this.setState(
      (prevState) => ({
        ...prevState,
        events,
        mappedEvents,
        pagination,
        searchQuery,
      }),
      () => {
        const { pageIndex, pageSize } = this.state.pagination;
        this.getEvents(pageIndex, pageSize);
      }
    );
  };

  onSearchEventsSuccess = (response) => response.item;

  onSearchEventsError = () => this.resetState();

  //#endregion

  render() {
    return (
      <div className="container-fluid px-lg-5">
        <div className="px-md-5 mx-md-5">
          <div className="row">
            <h1 className="col text-center display-5">Events</h1>
          </div>
          <div className="row justify-content-center">
            <div className="ml-auto col-md-6 mr-0 pr-0">
              <SearchBar
                searchPaginated={this.handleSearch}
                getPaginated={this.getEvents}
                clearSearch={this.clearSearch}
                pageIndex={this.state.pagination.pageIndex}
                pageSize={this.state.pagination.pageSize}
                searchQuery={this.state.searchQuery}
              />
            </div>
            {this.props.currentUser.roles.includes("SysAdmin") && (
              <button
                type="button"
                onClick={this.addEventClicked}
                className="col-1 btn btn-success"
              >
                <i className="fas fa-plus" />
              </button>
            )}
          </div>
          <div className="row card-group">{this.state.mappedEvents}</div>
          <div className="row justify-content-center mt-3">
            <Pagination
              current={this.state.pagination.currentPage}
              total={this.state.pagination.totalCount}
              pageSize={this.state.pagination.pageSize}
              onChange={this.onPaginationChange}
            />
          </div>
          <Modal
            isOpen={this.state.isOpen}
            toggle={this.closeModal}
            size="lg"
            centered
          >
            <ModalHeader toggle={this.closeModal}>
              <div className="modal-title">{this.state.selectedEvent.name}</div>
            </ModalHeader>
            <ModalBody>
              <div className="row">
                <div className="col-md-6">
                  <EventRegisterDescription values={this.state.selectedEvent} />
                </div>
                {!this.state.selectedEvent.isFree && (
                  <div className="col-md-6 pl-md-5">
                    <Elements stripe={stripePromise} {...this.props}>
                      <InjectedEventCheckout
                        {...this.props}
                        onStripeStateChange={this.onStripeStateChange}
                        selectedEvent={this.state.selectedEvent}
                        stripeRef={(ref) => (this.stripeCheckout = ref)}
                      />
                    </Elements>
                  </div>
                )}
              </div>
              {!this.state.selectedEvent.isFree ? (
                <div className="row justify-content-center text-danger">
                  This purchase in non-refundable.
                </div>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-secondary" onClick={this.closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={this.onEventRegistrationClicked}
                disabled={
                  (this.state.selectedEvent.price > 0 &&
                    this.state.stripeState.paymentMethod === null) ||
                  this.state.stripeState.intentClientSecret === null
                }
              >
                Confirm
              </button>
            </ModalFooter>
          </Modal>
          {this.state.showRegistered && (
            <SweetAlert
              success
              title="Registered"
              onConfirm={this.onConfirm}
              timeout={2000}
            >
              Signed Up Successfully!
            </SweetAlert>
          )}
          {this.state.showCanceled && (
            <SweetAlert
              success
              title="Registration Canceled"
              onConfirm={this.onConfirm}
              timeout={2000}
            >
              You have been removed from the participant list for this event.
            </SweetAlert>
          )}
          {this.state.isCancel && (
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Cancel Registration"
              confirmBtnBsStyle="danger"
              title="Are you sure?"
              onConfirm={this.onCancelConfirmed}
              onCancel={this.onCancelCancel}
              focusCancelBtn
            >
              Are you sure you wish to remove yourself from this event?
            </SweetAlert>
          )}
          {this.state.isDelete && (
            <SweetAlert
              warning
              showCancel
              confirmBtnText="Yes Delete!"
              confirmBtnBsStyle="danger"
              title="Are you sure?"
              onConfirm={this.onDeleteConfirmed}
              onCancel={this.onCancelCancel}
              focusCancelBtn
            >
              Do you wish to delete this event? Those registered will be
              removed. If they had paid, <b>they will not be refunded.</b>
            </SweetAlert>
          )}
          {this.state.showDelete && (
            <SweetAlert
              success
              title="Delete Successful"
              onConfirm={this.onConfirm}
              timeout={2000}
            >
              This event was deleted.
            </SweetAlert>
          )}
        </div>
      </div>
    );
  }
}

Events.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
    go: PropTypes.func,
  }),
};
