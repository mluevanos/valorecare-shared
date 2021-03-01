import * as Yup from "yup";



const eventsSchema = Yup.object().shape({
    eventTypeId: Yup.string().required("Please enter a EventTypeId"),
    name: Yup.string().required("Please choose enter a name"),
    summary: Yup.string().required("Please enter a summary"),
    shortDescription: Yup.string().required("Please enter a Short Description"),
    venueId: Yup.string().required("Please enter a venueId"),
    eventStatusId: Yup.string().required("Please enter an eventStatusId"),
    imageUrl: Yup.string().required("Please enter and ImageUrl"),
    externalSiteUrl: Yup.string().required("Please enter an external Url"),
    isFree: Yup.bool().required("Is the Event Free?"),
    dateStart: Yup.date().required("Please choose the START date"),
    dateEnd: Yup.date().required("Please choose the END date"),
});

export default eventsSchema