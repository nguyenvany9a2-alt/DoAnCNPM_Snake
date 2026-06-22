using Microsoft.EntityFrameworkCore;
using DrugContraindicationAPI.Models;

namespace DrugContraindicationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<History> Histories { get; set; }

        public DbSet<Drug> Drugs { get; set; }

        public DbSet<Disease> Diseases { get; set; }

        public DbSet<Contraindication> Contraindications { get; set; }

        public DbSet<Interaction> Interactions { get; set; }
    }
}