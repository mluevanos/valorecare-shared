using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Notes;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface INoteService
    {
        //GET/SEARCH All Seeker Names - form dropdown
        List<BaseUserProfile> GetAllSeekerNames(int providerId);
        List<BaseUserProfile> SearchSeeker(int providerUserId, string searchQuery);

        //SEARCH Notes By Seeker/Provider
        Paged<Note> SearchNotesBySeeker(int userId, string searchQuery, int pageIndex, int pageSize);
        Paged<Note> SearchNotesByProvider(int userId, string searchQuery, int pageIndex, int pageSize);

        //GET Note by ID, GET Notes Created By, GET Notes, GET Notes by Seeker ID
        Note Get(int id);
        Paged<Note> GetNotesCreatedBy(int id, int pageIndex, int pageSize);
        Paged<Note> GetPaginate(int pageIndex, int pageSize);
        Paged<Note> GetBySeekerId(int userId, int pageIndex, int pageSize);

        //ADD, UPDATE, DELETE Note
        int Add(AddNoteRequest model, int createdById);
        void Update(UpdateNoteRequest model, int createdById);
        void Delete(int id);

    }
}