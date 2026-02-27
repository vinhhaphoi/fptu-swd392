using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class SubmissionScoreConfiguration : IEntityTypeConfiguration<SubmissionScore>
{
    public void Configure(EntityTypeBuilder<SubmissionScore> builder)
    {
        builder.ToTable("submission_scores");

        builder.HasKey(ss => ss.Id);

        builder.Property(ss => ss.OverallScore)
            .IsRequired();

        builder.Property(ss => ss.EstimatedBand)
            .IsRequired();

        builder.Property(ss => ss.AiModelVersion)
            .HasMaxLength(100);

        builder.Property(ss => ss.CreatedAt)
            .IsRequired();

        builder.HasOne(ss => ss.Submission)
            .WithMany(s => s.SubmissionScores)
            .HasForeignKey(ss => ss.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
