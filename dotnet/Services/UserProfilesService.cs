using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Sabio.Data;
using Sabio.Models.Requests.UserProfiles;
using Sabio.Models;
using System.Reflection.Metadata.Ecma335;

namespace Sabio.Services
{
    public class UserProfilesService : IUserProfilesService
    {
        IDataProvider _data = null;

        public UserProfilesService(IDataProvider data)
        {
            _data = data;
        }

        //SEARCH User Profile
        public Paged<UserProfile> Search(int pageIndex, int pageSize, string searchString)
        {
            Paged<UserProfile> pagedResult = null;
            List<UserProfile> result = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[UserProfiles_Search]", delegate (SqlParameterCollection parameterCollection)
              {
                  parameterCollection.AddWithValue("@pageIndex", pageIndex);
                  parameterCollection.AddWithValue("@pageSize", pageSize);
                  parameterCollection.AddWithValue("@searchString", searchString);
              },
              singleRecordMapper: delegate (IDataReader reader, short set)
                  {
                      UserProfile userProfile = MapUserSearch(reader);

                      if (totalCount == 0)
                      {
                          totalCount = reader.GetSafeInt32(8);
                      }
                      if (result == null)
                      {
                          result = new List<UserProfile>();
                      }
                      result.Add(userProfile);
                  });
            {
                pagedResult = new Paged<UserProfile>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }


        //GET User profile by ID, GET All Profiles & GET By Created By
        public UserProfile Get(int Id)
        {

            string procName = "[dbo].[UserProfiles_Select_ById]";
            UserProfile userProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            }, delegate (IDataReader reader, short set)
                {
                    userProfile = MapUserProfile(reader);
                });

            return userProfile;
        }


        public Paged<UserProfile> GetAll(int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedList = null;
            List<UserProfile> list = null;
            int totalCount = 0;

            string procName = "[dbo].[UserProfiles_SelectAll]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection inputCollection)
                {
                    inputCollection.AddWithValue("@PageIndex", pageIndex);
                    inputCollection.AddWithValue("@PageSize", pageSize);
                }, delegate (IDataReader reader, short set)
                    {

                        UserProfile userProfile = MapUserProfile(reader);
                        if (totalCount == 0)
                            totalCount = reader.GetSafeInt32(10);

                        if (list == null)
                            list = new List<UserProfile>();
                        list.Add(userProfile);
                    });
            {
                pagedList = new Paged<UserProfile>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public UserProfile GetByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            string procName = "[dbo].[UserProfiles_Select_ByCreatedBy]";
            UserProfile userProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
                {
                    userProfile = MapUserProfile(reader);
                });

            return userProfile;
        }


        //ADD User Profile & EDIT User Profile
        public int Add(UserProfileAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[UserProfiles_Insert]";

            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   CommonParams(model, col);

                   SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                   idOut.Direction = ParameterDirection.Output;
                   col.Add(idOut);
               }, returnParameters: delegate (SqlParameterCollection returnCol)
                   {
                       object oId = returnCol["@Id"].Value;
                       int.TryParse(oId.ToString(), out id);
                   });

            return id;
        }

        public void Update(UserProfileUpdateRequest model)
        {
            string procName = "[dbo].[UserProfiles_Update]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                CommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }


        //DELETE User Profile
        public UserProfile Delete(int Id)
        {
            string procName = "[dbo].[UserProfiles_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);
            }, returnParameters: null);
        }


        //Activate User Status
        public void ActivateUser(int id, int statusId)
        {
            string procName = "[dbo].[UserProfiles_UpdateStatus]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@UserStatusId", statusId);
            }, returnParameters: null);
        }




        private static void CommonParams(UserProfileAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Mi", model.Mi);
            col.AddWithValue("@AvatarUrl", model.AvatarUrl);
        }

        private static UserProfile MapUserProfile(IDataReader reader)
        {
            UserProfile userProfile = new UserProfile();

            int startingIndex = 0;

            userProfile.Id = reader.GetSafeInt32(startingIndex++);
            userProfile.UserId = reader.GetSafeInt32(startingIndex++);
            userProfile.FirstName = reader.GetSafeString(startingIndex++);
            userProfile.LastName = reader.GetSafeString(startingIndex++);
            userProfile.Mi = reader.GetSafeString(startingIndex++);
            userProfile.AvatarUrl = reader.GetSafeString(startingIndex++);
            userProfile.DateCreated = reader.GetSafeDateTime(startingIndex++);
            userProfile.DateModified = reader.GetSafeDateTime(startingIndex++);
            userProfile.StatusId = reader.GetSafeInt32(startingIndex++);
            userProfile.Status = reader.GetSafeString(startingIndex++);


            return userProfile;
        }

        private static UserProfile MapUserSearch(IDataReader reader)
        {
            UserProfile userProfile = new UserProfile();

            int startingIndex = 0;

            userProfile.Id = reader.GetSafeInt32(startingIndex++);
            userProfile.UserId = reader.GetSafeInt32(startingIndex++);
            userProfile.FirstName = reader.GetSafeString(startingIndex++);
            userProfile.LastName = reader.GetSafeString(startingIndex++);
            userProfile.Mi = reader.GetSafeString(startingIndex++);
            userProfile.AvatarUrl = reader.GetSafeString(startingIndex++);
            userProfile.DateCreated = reader.GetSafeDateTime(startingIndex++);
            userProfile.DateModified = reader.GetSafeDateTime(startingIndex++);

            return userProfile;
        }

    }
}
