import React from "react";
import { Page, Text, View, StyleSheet, Document } from "@react-pdf/renderer";
import { PdfTitle } from "../pdf/examplePdf/miscComponents/PdfTitle";
import * as moment from "moment";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("NoteCard");
const styles = StyleSheet.create({
  page: {
    padding: 10,
  },

  bulletPoint: {
    width: 10,
    fontSize: 10,
  },

  container: {
    flex: 1,
  },

  section: {
    margin: 4,
    padding: 4,
  },

  sectionHeading: {
    margin: 1,
    padding: 1,
  },

  textCenter: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 1,
    padding: 1,
  },

  text: {
    margin: 2,
    fontSize: 14,
    textAlign: "left",
    fontFamily: "Times-Roman",
  },
});

const strip = ckHtml => {
  var newText = new DOMParser().parseFromString(ckHtml, "text/html");
  return newText.body.textContent || "";
};

const NoteDetailPDF = props => {
  const user = props.pdfData;
  const note = user.notes;

  _logger("pdf notes", props);
  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>
        <PdfTitle
          title={`${user.userInfo.firstName} ${user.userInfo.lastName}`}
        />
        <View style={styles.section}>
          <Text style={styles.textCenter}>Note Id: {user.id}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Notes:</Text>
            <View style={styles.section}>
              <Text>
                {" "}
                <Text style={styles.text}>{strip(note)}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.text}>
              Created: {moment(user.dateCreated).format("MM-DD-YYYY")}
            </Text>
            <Text style={styles.text}>
              Last Modified: {moment(user.dateModified).format("MM-DD-YYYY")}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

NoteDetailPDF.propTypes = {
  pdfData: PropTypes.shape({
    id: PropTypes.number,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    userInfo: PropTypes.shape({
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      userId: PropTypes.number,
    }),
    notes: PropTypes.string,
  }),
};

export default NoteDetailPDF;
