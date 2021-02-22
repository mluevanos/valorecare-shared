using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Venues;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Venues;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Services.Interfaces;
using Sabio.Web.Models.Responses;
using Amazon.Runtime.Internal.Util;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/venues")]
    [ApiController]
    public class VenueApiController : BaseApiController
    {
        private IVenuesService _service = null;
        private IAuthenticationService<int> _authService = null;
        


        public VenueApiController(IVenuesService service
            , ILogger<VenueApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
         

        }

        //GET
        [HttpGet("search")]
        public ActionResult<ItemsResponse<Venue>> SearchVenue(string name)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Venue> search = _service.SearchVenue(name);

                if (search == null)
                {
                    code = 404;
                    response = new ErrorResponse("Item was not found");
                }
                else
                {
                    response = new ItemsResponse<Venue> { Items = search };
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

        [HttpGet("paginateV2")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Venue>>> PaginationV2(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Venue> paged = _service.PaginateV2(pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Venue Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Venue>> { Item = paged };
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

        [HttpGet("searchv2")]
        public ActionResult<ItemResponse<Paged<VenuesV2>>> SearchV2(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<VenuesV2> paged = _service.SearchV2(pageIndex, pageSize, query);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Venue Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<VenuesV2>> { Item = paged };
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
        public ActionResult<ItemResponse<Venue>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Venue aVenue = _service.GetById(id);

                if (aVenue == null)
                {
                    code = 404;
                    response = new ErrorResponse("Venue Not Found");
                }
                else
                {
                    response = new ItemResponse<Venue> { Item = aVenue };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Server Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("createdby{id:int}")]
        public ActionResult<ItemResponse<Paged<Venue>>> SelectByCreatorId(int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Venue> paged = _service.SelectByCreatorId(id, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Venue Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Venue>> { Item = paged };
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

        //PUT
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(VenueUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception exception)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
                base.Logger.LogError(exception.ToString());
            }

            return StatusCode(code, response);
        }

        //POST
        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Add(VenueAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                response = new ItemResponse<int>() { Item = id }; 
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
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

            return StatusCode(responseCode, response);
        }

    }
}