using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ExamAttemptConfiguration : IEntityTypeConfiguration<ExamAttempt>
{
    public void Configure(EntityTypeBuilder<ExamAttempt> builder)
    {
        builder.ToTable("exam_attempts");

        builder.HasKey(ea => ea.Id);

        builder.Property(ea => ea.StartedAt)
            .IsRequired();

        builder.Property(ea => ea.OverallScore)
            .HasDefaultValue(0);

        builder.Property(ea => ea.EstimatedBand)
            .HasDefaultValue(0);

        builder.HasOne(ea => ea.User)
            .WithMany(u => u.ExamAttempts)
            .HasForeignKey(ea => ea.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ea => ea.ExamStructure)
            .WithMany()
            .HasForeignKey(ea => ea.ExamStructureId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
