using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterCraftRepairs.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Tasks;
//using MasterCraftRepairs.WebAPI.Models;


namespace MasterCraftRepairs.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        public TestController()
        {
        }

        [HttpGet("test")]
        public ActionResult<string> GetTModels()
        {
            return Ok(new { message = "lslalal", status = "success" });
        }
    }
}