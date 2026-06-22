using System.ComponentModel.DataAnnotations;

namespace DrugContraindicationAPI.DTOs
{
    public class RecommendationCreateDTO
    {
        [Required]
        public string OriginalDrugName { get; set; } = string.Empty;

        [Required]
        public string DiseaseName { get; set; } = string.Empty;

        [Required]
        public string RecommendedDrugName { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public int Priority { get; set; } = 1;
    }
}