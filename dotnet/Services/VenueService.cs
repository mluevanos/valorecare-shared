using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Venues;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Venues;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class VenuesService : IVenuesService
    {
        IDataProvider _data = null;

        public VenuesService(IDataProvider data)
        {
            _data = data;
        }

        //SEARCH Venues
        public Paged<VenuesV2> SearchV2(int pageIndex, int pageSize, string query)
        {
            Paged<VenuesV2> pagedVenues = null;
            List<VenuesV2> venueList = null;
            int totalCount = 0;

            string procName = "[dbo].[Venues_SearchV2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paginationParams)
            {
                paginationParams.AddWithValue("@pageIndex", pageIndex);
                paginationParams.AddWithValue("@pageSize", pageSize);
                paginationParams.AddWithValue("@query", query);
            }, delegate (IDataReader reader, short set)
                {
                    VenuesV2 aVenue = MapVenueV2(reader, out int index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }
                    if (venueList == null)
                    {
                        venueList = new List<VenuesV2>();
                    }
                    venueList.Add(aVenue);
                });
            {
                pagedVenues = new Paged<VenuesV2>(venueList, pageIndex, pageSize, totalCount);
            }

            return pagedVenues;
        }

        public List<Venue> SearchVenue(string name)
        {
            string procName = "[dbo].[Venues_Search_TwoCol]";
            List<Venue> listOfVenues = null;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@name", name);
                },
                (reader, recordSetIndex) =>
                {
                    Venue venue = new Venue();
                    int startingIndex = 0;

                    venue.Id = reader.GetSafeInt32(startingIndex++);
                    venue.Name = reader.GetSafeString(startingIndex++);

                    if (listOfVenues == null)
                    {
                        listOfVenues = new List<Venue>();
                    }
                    listOfVenues.Add(venue);
                });

            return listOfVenues;
        }


        //GET All Venues, GET Venue by ID, GET by creator ID
        public Paged<Venue> PaginateV2(int pageIndex, int pageSize)
        {
            Paged<Venue> pagedVenues = null;
            List<Venue> venueList = null;
            int totalCount = 0;

            string procName = "[dbo].[Venues_SelectAllPaginated_V2]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paginationParams)
            {
                paginationParams.AddWithValue("@pageIndex", pageIndex);
                paginationParams.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Venue aVenue = MapVenueV3(reader, out int index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }
                    if (venueList == null)
                    {
                        venueList = new List<Venue>();
                    }
                    venueList.Add(aVenue);
                });
            {
                pagedVenues = new Paged<Venue>(venueList, pageIndex, pageSize, totalCount);
            }

            return pagedVenues;
        }

        public Venue GetById(int id)
        {
            string procName = "[dbo].[Venues_Select_ById]";
            Venue aVenue = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
             {
                 paramCollection.AddWithValue("@Id", id);
             }, delegate (IDataReader reader, short set)
             {
                 aVenue = MapVenue(reader, out int index);
             });

            return aVenue;
        }

        public Paged<Venue> SelectByCreatorId(int creatorId, int pageIndex, int pageSize)
        {
            Paged<Venue> pagedList = null;
            List<Venue> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Venues_SelectBy_CreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@createdBy", creatorId);
                    paramCollection.AddWithValue("@pageIndex", pageIndex);
                    paramCollection.AddWithValue("@pageSize", pageSize);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                    {
                        Venue aVenue = MapVenue(reader, out int index);

                        if (totalCount == 0)
                        {
                            totalCount = reader.GetSafeInt32(index);
                        }
                        if (list == null)
                        {
                            list = new List<Venue>();
                        }
                        list.Add(aVenue);
                    });
            {
                pagedList = new Paged<Venue>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }


        //ADD, UPDATE, DELETE Venues
        public int Add(VenueAddRequest request, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Venues_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Name", request.Name);
                collection.AddWithValue("@Description", request.Description);
                collection.AddWithValue("@LocationId", request.LocationId);
                collection.AddWithValue("@Url", request.Url);
                collection.AddWithValue("@CreatedBy", userId);
                collection.AddWithValue("@ModifiedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void Update(VenueUpdateRequest request, int userId)
        {
            string procName = "[dbo].[Venues_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Id", request.Id);
                    collection.AddWithValue("@Name", request.Name);
                    collection.AddWithValue("@Description", request.Description);
                    collection.AddWithValue("@LocationId", request.LocationId);
                    collection.AddWithValue("@Url", request.Url);
                    collection.AddWithValue("@ModifiedBy", userId);
                },returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Venues_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
                returnParameters: null);
        }

        private static Venue MapVenue(IDataReader reader, out int startingIndex)
        {
            Venue aVenue = new Venue();
            startingIndex = 0;

            aVenue.Id = reader.GetSafeInt32(startingIndex++);
            aVenue.Name = reader.GetSafeString(startingIndex++);
            aVenue.Description = reader.GetSafeString(startingIndex++);
            aVenue.LocationId = reader.GetSafeInt32(startingIndex++);
            aVenue.Url = reader.GetSafeString(startingIndex++);
            aVenue.CreatedBy = new BaseUserProfile();
            aVenue.CreatedBy.UserId = reader.GetSafeInt32(startingIndex++);
            aVenue.ModifiedBy = new BaseUserProfile();
            aVenue.ModifiedBy.UserId = reader.GetSafeInt32(startingIndex++);
            aVenue.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            aVenue.DateModified = reader.GetSafeUtcDateTime(startingIndex++);

            return aVenue;
        }

        private static VenuesV2 MapVenueV2(IDataReader reader, out int startingIndex)
        {
            VenuesV2 aVenue = new VenuesV2();
            startingIndex = 0;

            aVenue.Id = reader.GetSafeInt32(startingIndex++);
            aVenue.Name = reader.GetSafeString(startingIndex++);
            aVenue.Description = reader.GetSafeString(startingIndex++);
            Location location = new Location();
            location.Id = reader.GetSafeInt32(startingIndex++);
            location.LocationType = new Models.Domain.LookUp.TwoColumn();
            location.LocationType.Id = reader.GetSafeInt32(startingIndex++);
            location.LocationType.Name = reader.GetSafeString(startingIndex++);
            location.LineOne = reader.GetSafeString(startingIndex++);
            location.LineTwo = reader.GetSafeString(startingIndex++);
            location.City = reader.GetSafeString(startingIndex++);
            location.Zip = reader.GetSafeString(startingIndex++);
            location.State = new Models.Domain.LookUp.TwoColumn();
            location.State.Id = reader.GetSafeInt32(startingIndex++);
            location.State.Name = reader.GetSafeString(startingIndex++);
            location.Latitude = reader.GetSafeDouble(startingIndex++);
            location.Longitude = reader.GetSafeDouble(startingIndex++);
            location.DateModified = reader.GetSafeDateTime(startingIndex++);
            location.DateAdded = reader.GetSafeDateTime(startingIndex++);
            location.CreatedBy = new UserProfile();
            location.CreatedBy.UserId = reader.GetSafeInt32(startingIndex++);
            aVenue.Location = location;
            aVenue.Url = reader.GetSafeString(startingIndex++);
            aVenue.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aVenue.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aVenue.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            aVenue.DateModified = reader.GetSafeUtcDateTime(startingIndex++);

            return aVenue;
        }
        private static Venue MapVenueV3(IDataReader reader, out int startingIndex)
        {
            Venue venue = new Venue();
            startingIndex = 0;

            venue.Id = reader.GetSafeInt32(startingIndex++);
            venue.Name = reader.GetSafeString(startingIndex++);
            venue.Description = reader.GetSafeString(startingIndex++);

            venue.Location = new Location();
            venue.LocationId = reader.GetSafeInt32(startingIndex++);
            venue.Location.LineOne = reader.GetSafeString(startingIndex++);
            venue.Location.LineTwo = reader.GetSafeString(startingIndex++);
            venue.Location.City = reader.GetSafeString(startingIndex++);
            venue.Location.Zip = reader.GetSafeString(startingIndex++);

            venue.Url = reader.GetSafeString(startingIndex++);

            venue.CreatedBy = new BaseUserProfile();
            venue.CreatedBy.UserId = reader.GetSafeInt32(startingIndex++);
            venue.CreatedBy.FirstName = reader.GetSafeString(startingIndex++);
            venue.CreatedBy.LastName = reader.GetSafeString(startingIndex++);

            venue.ModifiedBy = new BaseUserProfile();
            venue.ModifiedBy.UserId = reader.GetSafeInt32(startingIndex++);
            venue.ModifiedBy.FirstName = reader.GetSafeString(startingIndex++);
            venue.ModifiedBy.LastName = reader.GetSafeString(startingIndex++);

            venue.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            venue.DateModified = reader.GetSafeUtcDateTime(startingIndex++);

            return venue;
        }
    }
    }
