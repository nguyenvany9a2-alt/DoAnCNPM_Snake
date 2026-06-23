using DrugContraindicationAPI.Controllers;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.DTOs;
using DrugContraindicationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrugContraindicationAPI.Tests
{
    public class CheckControllerTests
    {
        private AppDbContext CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CheckContraindication_Should_Return_Warning_When_Rule_Matched()
        {
            using var context = CreateDbContext();

            context.Contraindications.Add(new Contraindication
            {
                DrugName = "Aspirin",
                DiseaseName = "Viêm loét dạ dày",
                Level = "High",
                Warning = "Aspirin có thể làm tăng nguy cơ xuất huyết tiêu hóa."
            });

            await context.SaveChangesAsync();

            var controller = new CheckController(context);

            var request = new ContraindicationCheckRequestDTO
            {
                DrugNames = new List<string> { "Aspirin" },
                DiseaseNames = new List<string> { "Viêm loét dạ dày" }
            };

            var result = await controller.CheckContraindication(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = Assert.IsType<ContraindicationCheckResultDTO>(okResult.Value);

            Assert.True(data.HasWarning);
            Assert.Single(data.Warnings);
            Assert.Equal("High", data.Warnings[0].Level);
        }

        [Fact]
        public async Task CheckInteraction_Should_Return_Warning_When_Interaction_Matched()
        {
            using var context = CreateDbContext();

            context.Interactions.Add(new Interaction
            {
                DrugA = "Warfarin",
                DrugB = "Aspirin",
                Level = "High",
                Description = "Tăng nguy cơ chảy máu."
            });

            await context.SaveChangesAsync();

            var controller = new CheckController(context);

            var request = new InteractionCheckRequestDTO
            {
                DrugNames = new List<string> { "Warfarin", "Aspirin" }
            };

            var result = await controller.CheckInteraction(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = Assert.IsType<InteractionCheckResultDTO>(okResult.Value);

            Assert.True(data.HasInteraction);
            Assert.Single(data.Interactions);
            Assert.Equal("High", data.Interactions[0].Level);
        }
    }
}