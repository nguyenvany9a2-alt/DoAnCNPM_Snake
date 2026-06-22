using System.ComponentModel.DataAnnotations;

namespace DrugContraindicationAPI.Models
{
    public class History
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string DrugList { get; set; } = string.Empty;

        [Required]
        public string Result { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}