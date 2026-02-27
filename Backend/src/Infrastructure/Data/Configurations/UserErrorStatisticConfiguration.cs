using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserErrorStatisticConfiguration : IEntityTypeConfiguration<UserErrorStatistic>
{
    public void Configure(EntityTypeBuilder<UserErrorStatistic> builder)
    {
        builder.ToTable("user_error_statistics");

        builder.HasKey(ues => ues.Id);

        builder.Property(ues => ues.OccurrenceCount)
            .HasDefaultValue(0);

        builder.Property(ues => ues.LastUpdated)
            .IsRequired();

        builder.HasOne(ues => ues.User)
            .WithMany(u => u.ErrorStatistics)
            .HasForeignKey(ues => ues.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ues => ues.Criteria)
            .WithMany(c => c.ErrorStatistics)
            .HasForeignKey(ues => ues.CriteriaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ues => ues.Part)
            .WithMany()
            .HasForeignKey(ues => ues.PartId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ues => ues.Level)
            .WithMany()
            .HasForeignKey(ues => ues.LevelId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
