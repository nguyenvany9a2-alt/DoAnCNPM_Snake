using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DrugContraindicationAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendationSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Recommendations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OriginalDrugName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DiseaseName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    RecommendedDrugName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recommendations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Recommendations");
        }
    }
}
