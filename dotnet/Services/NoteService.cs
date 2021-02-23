using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Notes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class NoteService : INoteService
    {
        IDataProvider _data = null;

        public NoteService(IDataProvider data)
        {
            _data = data;

        }

        //GET/SEARCH All Seeker Names - form dropdown
        public List<BaseUserProfile> GetAllSeekerNames(int providerId)
        {
            List<BaseUserProfile> listOfSeekers = null;
            string procName = "dbo.Appointments_GetSeekersNameBy_ProviderId";

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@ProviderId", providerId);
                },
                (reader, recordSetIndex) =>
                {
                    BaseUserProfile aSeeker = new BaseUserProfile();
                    int startingIndex = 0;

                    aSeeker.UserId = reader.GetSafeInt32(startingIndex++);
                    aSeeker.FirstName = reader.GetSafeString(startingIndex++);
                    aSeeker.LastName = reader.GetSafeString(startingIndex++);

                    if (listOfSeekers == null)
                    {
                        listOfSeekers = new List<BaseUserProfile>();
                    }
                    listOfSeekers.Add(aSeeker);
                });

            return listOfSeekers;
        }

        public List<BaseUserProfile> SearchSeeker(int providerId, string searchQuery)
        {
            string procName = "[dbo].[Appointments_SearchBySeekerName]";
            List<BaseUserProfile> listOfSeekers = null;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@ProviderId", providerId);
                    param.AddWithValue("@SearchQ", searchQuery);
                },
                (reader, recordSetIndex) =>
                {
                    BaseUserProfile aSeeker = new BaseUserProfile();
                    int startingIndex = 0;

                    aSeeker.UserId = reader.GetSafeInt32(startingIndex++);
                    aSeeker.FirstName = reader.GetSafeString(startingIndex++);
                    aSeeker.LastName = reader.GetSafeString(startingIndex++);

                    if (listOfSeekers == null)
                    {
                        listOfSeekers = new List<BaseUserProfile>();
                    }
                    listOfSeekers.Add(aSeeker);
                });

            return listOfSeekers;
        }

        //SEARCH Notes By Seeker/Provider
        public Paged<Note> SearchNotesBySeeker(int userId, string searchQuery, int pageIndex, int pageSize)
        {
            Paged<Note> pagedList = null;
            List<Note> listResult = null;
            int totalCount = 0;

            string procName = "[dbo].[Notes_SearchBySeekerNameV2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@ProviderId", userId);
                paramCollection.AddWithValue("@SearchQ", searchQuery);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Note aNote = MapNote(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(LastColumn);
                    }
                    if (listResult == null)
                    {
                        listResult = new List<Note>();
                    }
                    listResult.Add(aNote);
                });
            {
                pagedList = new Paged<Note>(listResult, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<Note> SearchNotesByProvider(int userId, string searchQuery, int pageIndex, int pageSize)
        {
            Paged<Note> pagedList = null;
            List<Note> listResult = null;
            int totalCount = 0;

            string procName = "dbo.Notes_SearchByProviderName";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@SeekerId", userId);
                paramCollection.AddWithValue("@SearchQ", searchQuery);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Note aNote = MapNote(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(LastColumn);
                    }
                    if (listResult == null)
                    {
                        listResult = new List<Note>();
                    }
                    listResult.Add(aNote);
                });
            {
                pagedList = new Paged<Note>(listResult, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }


        //GET Note by ID, GET Notes Created By, GET Notes, GET Notes by Seeker ID
        public Note Get(int id)
        {
            string procName = "dbo.Notes_SelectByIdV2";
            Note aNote = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
                {
                    aNote = new Note();
                    int startingIndex = 0;

                    aNote.Id = reader.GetSafeInt32(startingIndex++);
                    aNote.Notes = reader.GetSafeString(startingIndex++);
                    aNote.SeekerId = reader.GetSafeInt32(startingIndex++);
                    aNote.TagId = reader.GetSafeInt32(startingIndex++);
                });

            return aNote;
        }

        public Paged<Note> GetNotesCreatedBy(int userId, int pageIndex, int pageSize)
        {
            Paged<Note> pagedList = null;
            List<Note> listResult = null;
            int totalCount = 0;

            string procName = "[dbo].[Notes_Select_ByCreatedBy_V2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", userId);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Note aNote = MapNote(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(LastColumn);
                    }
                    if (listResult == null)
                    {
                        listResult = new List<Note>();
                    }
                    listResult.Add(aNote);
                });
            {
                pagedList = new Paged<Note>(listResult, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<Note> GetPaginate(int pageIndex, int pageSize)
        {
            Paged<Note> pagedList = null;
            List<Note> listResult = null;
            int totalCount = 0;

            string procName = "[dbo].[Notes_SelectAll]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@pageIndex", pageIndex);
                paramCollection.AddWithValue("@pageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Note aNote = MapNote(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(7);
                    }
                    if (listResult == null)
                    {
                        listResult = new List<Note>();
                    }
                    listResult.Add(aNote);
                });
            {
                pagedList = new Paged<Note>(listResult, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<Note> GetBySeekerId(int userId, int pageIndex, int pageSize)
        {
            Paged<Note> pagedList = null;
            List<Note> listResult = null;
            int totalCount = 0;

            string procName = "[dbo].[Notes_Select_BySeekerId_V2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@SeekerId", userId);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
                {
                    Note aNote = MapNote(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(LastColumn);
                    }
                    if (listResult == null)
                    {
                        listResult = new List<Note>();
                    }
                    listResult.Add(aNote);
                });
            {
                pagedList = new Paged<Note>(listResult, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }


        //ADD, UPDATE, DELETE Note
        public int Add(AddNoteRequest model, int createdById)
        {
            int id = 0;
            string procName = "[dbo].[Notes_Insert]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                MapNoteAddRequest(model, createdById, col);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void Update(UpdateNoteRequest model, int createdById)
        {
            string procName = "[dbo].[Notes_Update]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                MapNoteAddRequest(model, createdById, col);
                col.AddWithValue("@Id", model.Id);
            }, 
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Notes_Delete_ById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
                returnParameters: null);
        }


 

        private static int LastColumn = 0;
        private static Note MapNote(IDataReader reader)
        {
            int startingIndex = 0;
            Note aNote = new Note();
            aNote.Id = reader.GetSafeInt32(startingIndex++);

            aNote.UserInfo = new BaseUserProfile();
            aNote.UserInfo.FirstName = reader.GetSafeString(startingIndex++);
            aNote.UserInfo.LastName = reader.GetSafeString(startingIndex++);

            aNote.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aNote.Notes = reader.GetSafeString(startingIndex++);
            aNote.TagId = reader.GetSafeInt32Nullable(startingIndex++);
            aNote.DateCreated = reader.GetDateTime(startingIndex++);

            if (LastColumn == 0)
                LastColumn = startingIndex;

            return aNote;
        }

        private static void MapNoteAddRequest(AddNoteRequest model, int createdById, SqlParameterCollection col)
        {
            col.AddWithValue("@Notes", model.Notes);
            col.AddWithValue("@SeekerId", model.SeekerId);
            col.AddWithValue("@TagId", model.TagId);
            col.AddWithValue("@CreatedBy", createdById);
        }
    }
}
