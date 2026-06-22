using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.Models;
using DrugContraindicationAPI.DTOs;

namespace DrugContraindicationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = dto.Email.Trim().ToLower();

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

            if (existingUser != null)
                return BadRequest(new { message = "Email đã tồn tại trong hệ thống." });

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = email,
                Password = dto.Password,
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "User" : dto.Role.Trim()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký tài khoản thành công.",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = dto.Email.Trim().ToLower();

            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email.ToLower() == email &&
                x.Password == dto.Password);

            if (user == null)
                return BadRequest(new { message = "Sai tài khoản hoặc mật khẩu." });

            return Ok(new
            {
                message = "Đăng nhập thành công.",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }

        // GET: api/Auth
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(user => new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Auth/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role
            });
        }

        // PUT: api/Auth/profile/1
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, RegisterDTO dto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng cần cập nhật." });

            var email = dto.Email.Trim().ToLower();

            var emailExists = await _context.Users.AnyAsync(x =>
                x.Id != id &&
                x.Email.ToLower() == email);

            if (emailExists)
                return BadRequest(new { message = "Email đã được sử dụng bởi tài khoản khác." });

            user.FullName = dto.FullName.Trim();
            user.Email = email;
            user.Password = dto.Password;
            user.Role = string.IsNullOrWhiteSpace(dto.Role) ? user.Role : dto.Role.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật hồ sơ thành công.",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
    }
}