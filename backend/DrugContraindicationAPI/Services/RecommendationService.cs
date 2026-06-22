using Microsoft.EntityFrameworkCore;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.DTOs;

namespace DrugContraindicationAPI.Services
{
    public class RecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RecommendationResultDTO> GetRecommendationsAsync(RecommendationRequestDTO request)
        {
            var drugName = request.DrugName.Trim();
            var diseaseName = request.DiseaseName.Trim();

            var recommendations = await _context.Recommendations
                .Where(x =>
                    x.OriginalDrugName.ToLower() == drugName.ToLower() &&
                    x.DiseaseName.ToLower() == diseaseName.ToLower())
                .OrderBy(x => x.Priority)
                .ToListAsync();

            if (recommendations.Count == 0)
            {
                return new RecommendationResultDTO
                {
                    OriginalDrugName = drugName,
                    DiseaseName = diseaseName,
                    HasRecommendation = false,
                    Message = "Chưa có dữ liệu gợi ý thuốc thay thế cho trường hợp này.",
                    RecommendedDrugs = new List<RecommendedDrugDTO>()
                };
            }

            var safeRecommendations = new List<RecommendedDrugDTO>();

            foreach (var item in recommendations)
            {
                var isStillContraindicated = await _context.Contraindications.AnyAsync(x =>
                    x.DrugName.ToLower() == item.RecommendedDrugName.ToLower() &&
                    x.DiseaseName.ToLower() == diseaseName.ToLower());

                if (!isStillContraindicated)
                {
                    safeRecommendations.Add(new RecommendedDrugDTO
                    {
                        DrugName = item.RecommendedDrugName,
                        Reason = item.Reason,
                        Priority = item.Priority
                    });
                }
            }

            if (safeRecommendations.Count == 0)
            {
                return new RecommendationResultDTO
                {
                    OriginalDrugName = drugName,
                    DiseaseName = diseaseName,
                    HasRecommendation = false,
                    Message = "Có dữ liệu gợi ý nhưng chưa tìm thấy thuốc thay thế an toàn với bệnh nền hiện tại.",
                    RecommendedDrugs = new List<RecommendedDrugDTO>()
                };
            }

            return new RecommendationResultDTO
            {
                OriginalDrugName = drugName,
                DiseaseName = diseaseName,
                HasRecommendation = true,
                Message = "Tìm thấy thuốc thay thế phù hợp.",
                RecommendedDrugs = safeRecommendations
            };
        }
    }
}