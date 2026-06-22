namespace DrugContraindicationAPI.DTOs
{
    public class RecommendedDrugDTO
    {
        public string DrugName { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public int Priority { get; set; }
    }

    public class RecommendationResultDTO
    {
        public string OriginalDrugName { get; set; } = string.Empty;

        public string DiseaseName { get; set; } = string.Empty;

        public bool HasRecommendation { get; set; }

        public string Message { get; set; } = string.Empty;

        public List<RecommendedDrugDTO> RecommendedDrugs { get; set; } = new();
    }
}