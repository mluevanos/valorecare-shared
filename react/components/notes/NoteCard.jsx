import React from "react";
import PropTypes from "prop-types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import NoteDetailPDF from "./NoteDetailPDF";
import "./Notes.css";
import { buildDateShort } from "../../services/utilityService";

const NoteCard = (props) => {
  const editButtonSelected = () => {
    props.onClickEdit(props.item);
  };

  const deleteButtonSelected = () => {
    props.onClickDelete(props.item);
  };
  const viewContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  const ActionButtons = () => {
    if (props.isProvider === true) {
      return (
        <React.Fragment>
          <div className="row justify-content-center">
            <button
              type="button"
              className="col-xl-6 btn btn-sm btn-primary text-center m-2"
              style={{ whiteSpace: "normal" }}
            >
              <PDFDownloadLink
                document={<NoteDetailPDF pdfData={props.item} />}
                fileName={`${props.item.userInfo.firstName} ${props.item.userInfo.lastName} Note`}
                style={{
                  padding: "10px",
                  color: "#ffffff",
                }}
              >
                {({ loading }) =>
                  loading ? "Loading document..." : `Download PDF`
                }
              </PDFDownloadLink>
            </button>
            <button
              type="button"
              className="col btn btn-sm btn-outline-primary m-2"
              onClick={editButtonSelected}
              name={props.item.id}
            >
              <i className="fas fa-edit" />
            </button>
            <button
              type="button"
              className="col btn btn-sm btn-outline-danger m-2"
              onClick={deleteButtonSelected}
              name={props.item.id}
            >
              <i className="fas fa-trash-alt" />
            </button>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div className="row justify-content-center">
          <button
            type="button"
            className="col-xl-8 btn btn-primary text-center m-2"
          >
            <PDFDownloadLink
              document={<NoteDetailPDF pdfData={props.item} />}
              fileName={`${props.item.userInfo.firstName} ${props.item.userInfo.lastName} Note`}
              style={{
                padding: "10px",
                color: "#ffffff",
              }}
            >
              {({ loading }) =>
                loading ? "Loading document..." : `Download PDF`
              }
            </PDFDownloadLink>
          </button>
        </div>
      );
    }
  };

  const handleClick = () => {
    props.onHandleRead(props.item);
  };

  return (
    <React.Fragment key={props.item.id}>
      <div
        className={
          props.isInDashboard
            ? "col-12 m-0 pt-0 px-3 pb-3"
            : "col-md-6 col-lg-4 p-2"
        }
      >
        <div
          className={
            props.isInDashboard ? "card pt-0 h-100" : "card my-0 h-100"
          }
          id="note-card"
        >
          <div
            className={
              props.isInDashboard
                ? "card-body text-center"
                : "my-0 card-body text-center"
            }
            onClick={handleClick}
          >
            <h4 className="card-title col-12">
              {`${props.item.userInfo.firstName} ${props.item.userInfo.lastName}`}
            </h4>
            <div className="text">
              <div
                className="card-text text-left text-truncate"
                style={{ textoverflow: "ellipsis", height: "7rem" }}
              >
                {viewContent(props.item.notes)}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="small font-weight-light text-secondary row">
              <div className="col text-left">Created on:</div>
              <div className="col text-right">
                {buildDateShort(props.item.dateCreated)}
              </div>
            </div>
          </div>
          <div className="card-footer">
            <ActionButtons />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

NoteCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    notes: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    userInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
  onClickEdit: PropTypes.func,
  onClickDelete: PropTypes.func,
  onHandleRead: PropTypes.func,
  isProvider: PropTypes.bool,
  isInDashboard: PropTypes.bool.isRequired,
};
export default NoteCard;
