import React from "react";
import propTypes from "prop-types";

function Profile(props) {
  const handleEditClick = () => {
    props.handleEdit(props.userProfile);
  };

  return (
    <React.Fragment>
      <div className="page-content container-fluid">
        <div>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="text-center mt-4">
                    <img
                      src={props.userProfile.avatarUrl}
                      className="rounded-circle"
                      width={150}
                      alt="profilepic"
                    />
                    <div className="mt-2 card-title">
                      {props.userProfile.firstName} {props.userProfile.mi}{" "}
                      {props.userProfile.lastName}
                    </div>
                    <div className="card-subtitle"></div>
                    <div className="panel-footer">
                      <span
                        data-original-title="Edit My Profile"
                        data-toggle="tooltip"
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={handleEditClick}
                      >
                        <i className="glyphicon glyphicon-edit" /> Edit My
                        Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Profile.propTypes = {
  userProfile: propTypes.shape({
    id: propTypes.number,
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired,
    mi: propTypes.string,
    avatarUrl: propTypes.isRequired,
  }),
  handleEdit: propTypes.func,
};

export default Profile;
