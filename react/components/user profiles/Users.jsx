import React from "react";
import _logger from "sabio-debug";
import { Row, Col } from "reactstrap";
import { getCurrentUser } from "../../services/tempAuthService";
import SearchBar from "../utilities/SearchBar";
import * as userProfileService from "../../services/userProfileService";
import propTypes from "prop-types";
import Swal from "sweetalert";
import UserCard from "./UserCard";
import Pagination from "rc-pagination/lib/Pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      listOfUsers: [],
      currentUser: {
        roles: [],
        id: 0,
        name: "",
        tenantId: "",
      },
      pagination: {
        totalCount: 0,
        currentPage: 1,
        pageIndex: 0,
        pageSize: 6,
      },
      searchQuery: "",
    };
  }

  componentDidMount = () => {
    _logger("Component Did Mount");
    const pageIndex = this.state.pagination.pageIndex;
    const pageSize = this.state.pagination.pageSize;
    this.getCurrent();
    this.getAllUsers(pageIndex, pageSize);
  };

  getCurrent = () => {
    getCurrentUser()
      .then(this.onGetCurrentUserSuccess)
      .catch(this.onGetCurrentUserError);
  };

  getAllUsers = (pageIndex, pageSize) => {
    userProfileService
      .getAll(pageIndex, pageSize)
      .then(this.onGetUsersSuccess)
      .then(this.renderUsers)
      .catch(this.onGetUsersError);
  };

  renderUsers = (usersPaged) => {
    const users = usersPaged.pagedItems;
    const listOfUsers = usersPaged.pagedItems.map(this.mapUsers);

    const pagination = {
      totalCount: usersPaged.totalCount,
      pageIndex: usersPaged.pageIndex,
      currentPage: usersPaged.pageIndex + 1,
      pageSize: this.state.pagination.pageSize,
    };

    this.setState((prevState) => {
      return {
        ...prevState,
        listOfUsers,
        users,
        pagination,
      };
    });
  };

  setUsers = (listOfUsers) => {
    this.setState((prevState) => ({ ...prevState, listOfUsers }));
  };

  mapUsers = (user) => {
    return (
      <UserCard
        {...this.props}
        key={user.id}
        user={user}
        onActivateUserRequest={this.onActivateUserRequest}
        userId={this.state.currentUser.id}
      ></UserCard>
    );
  };

  onActivateUserRequest = (id) => {
    _logger(id);

    this.setState((prevState) => {
      let users = [...prevState.users];
      let index = users.findIndex((user) => user.id === id);
      if (users[index].statusId === 2) {
        users[index].statusId = 1;
        users[index].status = "Active";
        //Status of 1 = active
        userProfileService.activateUser(id, 1);
      } else {
        users[index].statusId = 2;
        users[index].status = "Inactive";
        //status of 2 = inactive
        userProfileService.activateUser(id, 2);
      }
      return {
        ...prevState,
        users,
        listOfUsers: users.map(this.mapUsers),
      };
    });
  };

  onGetCurrentUserSuccess = (response) => {
    const currentUser = response.item;

    this.setState((prevState) => ({ ...prevState, currentUser }));
  };

  onGetCurrentUserError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    _logger(error);
  };

  onGetUsersSuccess = (responseData) => {
    return responseData.item;
  };

  onGetUsersError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    _logger(error);
  };

  onSearchUserSuccess = (response) => {
    return response.item;
  };

  onSearchUserError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    this.resetState();
    _logger(error);
  };

  searchUsers = (pageIndex, pageSize, searchString) => {
    userProfileService
      .searchUserProfile(pageIndex, pageSize, searchString)
      .then(this.onSearchUserSuccess)
      .then(this.renderUsers)
      .catch(this.onSearchUserError);
  };

  handleSearch = (searchString) => {
    const searchQuery = searchString;
    this.setState((prevState) => ({ ...prevState, searchQuery }));
    const pageIndex = 0;
    const pageSize = this.state.pagination.pageSize;
    this.searchUsers(pageIndex, pageSize, searchQuery);
  };

  clearSearch = () => {
    this.resetState();
    this.resetSearch();
  };

  resetState = () => {
    const listOfUsers = [];
    const users = [];
    const pagination = {
      totalCount: 0,
      currentPage: 1,
      pageIndex: 0,
      pageSize: 6,
    };
    this.setState((prevState) => ({
      ...prevState,
      listOfUsers,
      users,
      pagination,
    }));
  };

  resetSearch = () => {
    const searchQuery = "";
    this.setState(
      (prevState) => ({ ...prevState, searchQuery }),
      () => {
        const pageIndex = this.state.pagination.pageIndex;
        const pageSize = this.state.pagination.pageSize;
        this.getAllUsers(pageIndex, pageSize);
      }
    );
  };

  onPaginationChange = (page) => {
    const searchString = this.state.searchQuery;
    let pageIndex = page - 1;
    let pageSize = this.state.pagination.pageSize;
    if (searchString) this.searchUsers(pageIndex, pageSize, searchString);
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
          this.getAllUsers(pageIndex, pageSize);
        }
      );
    }
  };

  render() {
    return (
      <>
        <Row>
          <Col xs={10} className="mr-auto">
            <h2>Users</h2>
          </Col>

          <Col xs={2}>
            <SearchBar
              searchPaginated={this.handleSearch}
              getPaginated={this.getAllUsers}
              clearSearch={this.clearSearch}
              pageIndex={this.state.pagination.pageIndex}
              pageSize={this.state.pagination.pageSize}
              searchQuery={this.state.searchQuery}
            />
          </Col>
        </Row>

        <Row>{this.state.listOfUsers}</Row>

        <Row className="justify-content-center">
          <Pagination
            total={this.state.pagination.totalCount}
            current={this.state.pagination.currentPage}
            pageSize={this.state.pagination.pageSize}
            pageIndex={this.state.pagination.pageIndex}
            onChange={this.onPaginationChange}
            locale={localeInfo}
          ></Pagination>
        </Row>
      </>
    );
  }
}

Users.propTypes = {
  userProfile: propTypes.shape({
    id: propTypes.number,
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired,
    mi: propTypes.string,
    avatarUrl: propTypes.isRequired,
  }),
};

export default Users;
