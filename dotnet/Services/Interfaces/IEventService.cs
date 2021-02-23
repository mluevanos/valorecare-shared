using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.EventV2;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Event;
using Stripe;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using Event = Sabio.Models.Domain.Event;

namespace Sabio.Services
{
    public interface IEventService
    {

        //SEARCH Events 
        Paged<Event> SearchPaginated(string query, int pageIndex, int pageSize);

        //SEARCH EventV2 info, GET EventV2 details, GET ALL EventV2 instances
        //(EventV2 is if paid event)
        Paged<EventV2> SearchPaginatedV2(int pageIndex, int pageSize, string query, int userId);
        EventV2 Details(int id, int userId);
        Paged<EventV2> GetPaginated(int pageIndex, int pageSize, int userId);

        //GET ALL Events, GET Event by ID, GET ALL Event Details
        Paged<Event> Pagination(int pageIndex, int pageSize);
        Event Get(int id);
        Paged<Event> SelectDetails(int pageIndex, int pageSize);

        //ADD & DELETE Event
        int Add(EventAddRequest model, int userId);
        void Delete(int Id);

        //ADD & DELETE Event Participant
        int ParticipantAdd(EventParticipantAdd model, int userId);
        void ParticipantRemove(EventParticipantAdd model, int userId);

        //WIZARD related ADD & UPDATE
        void WizardUpdate(EventWizardUpdateRequest model, int userId);
        int WizardAdd(EventWizardAddRequest model, int userId);

        //GET Event by Type or Status
        List<Event> GetByType();
        List<Event> GetByStatus();
        
    }
}
