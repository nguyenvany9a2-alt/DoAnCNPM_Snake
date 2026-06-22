using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.Models;
using DrugContraindicationAPI.DTOs;
using DrugContraindicationAPI.Services;

namespace DrugContraindicationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly RecommendationService _recommendationService;

        public RecommendationController(
            AppDbContext context,
            RecommendationService recommendationService)
        {
            _context = context;
            _recommendationService = recommendationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recommendations = await _context.Recommendations
                .OrderBy(x => x.OriginalDrugName)
                .ThenBy(x => x.Priority)
                .ToListAsync();

            return Ok(recommendations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recommendation = await _context.Recommendations.FindAsync(id);

            if (recommendation == null)
                return NotFound(new { message = "Không tìm thấy dữ liệu gợi ý thuốc." });

            return Ok(recommendation);
        }

        [HttpPost]
        public async Task<IActionResult> Create(RecommendationCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recommendation = new Recommendation
            {
                OriginalDrugName = dto.OriginalDrugName.Trim(),
                DiseaseName = dto.DiseaseName.Trim(),
                RecommendedDrugName = dto.RecommendedDrugName.Trim(),
                Reason = dto.Reason.Trim(),
                Priority = dto.Priority <= 0 ? 1 : dto.Priority
            };

            _context.Recommendations.Add(recommendation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = recommendation.Id },
                recommendation
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RecommendationCreateDTO dto)
        {
            var recommendation = await _context.Recommendations.FindAsync(id);

            if (recommendation == null)
                return NotFound(new { message = "Không tìm thấy dữ liệu cần cập nhật." });

            recommendation.OriginalDrugName = dto.OriginalDrugName.Trim();
            recommendation.DiseaseName = dto.DiseaseName.Trim();
            recommendation.RecommendedDrugName = dto.RecommendedDrugName.Trim();
            recommendation.Reason = dto.Reason.Trim();
            recommendation.Priority = dto.Priority <= 0 ? 1 : dto.Priority;

            await _context.SaveChangesAsync();

            return Ok(recommendation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recommendation = await _context.Recommendations.FindAsync(id);

            if (recommendation == null)
                return NotFound(new { message = "Không tìm thấy dữ liệu cần xóa." });

            _context.Recommendations.Remove(recommendation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa dữ liệu gợi ý thuốc thành công." });
        }

        [HttpPost("suggest")]
        public async Task<IActionResult> Suggest(RecommendationRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _recommendationService.GetRecommendationsAsync(request);

            return Ok(result);
        }
    }
}