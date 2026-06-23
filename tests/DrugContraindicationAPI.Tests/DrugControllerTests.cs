using DrugContraindicationAPI.Controllers;
using DrugContraindicationAPI.Data;
using DrugContraindicationAPI.DTOs;
using DrugContraindicationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrugContraindicationAPI.Tests
{
    public class DrugControllerTests
    {
        private AppDbContext CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task Create_Should_Add_Drug()
        {
            using var context = CreateDbContext();
            var controller = new DrugController(context);

            var dto = new DrugDTO
            {
                DrugName = "Aspirin",
                Description = "Thuốc giảm đau chống viêm",
                Manufacturer = "Bayer",
                ActiveIngredient = "Acetylsalicylic Acid"
            };

            var result = await controller.Create(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var drug = Assert.IsType<Drug>(createdResult.Value);

            Assert.Equal("Aspirin", drug.DrugName);
            Assert.Single(context.Drugs);
        }

        [Fact]
        public async Task GetAll_Should_Return_List_Of_Drugs()
        {
            using var context = CreateDbContext();

            context.Drugs.Add(new Drug
            {
                DrugName = "Paracetamol",
                Description = "Giảm đau hạ sốt",
                Manufacturer = "DHG Pharma",
                ActiveIngredient = "Paracetamol"
            });

            await context.SaveChangesAsync();

            var controller = new DrugController(context);

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var drugs = Assert.IsAssignableFrom<List<Drug>>(okResult.Value);

            Assert.Single(drugs);
        }

        [Fact]
        public async Task Delete_Should_Remove_Drug()
        {
            using var context = CreateDbContext();

            var drug = new Drug
            {
                DrugName = "Ibuprofen",
                Description = "Giảm đau chống viêm",
                Manufacturer = "Generic",
                ActiveIngredient = "Ibuprofen"
            };

            context.Drugs.Add(drug);
            await context.SaveChangesAsync();

            var controller = new DrugController(context);

            var result = await controller.Delete(drug.DrugId);

            Assert.IsType<OkObjectResult>(result);
            Assert.Empty(context.Drugs);
        }
    }
}