using System.ComponentModel.DataAnnotations;

namespace DrugContraindicationAPI.DTOs
{
    public class RecommendationRequestDTO
    {
        [Required]
        public string DrugName { get; set; } = string.Empty;

        [Required]
        public string DiseaseName { get; set; } = string.Empty;
    }
}