using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Notes;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/notes")]
    [ApiController]
    public class NoteApiController : BaseApiController
    {
        private INoteService _service = null;
        private IAuthenticationService<int> _authService = null;

        public NoteApiController(INoteService service
           , ILogger<NoteApiController> logger
           , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        //GET
        [HttpGet("listofseekers")]
        public ActionResult<ItemsResponse<BaseUserProfile>> GetAllSeekerNames()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int providerId = _authService.GetCurrentUserId();
                List<BaseUserProfile> search = _service.GetAllSeekerNames(providerId);

                if (search == null)
                {
                    code = 404;
                    response = new ErrorResponse("Users Not Found");
                }
                else
                {
                    response = new ItemsResponse<BaseUserProfile> { Items = search };
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
        public ActionResult<ItemsResponse<BaseUserProfile>> SearchSeeker(string searchQuery)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int providerId = _authService.GetCurrentUserId();
                List<BaseUserProfile> search = _service.SearchSeeker(providerId, searchQuery);

                if (search == null)
                {
                    code = 404;
                    response = new ErrorResponse("User Not Found");
                }
                else
                {
                    response = new ItemsResponse<BaseUserProfile> { Items = search };
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

        [HttpGet("bysearchingseeker")]
        public ActionResult<ItemResponse<Paged<Note>>> SearchNotesBySeeker(string searchQuery, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Note> paged = _service.SearchNotesBySeeker(userId, searchQuery, pageIndex, pageSize);
                    
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Null Response");
                }
                else
                {
                    response = new ItemResponse<Paged<Note>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("bysearchingprovider")]
        public ActionResult<ItemResponse<Paged<Note>>> SearchNotesByProvider(string searchQuery, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Note> paged = _service.SearchNotesByProvider(userId, searchQuery, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Null Response");
                }
                else
                {
                    response = new ItemResponse<Paged<Note>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Note>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Note aNote = _service.Get(id);

                if (aNote == null)
                {
                    code = 404;
                    response = new ErrorResponse("Note not found");
                }
                else
                {
                    response = new ItemResponse<Note> { Item = aNote };
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

        [HttpGet("createdby")]
        public ActionResult<ItemResponse<Paged<Note>>> GetNotesCreatedBy(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Note> paged = _service.GetNotesCreatedBy(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Null Response");
                }
                else
                {
                    response = new ItemResponse<Paged<Note>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("seeker")]
        public ActionResult<ItemResponse<Paged<Note>>> GetBySeekerId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Note> paged = _service.GetBySeekerId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Null Response");
                }
                else
                {
                    response = new ItemResponse<Paged<Note>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Note>>> GetPaginate(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Note> paged = _service.GetPaginate(pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Null Response");
                }
                else
                {
                    response = new ItemResponse<Paged<Note>> { Item = paged };
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

        //PUT
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(UpdateNoteRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
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
        public ActionResult<ItemResponse<int>> Add(AddNoteRequest model)
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