import React from "react";
import {
  getCreatedBy,
  deleteById,
  searchNotesBySeeker,
  searchNotesByProvider,
  getNotesBySeekerId,
} from "../../services/noteService";
import logger from "sabio-debug";
import NoteCard from "./NoteCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import SearchBar from "../utilities/SearchBar";
import SweetAlert from "react-bootstrap-sweetalert";
import { isRoleOf } from "../../services/utilityService";
const _logger = logger.extend("allNotes");
class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      noteDetails: {},
      isViewingDetails: false,
      mappedNotes: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
        pageIndex: 0,
        pageSize: this.props.isInDashboard ? 3 : 9,
      },
      searchQuery: "",
      isProvider: false,
    };
  }

  componentDidMount() {
    this.checkIfProvider();
  }

  checkIfProvider = () => {
    const roles = this.props.currentUser.roles;
    if (isRoleOf(roles, "Provider")) {
      const isProvider = true;
      this.setState(
        (prevState) => ({ ...prevState, isProvider }),
        () => this.getNotes()
      );
    } else this.getNotes();
  };

  getNotes = () => {
    if (this.state.isProvider) this.getAllProviderNotes();
    else this.getAllSeekerNotes();
  };

  getAllSeekerNotes = () => {
    const pageIndex = this.state.pagination.pageIndex;
    const pageSize = this.state.pagination.pageSize;
    getNotesBySeekerId(pageIndex, pageSize)
      .then(this.onGetCreatedBySuccess)
      .then(this.renderNotes)
      .catch(this.onGetCreatedByError);
  };
  getAllProviderNotes = () => {
    const pageIndex = this.state.pagination.pageIndex;
    const pageSize = this.state.pagination.pageSize;
    getCreatedBy(pageIndex, pageSize)
      .then(this.onGetCreatedBySuccess)
      .then(this.renderNotes)
      .catch(this.onGetCreatedByError);
  };
  renderNotes = (notesPaged) => {
    const notes = notesPaged.pagedItems;
    const mappedNotes = notesPaged.pagedItems.map(this.mappedNotes);
    const pagination = {
      totalCount: notesPaged.totalCount,
      pageIndex: notesPaged.pageIndex,
      currentPage: notesPaged.pageIndex + 1,
      pageSize: this.state.pagination.pageSize,
    };
    this.setState((prevState) => {
      return {
        ...prevState,
        mappedNotes,
        notes,
        pagination,
      };
    });
  };
  //Search
  searchNotes = (searchQuery, pageIndex, pageSize) => {
    if (this.state.isProvider) {
      searchNotesBySeeker(searchQuery, pageIndex, pageSize)
        .then(this.onSearchNotesSuccess)
        .then(this.renderNotes)
        .catch(this.onSearchNotesError);
    } else {
      searchNotesByProvider(searchQuery, pageIndex, pageSize)
        .then(this.onSearchNotesSuccess)
        .then(this.renderNotes)
        .catch(this.onSearchNotesError);
    }
  };
  handleSearch = (query) => {
    const searchQuery = query;
    this.setState((prevState) => ({ ...prevState, searchQuery }));
    const pageIndex = 0;
    const pageSize = this.state.pagination.pageSize;
    this.searchNotes(searchQuery, pageIndex, pageSize);
    _logger(searchQuery, pageIndex, pageSize);
  };
  onChange = (page) => {
    const query = this.state.searchQuery;
    let pageIndex = page - 1;
    let pageSize = this.state.pagination.pageSize;
    if (query) this.searchNotes(query, pageIndex, pageSize);
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
          pageIndex = this.state.pagination.pageIndex;
          pageSize = this.state.pagination.pageSize;
          if (this.state.isProvider === true) {
            this.getAllProviderNotes();
          } else {
            this.getAllSeekerNotes();
          }
        }
      );
    }
  };
  clearSearch = () => {
    this.resetState();
    this.resetSearch();
  };
  resetState = () => {
    const notes = [];
    const mappedNotes = [];
    const pagination = {
      totalCount: 0,
      currentPage: 1,
      pageIndex: 0,
      pageSize: 9,
    };
    this.setState((prevState) => ({
      ...prevState,
      mappedNotes,
      notes,
      pagination,
    }));
  };
  resetSearch = () => {
    const searchQuery = "";
    this.setState(
      (prevState) => ({ ...prevState, searchQuery }),
      () => {
        if (this.state.isProvider === true) {
          this.getAllProviderNotes();
        } else {
          this.getAllSeekerNotes();
        }
      }
    );
  };
  //End of search functions
  //Form functions
  onClickEdit = (singleNote) => {
    const noteId = singleNote.id;
    this.props.history.push(`/note/${noteId}/edit`);
  };
  onClickDelete = (singleNote) => {
    const noteId = singleNote.id;
    _logger(noteId);
    deleteById(noteId)
      .then(this.onDeleteSuccess)
      .then(this.removeFromPage(noteId))
      .then(this.determineRouting)
      .catch(this.onDeleteError);
  };
  onClickCreate = (event) => {
    event.preventDefault();
    this.props.history.push("/note/create");
  };
  viewContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  onHandleRead = (notes) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        noteDetails: notes.notes,
        isViewingDetails: true,
      };
    });
  };
  onCloseDetails = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        noteDetails: {},
        isViewingDetails: false,
      };
    });
  };
  viewContent = (content) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
  removeFromPage = (noteId) => {
    _logger(noteId);
    this.setState((prevState) => {
      const stringtoNum = Number(noteId);
      const indexOfNote = prevState.notes.findIndex(
        (singleNote) => singleNote.id === stringtoNum
      );
      const updatedNotes = [...prevState.notes];
      if (indexOfNote >= 0) {
        updatedNotes.splice(indexOfNote, 1);
      }
      return {
        notes: updatedNotes,
        mappedNotes: updatedNotes.map(this.mappedNotes),
      };
    });
  };
  //End of form functions
  //Note Card component
  mappedNotes = (singleNote) => {
    return (
      <NoteCard
        {...this.props}
        isInDashboard={this.props.isInDashboard}
        key={singleNote.id}
        item={singleNote}
        onClickEdit={this.onClickEdit}
        onClickDelete={this.onClickDelete}
        onHandleRead={this.onHandleRead}
        isProvider={this.state.isProvider}
      />
    );
  };
  //end of Note Card component
  //Ajax success/Error
  onSearchNotesSuccess = (response) => {
    _logger(response.item);
    return response.item;
  };
  onSearchNotesError = (response) => {
    _logger(response);
    this.resetState();
  };
  onGetCreatedBySuccess = (response) => {
    _logger(response);
    return response.item;
  };
  onGetCreatedByError = (response) => {
    _logger("Error Response:" + response);
  };
  onDeleteSuccess = (response) => {
    _logger(response);
  };
  onDeleteError = (error) => {
    _logger(error.response);
  };
  //End of Ajax responses
  render() {
    const isProvider = this.state.isProvider;
    const isInDashboard = this.props.isInDashboard;
    const containerClassName = isInDashboard
      ? "container-fluid"
      : "container-fluid px-md-5";
    const paddingClassName = isInDashboard ? "px-3" : "px-md-3 mx-md-5";

    const Header = () => {
      if (isInDashboard) return null;
      else
        return (
          <div className="row">
            <h1 className="col text-center display-5">Notes</h1>
          </div>
        );
    };

    return (
      <React.Fragment>
        <div className={containerClassName}>
          <div className={paddingClassName}>
            <Header />
            {isInDashboard ? null : (
              <div className="row d-flex">
                <div className="ml-auto col-md-7 mr-0 pr-0">
                  <SearchBar
                    searchPaginated={this.handleSearch}
                    getPaginated={this.getAllProviderNotes}
                    clearSearch={this.clearSearch}
                    pageIndex={this.state.pagination.pageIndex}
                    pageSize={this.state.pagination.pageSize}
                    searchQuery={this.state.searchQuery}
                  />
                </div>
                {this.props.currentUser.roles.includes("Provider") && (
                  <div className="col-md-1 ml-0 pl-0">
                    <button
                      className="btn btn-success"
                      onClick={this.onClickCreate}
                    >
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {this.state.mappedNotes.length < 1 ? (
              <div className="row">
                <p className="col text-center">
                  <small>
                    {isProvider
                      ? "You haven't created any notes."
                      : "You haven't received any notes."}
                  </small>
                </p>
              </div>
            ) : (
              <div className="row card-group">{this.state.mappedNotes}</div>
            )}
            <div>
              <div className="row">
                <div className="pagination-container mt-3">
                  <Pagination
                    total={this.state.pagination.totalCount}
                    current={this.state.pagination.currentPage}
                    pageSize={this.state.pagination.pageSize}
                    pageIndex={this.state.pagination.pageIndex}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SweetAlert
          title="Note Details"
          show={this.state.isViewingDetails}
          onConfirm={this.onCloseDetails}
          onCancel={this.onCloseDetails}
        >
          {this.viewContent(this.state.noteDetails)}
        </SweetAlert>
      </React.Fragment>
    );
  }
}
Notes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      noteId: PropTypes.string,
    }),
  }),
  onClickEdit: PropTypes.func,
  onClickDelete: PropTypes.func,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.array,
  }),
  isInDashboard: PropTypes.bool,
};

Notes.defaultProps = {
  isInDashboard: false,
};

export default Notes;
