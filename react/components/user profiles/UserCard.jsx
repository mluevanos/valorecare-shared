import React from "react";
import propTypes from "prop-types";
import { Button } from "reactstrap";
import _logger from "sabio-debug";

function UserCard(props) {
  const handleSelected = () => {
    _logger(props.user);
    props.onActivateUserRequest(props.user.id);
  };

  return (
    <div className="col-4 col-md-4 col-lg-4">
      <div className="card">
        <div className="card-body">
          <div className="text-center mt-4">
            <div className="mt-2 card-title">
              {props.user.firstName} {props.user.lastName}
            </div>
            <img
              src={props.user.avatarUrl}
              className="rounded-circle"
              width={80}
              alt="profilepic"
            />
            <div className="card-subtitle"></div>

            <div>
              <div className="fixed-action-btn">
                <Button className="btn-floating btn-large float-left">
                  <i className="large fas fa-info-circle"></i>
                </Button>
                <Button
                  className="float-right"
                  color={props.user.statusId === 2 ? "success" : "danger"}
                  type="button"
                  onClick={handleSelected}
                >
                  {props.user.statusId === 2 ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserCard.propTypes = {
  user: propTypes.shape({
    id: propTypes.number,
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired,
    avatarUrl: propTypes.isRequired,
    statusId: propTypes.number,
  }),
  onActivateUserRequest: propTypes.func,
};

export default UserCard;
