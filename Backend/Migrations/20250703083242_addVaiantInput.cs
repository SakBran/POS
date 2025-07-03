using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class addVaiantInput : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ColourAttrributes");

            migrationBuilder.DropTable(
                name: "SizeAttributes");

            migrationBuilder.CreateTable(
                name: "VariantInputs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VariantKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VariantInputs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariantInputs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VariantInputs");

            migrationBuilder.CreateTable(
                name: "ColourAttrributes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Colour = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RootUserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StoreId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StoreName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColourAttrributes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SizeAttributes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RootUserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StoreId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StoreName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SizeAttributes", x => x.Id);
                });
        }
    }
}
