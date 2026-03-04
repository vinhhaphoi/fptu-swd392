using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class LearningPlanConfiguration : IEntityTypeConfiguration<LearningPlan>
{
    public void Configure(EntityTypeBuilder<LearningPlan> builder)
    {
        builder.ToTable("learning_plans");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.WeakArea)
            .HasMaxLength(500);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.TargetLevel)
            .WithMany()
            .HasForeignKey(x => x.TargetLevelId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
