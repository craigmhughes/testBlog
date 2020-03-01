﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestBlog.Data;
using TestBlog.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestBlog.Controllers
{
    [ApiController]
    [Route("Posts")]
    public class PostsController : Controller
    {
        private readonly ApplicationDbContext _db;

        public PostsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var posts = _db.Posts.OrderByDescending(x => x.Id).ToArray();
            return Ok(new { posts = posts });
        }

        //[HttpGet]
        //[Route("User/{name}")]
        //public IActionResult GetUsersPosts(string name)
        //{
        //    var posts = _db.Posts.Where(x => x.Author == name).OrderByDescending(x => x.Id).ToArray();
        //    return Ok(new { posts = posts });
        //}

        [HttpPost]
        public IActionResult Post([FromBody] Post postReq)
        {
            Post post = new Post();
            post = postReq;
            post.PostedAt = DateTime.Now;

            _db.Posts.Add(post);
            _db.SaveChanges();

            return Ok(new { post = post });
        }
    }
}
