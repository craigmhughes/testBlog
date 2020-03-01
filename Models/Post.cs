using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestBlog.Models
{
    public class Post
    {
        public long Id { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string Title { get; set; }

        [Required]
        // Not sure how relationships are defined at this point.
        // Current solution = store User Name as string
        // TODO: Define relationship between user and posts
        public string Author { get; set; }

        [Required]
        public DateTime PostedAt { get; set; }

        //[Required]
        //public string Description { get; set; }

        [Required]
        [Column(TypeName = "ntext")]
        public string Body { get; set; }
    }
}
