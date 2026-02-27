using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class ScoringCriteriaConfiguration : IEntityTypeConfiguration<ScoringCriteria>
    {
        public void Configure(EntityTypeBuilder<ScoringCriteria> builder)
        {
            builder.ToTable("scoring_criteria");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("criteria_id");
            builder.Property(e => e.RubricId).HasColumnName("rubric_id").IsRequired();
            builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            builder.Property(e => e.Description).HasColumnName("description");
            builder.Property(e => e.Weight).HasColumnName("weight").IsRequired();
            builder.Property(e => e.MaxScore).HasColumnName("max_score").HasDefaultValue(10);

            builder.HasOne(e => e.Rubric)
                   .WithMany(r => r.ScoringCriteria)
                   .HasForeignKey(e => e.RubricId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
