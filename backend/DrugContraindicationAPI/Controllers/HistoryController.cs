using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.Models;
using DrugContraindicationAPI.DTOs;

namespace DrugContraindicationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HistoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/History
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var histories = await _context.Histories
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(histories);
        }

        // GET: api/History/user/1
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var histories = await _context.Histories
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(histories);
        }

        // GET: api/History/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var history = await _context.Histories.FindAsync(id);

            if (history == null)
                return NotFound(new { message = "Không tìm thấy lịch sử tra cứu." });

            return Ok(history);
        }

        // POST: api/History
        [HttpPost]
        public async Task<IActionResult> Save(HistoryDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(x => x.Id == dto.UserId);

            if (!userExists)
                return BadRequest(new { message = "Người dùng không tồn tại, không thể lưu lịch sử." });

            var history = new History
            {
                UserId = dto.UserId,
                DrugList = dto.DrugList.Trim(),
                Result = dto.Result.Trim(),
                CreatedAt = DateTime.Now
            };

            _context.Histories.Add(history);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Lưu lịch sử tra cứu thành công.",
                history
            });
        }

        // DELETE: api/History/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var history = await _context.Histories.FindAsync(id);

            if (history == null)
                return NotFound(new { message = "Không tìm thấy lịch sử cần xóa." });

            _context.Histories.Remove(history);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa lịch sử thành công." });
        }

        // DELETE: api/History/user/1
        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteByUserId(int userId)
        {
            var histories = await _context.Histories
                .Where(x => x.UserId == userId)
                .ToListAsync();

            if (histories.Count == 0)
                return NotFound(new { message = "Người dùng này chưa có lịch sử để xóa." });

            _context.Histories.RemoveRange(histories);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa toàn bộ lịch sử của người dùng thành công." });
        }
    }
}