using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserProfiles;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IUserProfilesService
    {
        //SEARCH User Profile
        Paged<UserProfile> Search(int pageIndex, int pageSize, string searchString);

        //GET User profile by ID, GET All Profiles & GET By Created By
        UserProfile Get(int Id);
        Paged<UserProfile> GetAll(int pageIndex, int pageSize);
        UserProfile GetByCreatedBy(int pageIndex, int pageSize, int userId);

        //ADD User Profile & EDIT User Profile
        int Add(UserProfileAddRequest model);
        void Update(UserProfileUpdateRequest model);

        //DELETE User Profile
        UserProfile Delete(int Id);

        //Activate User Status
        public void ActivateUser(int id, int statusId);

    }
}