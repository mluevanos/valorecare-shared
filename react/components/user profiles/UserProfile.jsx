import React from "react";
import Profile from "./ProfileArea";
import _logger from "sabio-debug";
import { getById } from "../../services/userProfileService";
import propTypes from "prop-types";
import Swal from "sweetalert";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        firstName: "",
        lastName: "",
        mi: "",
        avatarUrl: "",
        id: "",
      },
      isLoading: true,
    };
  }

  componentDidMount = () => {
    getById(this.props.currentUser.id)
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdError);
  };

  onGetByIdSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        currentUser: { ...response.item },
        isLoading: false,
      };
    });
  };

  onGetByIdError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    _logger(error);
  };

  handleEdit = () => {
    let myId = this.props.currentUser.id;
    this.props.history.push(`/user/${myId}/setupProfile`);
  };

  render() {
    return (
      <div className="row">
        {!this.state.isLoading ? (
          <Profile
            userProfile={this.state.currentUser}
            handleEdit={this.handleEdit}
          />
        ) : (
          "fetching user info"
        )}
      </div>
    );
  }
}

UserProfile.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      userId: propTypes.string,
    }),
  }),
  history: propTypes.shape({
    push: propTypes.isRequired,
  }),
  currentUser: propTypes.shape({
    avatarUrl: propTypes.string,
    firstName: propTypes.string,
    lastName: propTypes.string,
    mi: propTypes.string,
    id: propTypes.number,
  }),
};

export default UserProfile;
