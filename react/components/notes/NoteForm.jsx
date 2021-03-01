import React from "react";
import {
  add,
  getById,
  updateById,
  getListOfSeekerNames,
} from "../../services/noteService";
import { Formik, Form, Field } from "formik";
import logger from "sabio-debug";
import { SelectFormikV2 } from "../utilities/select-formik/SelectFormikV2";
import { getType as getTags } from "../../services/lookUpService";
import noteValidationSchema from "../../schemas/noteValidationSchema";
import "./Notes.css";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { withRouter } from "react-router";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const _logger = logger.extend("noteform");

class NoteForm extends React.Component {
  state = {
    formData: {
      notes: "",
      seekerId: 0,
      tagId: 0,
    },
    isEdit: false,
    tagOptions: [],
    seekerOptions: [],
  };

  componentDidMount() {
    _logger("component mounted");
    this.getSelectOptions();
    this.getFilledForm();
  }

  componentDidUpdate() {
    _logger("component updated");
  }

  //Formik Options
  getSelectOptions = () => {
    getListOfSeekerNames()
      .then(this.onGetOptionsSuccess)
      .then(this.setSeekerNames)
      .catch(this.onGetOptionsError);

    const type = "Tags";
    getTags(type)
      .then(this.onGetOptionsSuccess)
      .then(this.setTags)
      .catch(this.onGetOptionsError);
  };

  setTags = (tags) => {
    const tagOptions = tags.map(this.mapTags);
    this.setState((prevState) => ({ ...prevState, tagOptions }));
  };

  mapTags = (tag) => {
    const tagOptions = {
      value: Number(tag.id),
      label: tag.name,
    };
    return tagOptions;
  };

  setSeekerNames = (names) => {
    const seekerOptions = names.map(this.mapNames);
    this.setState((prevState) => ({ ...prevState, seekerOptions }));
  };

  mapNames = (name) => {
    const seekerOptions = {
      value: parseInt(name.userId),
      label: `${name.firstName} ${name.lastName}`,
    };
    return seekerOptions;
  };
  //End formik options

  //Hydrating form
  getFilledForm = () => {
    const { noteId } = this.props.match.params;
    _logger(this.props.match);
    if (noteId) {
      const { state } = this.props.location;
      _logger(state);
      if (state) {
        this.setForm(state);
        _logger("setFor is triggered by component did mount");
      } else {
        _logger("get by id has fired");
        getById(noteId).then(this.onGetByIdSuccess).catch(this.onGetByIdError);
      }
    }
  };

  setForm = (formData) => {
    let notes = formData.notes;
    let seekerId = parseInt(formData.seekerId);
    _logger(seekerId);
    let tagId = Number(formData.tagId);
    _logger(tagId);
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: {
          // ...formData,
          notes: notes,
          seekerId: seekerId,
          tagId: tagId,
        },
        isEdit: true,
      };
    });
    _logger(this.state);
  };
  //End hydrating form

  //Form functions
  handleSubmit = (values) => {
    _logger("seekerId:" + values.seekerId);
    _logger("tagId:" + values.tagId);
    _logger(values.notes);
    values.seekerId = Number(values.seekerId);
    values.tagId = Number(values.tagId);
    const editNoteStatus = this.state.isEdit;
    if (editNoteStatus === true) {
      const noteId = this.props.match.params.noteId;
      _logger(noteId);
      updateById(values, noteId)
        .then(this.onUpdateNoteSuccess)
        .catch(this.onUpdateNoteError);
    } else {
      add(values).then(this.onAddNoteSuccess).catch(this.onAddNoteError);
    }
  };
  //End form functions

  //Axios responses
  onGetOptionsSuccess = (response) => {
    if (response.items) {
      _logger(response.items);
      return response.items;
    } else return null;
  };

  onGetOptionsError = (response) => {
    _logger(`Error: ${response.message}`);
  };

  onGetByIdSuccess = (response) => {
    _logger("get by id success has fired" + response);
    this.setForm(response.item);
  };

  onGetByIdError = (response) => {
    _logger(response);
  };

  onUpdateNoteSuccess = (response) => {
    _logger("successful update:" + response);
    this.props.history.push(`/notes`);
  };

  onUpdateNoteError = (response) => {
    _logger("Error response:" + response);
  };

  onAddNoteSuccess = (response) => {
    toast.success("Note has been posted to appointment");
    this.setState((prevState) => {
      const currentNote = {
        ...prevState.formData,
      };
      currentNote.id = response.item;

      return {
        formData: currentNote,
      };
    });
    this.props.history.push(`/notes`);
    _logger(this.state);
  };

  onAddNoteError = () => {
    toast.error("Please try again, note not posted");
  };
  //End responses

  render() {
    _logger(this.state);
    _logger(this.props.currentUser.id);
    const tagOptions = this.state.tagOptions;
    const seekerOptions = this.state.seekerOptions;
    return (
      <React.Fragment>
        <Formik
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
          validationSchema={noteValidationSchema}
          enableReinitialize={true}
        >
          {(formikProps) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              setFieldValue,
            } = formikProps;
            return (
              <Form onSubmit={handleSubmit}>
                <div className="card col-md-6" id="form-card">
                  <div>
                    <label>Start Typing a User to Select</label>
                    <div>
                      <Field
                        key={"Seeker_Select"}
                        name="seekerId"
                        component={SelectFormikV2}
                        placeholder="Select a user"
                        options={seekerOptions}
                        isSearchable
                        isClearable
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label>CONTENT</label>
                      <CKEditor
                        className="form-control"
                        editor={ClassicEditor}
                        onChange={(event, editor) =>
                          setFieldValue("notes", editor.getData())
                        }
                        data={values.notes} //initial value from formik
                      />{" "}
                      <style>
                        {`
                        .ck-content { height: 300px; }
                        `}
                      </style>
                      {touched.notes && errors.notes && (
                        <div className="text-danger">{errors.notes}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Field
                      key={"Tag_Select"}
                      name="tagId"
                      component={SelectFormikV2}
                      placeholder="Select a Tag"
                      options={tagOptions}
                      isSearchable
                      isClearable
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="form-btn"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

NoteForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number,
      notes: PropTypes.string,
      seekerId: PropTypes.number,
      tagId: PropTypes.number,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      noteId: PropTypes.string,
    }),
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
};
export default withRouter(NoteForm);
