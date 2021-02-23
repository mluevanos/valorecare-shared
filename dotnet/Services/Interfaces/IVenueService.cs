using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Venues;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Venues;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services
{
    public interface IVenuesService

    {
        //SEARCH Venues
        Paged<VenuesV2> SearchV2(int pageIndex, int pageSize, string query);
        List<Venue> SearchVenue(string name);

        //GET All Venues, GET Venue by ID, GET by creator ID
        Paged<Venue> PaginateV2(int pageIndex, int pageSize);
        Venue GetById(int id);
        Paged<Venue> SelectByCreatorId(int creatorId, int pageIndex, int pageSize);

        //ADD, UPDATE, DELETE Venues
        int Add(VenueAddRequest request, int userId);
        void Update(VenueUpdateRequest request, int userId);
        void Delete(int id);

    }
}
