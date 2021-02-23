using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.EventV2;
using Sabio.Models.Domain.LookUp;
using Sabio.Models.Domain.Venues;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Event;
using Stripe;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Event = Sabio.Models.Domain.Event;

namespace Sabio.Services
{
    public class EventService : IEventService
    {
        IDataProvider _data = null;


        public EventService(IDataProvider data)
        {
            _data = data;
        }


        //SEARCH Events 
        public Paged<Event> SearchPaginated(string query, int pageIndex, int pageSize)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Events_SearchPaginated]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection inputCollection)
            {
                inputCollection.AddWithValue("@PageIndex", pageIndex);
                inputCollection.AddWithValue("@PageSize", pageSize);
                inputCollection.AddWithValue("@Query", query);
            }, delegate (IDataReader reader, short set)
                {
                    Event aEvent = new Event();

                    int startingIndex = 0;
                    aEvent.Id = reader.GetSafeInt32(startingIndex++);
                    aEvent.Name = reader.GetSafeString(startingIndex++);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(2);
                    }
                    if (list == null)
                    {
                        list = new List<Event>();
                    }
                    list.Add(aEvent);
                });
            { 
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        //SEARCH EventV2 info, GET EventV2 details, GET ALL EventV2 instances
        //(EventV2 is if paid event)
        public Paged<EventV2> SearchPaginatedV2(int pageIndex, int pageSize, string query, int userId)
        {
            string procName = "[dbo].[Events_SearchPaginated_V2]";
            Paged<EventV2> pagedList = null;
            List<EventV2> list = null;
            int totalCount = 0;

            if (query == null)
            {
                query = " ";
            }

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection inputCollection)
            {
                inputCollection.AddWithValue("@PageIndex", pageIndex);
                inputCollection.AddWithValue("@PageSize", pageSize);
                inputCollection.AddWithValue("@UserId", userId);
                inputCollection.AddWithValue("@Query", query);
            }, delegate (IDataReader reader, short set)
                {
                    EventV2 valoreevent;
                    int startingIndex;
                    eventV2Mapper(reader, out valoreevent, out startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<EventV2>();
                    } 
                    list.Add(valoreevent);
                });
            {
                pagedList = new Paged<EventV2>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public EventV2 Details(int id, int userId)
        {
            string procName = "[dbo].[Events_SelectDetails_ById_V3]";
            EventV2 valoreevent = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
                parameterCollection.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
                {
                    valoreevent = new EventV2();
                    int startingIndex;
                    eventV2Mapper(reader, out valoreevent, out startingIndex);
                });

            return valoreevent;
        }


        public Paged<EventV2> GetPaginated(int pageIndex, int pageSize, int userId)
        {
            Paged<EventV2> pagedList = null;
            List<EventV2> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Events_SelectAllPaginated]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection inputCollection)
            {
                inputCollection.AddWithValue("@PageIndex", pageIndex);
                inputCollection.AddWithValue("@PageSize", pageSize);
                inputCollection.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
                {
                    EventV2 valoreevent;
                    int startingIndex;
                    eventV2Mapper(reader, out valoreevent, out startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<EventV2>();
                    } 
                    list.Add(valoreevent);
                });
            {
                pagedList = new Paged<EventV2>(list, pageIndex, pageSize, totalCount);
            }
                
            return pagedList;
        }


        //GET ALL Events, GET Event by ID, GET ALL Event Details
        public Paged<Event> Pagination(int pageIndex, int pageSize)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0; 

            _data.ExecuteCmd("[dbo].[Events_Pagination]",
                (param) =>
                {
                    param.AddWithValue("@pageIndex", pageIndex);
                    param.AddWithValue("@pageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    Event aEvent = EventMapper(reader);

                    if (totalCount == 0)
                    {
                       totalCount = reader.GetSafeInt32(12);
                    }
                    if (list == null)
                    {
                       list = new List<Event>();
                    }
                    list.Add(aEvent);
                });
            {
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Event Get(int id)
        {
            string procName = "[dbo].[Events_SelectById]";
            Event aEvent = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
                {
                    aEvent = EventMapper(reader);
                });

            return aEvent;
        }

        public Paged<Event> SelectDetails(int pageIndex, int pageSize)
        {
            Paged<Event> pagedList = null;
            List<Event> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Events_SelectAllDetails_V3]",
                (param) =>
                {
                    param.AddWithValue("@pageIndex", pageIndex);
                    param.AddWithValue("@pageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    Event aEvent = EventMapper(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(15);
                    }
                    if (list == null)
                    {
                        list = new List<Event>();
                    }
                    list.Add(aEvent);
                });
            {
                pagedList = new Paged<Event>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        //ADD & DELETE Event
        public int Add(EventAddRequest model, int userId)
        {
            int id = 0;
            DataTable dataTable = new DataTable();
            string procName = "[dbo].[Events_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                EventParamMapper(model, col);

                SqlParameter idOut = new SqlParameter("@id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void Delete(int id)
        {
            deleteStripeProductFromEventId(id);
            string procName = "[dbo].[Events_Delete]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, returnParameters: null);
        }


        //ADD & DELETE Event Participant
        public int ParticipantAdd(EventParticipantAdd model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[EventParticipants_Insert]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@EventId", model.EventId);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@ParticipantTypeId", 2);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void ParticipantRemove(EventParticipantAdd model, int userId)
        {
            string procName = "[dbo].[EventParticipants_Delete]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection inputCollection)
             {
                 inputCollection.AddWithValue("@EventId", model.EventId);
                 inputCollection.AddWithValue("@UserId", userId);
             }, null);
        }

        //WIZARD related ADD & UPDATE
        public int WizardAdd(EventWizardAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[EventWizard_Insert]";
            Product product = null;
            Price price = null;

            if (model.Price > 0)
            {
                string productName = "ValoreEvents_" + model.Name;
                product = CreateStripeProduct(productName);
                price = CreateStripeProductPrice(product.Id, model.Price * 100);
            }

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                EventWizardParamMapper(model, col, userId, product, price);
                SqlParameter idOut = new SqlParameter("@OutputId", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@OutputId"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public void WizardUpdate(EventWizardUpdateRequest model, int userId)
        {
            string procName = "[dbo].[EventWizard_Update]";
            Product product = null;
            Price price = null;

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                EventWizardParamMapper(model, col, userId, product, price);
                col.AddWithValue("@EventId", model.Id);
            }, null);
        }



        //GET Event by Type or Status
        public List<Event> GetByType()
        {
            List<Event> list = null;
            string procName = "[dbo].[EventTypes_SelectAll]";

            _data.ExecuteCmd(procName, delegate (IDataReader reader, short set)
            {
                Event aEvent = new Event();
                int stardingIdex = 0;
                aEvent.Id = reader.GetSafeInt32(stardingIdex++);
                aEvent.Name = reader.GetSafeString(stardingIdex++);

                if (list == null)
                {
                    list = new List<Event>();
                }
                list.Add(aEvent);
            });

            return list;
        }


        public List<Event> GetByStatus()
        {
            List<Event> list = null;
            string procName = "[dbo].[EventStatus_SelectAll_V2]";

            _data.ExecuteCmd(procName, delegate (IDataReader reader, short set)
            {
                Event aEvent = new Event();
                int stardingIdex = 0;
                aEvent.Id = reader.GetSafeInt32(stardingIdex++);
                aEvent.Name = reader.GetSafeString(stardingIdex++);

                if (list == null)
                {
                    list = new List<Event>();
                }
                list.Add(aEvent);
            });

            return list;
        }



        private static void EventParamMapper(EventAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@EventTypeId", model.EventTypeId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@ShortDescription", model.ShortDescription);
            col.AddWithValue("@VenueId", model.VenueId);
            col.AddWithValue("@EventStatusId", model.EventStatusId);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@ExternalSiteUrl", model.ExternalSiteUrl);
            col.AddWithValue("@IsFree", model.IsFree);
            col.AddWithValue("@DateStart", model.DateStart);
            col.AddWithValue("@DateEnd", model.DateEnd);

        }

        private static void EventWizardParamMapper(EventWizardAddRequest model, SqlParameterCollection col, int userId, Product product, Price price)
        {
            //Event
            col.AddWithValue("@EventTypeId", model.EventTypeId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@ShortDescription", model.ShortDescription);
            col.AddWithValue("@EventStatusId", model.EventStatusId);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@ExternalSiteUrl", model.ExternalSiteUrl);
            col.AddWithValue("@IsFree", model.IsFree);
            col.AddWithValue("@DateStart", model.DateStart);
            col.AddWithValue("@DateEnd", model.DateEnd);
            col.AddWithValue("@Price", model.Price);
            col.AddWithValue("@Capacity", model.Capacity);
            //Location
            col.AddWithValue("@LocationTypeId", model.LocationTypeId);
            col.AddWithValue("@LocationLineOne", model.LocationLineOne);
            col.AddWithValue("@LocationLineTwo", model.LocationLineTwo);
            col.AddWithValue("@LocationCity", model.LocationCity);
            col.AddWithValue("@LocationZip", model.LocationZip);
            col.AddWithValue("@LocationStateId", model.LocationStateId);
            col.AddWithValue("@LocationLatitude", model.LocationLatitude);
            col.AddWithValue("@LocationLongitude", model.LocationLongitude);
            //Venue
            col.AddWithValue("@VenueId", model.VenueId);
            col.AddWithValue("@VenueName", model.VenueName);
            col.AddWithValue("@VenueDescription", model.VenueDescription);
            col.AddWithValue("@VenueLocationId", model.VenueLocationId);
            col.AddWithValue("@VenueUrl", model.VenueUrl);
            //User
            col.AddWithValue("@UserId", userId);
            //PaymentInfo
            if (model.Price > 0)
            {
                col.AddWithValue("@StripeProductId", product.Id);
                col.AddWithValue("@StripePriceId", price.Id);
            }
            else
            {
                col.AddWithValue("@StripeProductId", null);
                col.AddWithValue("@StripePriceId", null);
            }
        }

        private const string StripeKey = "sk_test_51GsHsuIWWaJ3XO7i5hD7ARW32cP4dBE5mmg7LWY13BekKFf43tzKWIgRAJKPp0si6C6vV7cXLtOYN1NcBhIjAx5u00EyQdVmo9";
        private Stripe.Product CreateStripeProduct(string productName)
        {
            StripeConfiguration.ApiKey = StripeKey;
            var options = new ProductCreateOptions
            {
                Name = productName,
            };
            var service = new ProductService();
            var product = service.Create(options);
            return product;
        }

        private Stripe.Price CreateStripeProductPrice(string productId, long price)
        {
            StripeConfiguration.ApiKey = StripeKey;
            var options = new PriceCreateOptions
            {
                UnitAmount = price,
                Currency = "usd",
                Product = productId,
            };
            var service = new PriceService();
            var stripePrice = service.Create(options);
            return stripePrice;
        }


        private static EventV2 eventV2Mapper(IDataReader reader, out EventV2 valoreevent, out int startingIndex)
        {
            valoreevent = new EventV2();
            startingIndex = 0;
            valoreevent.Id = reader.GetSafeInt32(startingIndex++);
            valoreevent.Name = reader.GetSafeString(startingIndex++);
            valoreevent.Summary = reader.GetSafeString(startingIndex++);
            valoreevent.ShortDescription = reader.GetSafeString(startingIndex++);
            valoreevent.ImageUrl = reader.GetSafeString(startingIndex++);
            valoreevent.ExternalSiteUrl = reader.GetSafeString(startingIndex++);
            valoreevent.IsFree = reader.GetSafeBool(startingIndex++);
            valoreevent.DateCreated = reader.GetSafeDateTime(startingIndex++);
            valoreevent.DateModified = reader.GetSafeDateTime(startingIndex++);
            valoreevent.DateStart = reader.GetSafeDateTime(startingIndex++);
            valoreevent.DateEnd = reader.GetSafeDateTime(startingIndex++);
            valoreevent.Capacity = reader.GetSafeInt32Nullable(startingIndex++);
            valoreevent.Price = reader.GetSafeInt64(startingIndex++);
            valoreevent.StripeProductId = reader.GetSafeString(startingIndex++);
            valoreevent.StripePriceId = reader.GetSafeString(startingIndex++);
            valoreevent.ParticipantUserId = reader.GetSafeInt32Nullable(startingIndex++);
            valoreevent.EventType = new EventType();
            valoreevent.EventType.Id = reader.GetSafeInt32(startingIndex++);
            valoreevent.EventType.Name = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2 = new VenuesV2();
            valoreevent.VenueV2.Id = reader.GetSafeInt32(startingIndex++);
            valoreevent.VenueV2.Name = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Description = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Url = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location = new Location();
            valoreevent.VenueV2.Location.Id = reader.GetSafeInt32(startingIndex++);
            valoreevent.VenueV2.Location.LineOne = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location.LineTwo = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location.City = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location.Zip = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location.State = new TwoColumn();
            valoreevent.VenueV2.Location.State.Id = reader.GetSafeInt32(startingIndex++);
            valoreevent.VenueV2.Location.State.Name = reader.GetSafeString(startingIndex++);
            valoreevent.VenueV2.Location.Latitude = reader.GetSafeDouble(startingIndex++);
            valoreevent.VenueV2.Location.Longitude = reader.GetSafeDouble(startingIndex++);
            valoreevent.VenueV2.Location.LocationType = new TwoColumn();
            valoreevent.VenueV2.Location.LocationType.Id = reader.GetSafeInt32(startingIndex++);

            return valoreevent;
        }


        private static Event EventMapper(IDataReader reader)
        {
            Event aEvent = new Event();
            int stardingIdex = 0;
            aEvent.Id = reader.GetSafeInt32(stardingIdex++);
            aEvent.EventTypeId = reader.GetSafeInt32(stardingIdex++);
            aEvent.Name = reader.GetSafeString(stardingIdex++);
            aEvent.Summary = reader.GetSafeString(stardingIdex++);
            aEvent.ShortDescription = reader.GetSafeString(stardingIdex++);
            aEvent.VenueId = reader.GetSafeInt32(stardingIdex++);
            aEvent.EventStatusId = reader.GetSafeInt32(stardingIdex++);
            aEvent.ImageUrl = reader.GetSafeString(stardingIdex++);
            aEvent.ExternalSiteUrl = reader.GetSafeString(stardingIdex++);
            aEvent.IsFree = reader.GetSafeBool(stardingIdex++);
            aEvent.DateStart = reader.GetSafeDateTime(stardingIdex++);
            aEvent.DateEnd = reader.GetSafeDateTime(stardingIdex++);
            return aEvent;
        }


    }
}
