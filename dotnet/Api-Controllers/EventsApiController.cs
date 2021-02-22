using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.EventV2;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Event;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using Event = Sabio.Models.Domain.Event;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/Event")]
    [ApiController]
    public class EventApiController : BaseApiController
    {
        private IEventService _service = null;
        private IAuthenticationService<int> _authService = null;

        public EventApiController(IEventService service
            , ILogger<EventApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        //GET
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<EventV2>>> Pagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<EventV2> paged = _service.GetPaginated(pageIndex, pageSize, userId);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("No events found.");
                }
                else
                {
                    response = new ItemResponse<Paged<EventV2>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Event>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Event anEvent = _service.Get(id);

                if (anEvent == null)
                {
                    code = 404;
                    response = new ErrorResponse("Event not found");
                }
                else
                {
                    response = new ItemResponse<Event> { Item = anEvent };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: $ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("type")]
        public ActionResult<ItemResponse<Event>> GetByType()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Event> list = _service.GetByType();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemsResponse<Event> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("status")]
        public ActionResult<ItemResponse<Event>> GetByStatus()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Event> list = _service.GetByStatus();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemsResponse<Event> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("details/{id:int}")]
        public ActionResult<ItemResponse<EventV2>> Details(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                EventV2 anEvent = _service.Details(id, userId);

                if (anEvent == null)
                {
                    code = 404;
                    response = new ErrorResponse("Event not found");
                }
                else
                {
                    response = new ItemResponse<EventV2> { Item = anEvent };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Event>>> SearchPaginated(string query, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Event> paged = _service.SearchPaginated(query, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Item was not found");
                }
                else
                    response = new ItemResponse<Paged<Event>> { Item = paged };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(exception.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("searchv2")]
        public ActionResult<ItemResponse<Paged<EventV2>>> SearchPaginatedV2(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<EventV2> paged = _service.SearchPaginatedV2(pageIndex, pageSize, query, userId);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Item was not found");
                }
                else
                    response = new ItemResponse<Paged<EventV2>> { Item = paged };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
                base.Logger.LogError(exception.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("details")]
        public ActionResult<ItemResponse<Paged<Event>>> SelectDetails(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Event> anEvent = _service.SelectDetails(pageIndex, pageSize);

                if (anEvent == null)
                {
                    code = 404;
                    response = new ErrorResponse("Event not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Event>> { Item = anEvent };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        //PUT
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(EventWizardUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.WizardUpdate(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        //POST
        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(EventAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost("eventparticipants")]
        public ActionResult<ItemResponse<int>> ParticipantAdd(EventParticipantAdd model)
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.ParticipantAdd(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost("eventparticipantsremove")]
        public ActionResult<SuccessResponse> ParticipantRemove(EventParticipantAdd model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.ParticipantRemove(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost("wizard")]
        public ActionResult<ItemResponse<int>> WizardAdd(EventWizardAddRequest model) 
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.WizardAdd(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        //DELETE
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

    }
}