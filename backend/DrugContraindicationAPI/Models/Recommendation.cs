using System.ComponentModel.DataAnnotations;

namespace DrugContraindicationAPI.Models
{
    public class Recommendation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string OriginalDrugName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string DiseaseName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string RecommendedDrugName { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Reason { get; set; } = string.Empty;

        public int Priority { get; set; } = 1;
    }
}