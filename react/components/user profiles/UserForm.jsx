import React from "react";
import propTypes from "prop-types";
import * as userProfileService from "../../services/userProfileService";
import { FormGroup, Label, Button } from "reactstrap";
import { Formik, Field, Form } from "formik";
import { userProfileSchema } from "../../schemas/userProfileSchema";
import { toast } from "react-toastify";
import Swal from "sweetalert";
import _logger from "sabio-debug";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        lastName: "",
        mi: "",
        avatarUrl: "",
      },
      isAnEdit: false,
    };
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;

    if (id) {
      const { state } = this.props.location;
      if (state) {
        _logger(state);
        this.setForm(state);
      } else {
        userProfileService
          .getById(id)
          .then(this.onGetByIdSuccess)
          .catch(this.onGetByIdError);
      }
    }
  };

  setForm = (formData) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: {
          ...formData,
        },
        isAnEdit: true,
      };
    });
  };

  onGetByIdSuccess = (response) => {
    this.setForm(response.item);
  };

  onGetByIdError = (error) => {
    _logger(error);
  };

  handleSubmit = (values) => {
    values.userId = parseInt(values.userId);
    if (this.state.isAnEdit) {
      userProfileService
        .updateById(values)
        .then(this.onEditProfileSuccess)
        .catch(this.onEditProfileError);
    } else {
      userProfileService
        .addProfile(values)
        .then(this.onAddProfileSuccess)
        .catch(this.onAddProfileError);
    }
  };

  onEditProfileSuccess = (response) => {
    toast.success("Profile Updated!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    _logger(response);
    this.props.history.push("/user");
  };

  onEditProfileError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    _logger(error);
  };

  onAddProfileSuccess = (response) => {
    toast.success("Profile Added!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    _logger(response);
    this.props.history.push("/user");
  };

  onAddProfileError = (error) => {
    Swal({
      icon: "error",
      title: "Ooops...",
      text: "Something went wrong!",
      footer: "<a href>What went wrong?</a>",
    });
    _logger(error);
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          className={
            this.state.formVisibility === true
              ? "userForm"
              : "d-none display-none"
          }
          enableReinitialize={true}
          validationSchema={userProfileSchema}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {(props) => {
            const { values, touched, errors, isValid, isSubmitting } = props;
            return (
              <Form className={"col-md-5 pt-4 card"}>
                <FormGroup>
                  <Label>First Name</Label>
                  <Field
                    name="firstName"
                    type="text"
                    values={values.firstName}
                    placeholder="First Name"
                    autoComplete="off"
                    className={
                      errors.firstName && touched.firstName
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.firstName && touched.firstName && (
                    <span className="input-feedback">{errors.firstName}</span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Field
                    name="lastName"
                    type="text"
                    values={values.lastName}
                    placeholder="Last Name"
                    autoComplete="off"
                    className={
                      errors.lastName && touched.lastName
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.lastName && touched.lastName && (
                    <span className="input-feedback">{errors.lastName}</span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Middle Initial</Label>
                  <Field
                    name="mi"
                    type="text"
                    values={values.mi}
                    placeholder="Middle Initial"
                    autoComplete="off"
                    className={
                      errors.mi && touched.mi
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.mi && touched.mi && (
                    <span className="input-feedback">{errors.mi}</span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Avatar URL</Label>
                  <Field
                    name="avatarUrl"
                    type="text"
                    values={values.avatarUrl}
                    placeholder="Avatar URL"
                    autoComplete="off"
                    className={
                      errors.avatarUrl && touched.avatarUrl
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.avatarUrl && touched.avatarUrl && (
                    <span className="input-feedback">{errors.avatarUrl}</span>
                  )}
                </FormGroup>
                <Button
                  className="col-md-3"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {this.state.isAnEdit ? "Update" : "Submit"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

UserForm.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string,
    }),
  }),
  location: propTypes.shape({
    state: propTypes.shape({
      firstName: propTypes.string.isRequired,
      lastName: propTypes.string.isRequired,
      mi: propTypes.string,
      avatarUrl: propTypes.isRequired,
      isAnEdit: propTypes.bool,
    }),
  }),
  history: propTypes.shape({
    push: propTypes.isRequired,
  }),
};

export default UserForm;
