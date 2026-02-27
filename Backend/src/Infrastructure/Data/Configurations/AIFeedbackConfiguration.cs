using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class AIFeedbackConfiguration : IEntityTypeConfiguration<AIFeedback>
{
    public void Configure(EntityTypeBuilder<AIFeedback> builder)
    {
        builder.ToTable("ai_feedbacks");

        builder.HasKey(af => af.Id);

        builder.Property(af => af.FeedbackText)
            .HasMaxLength(2000);

        builder.Property(af => af.Suggestions)
            .HasMaxLength(2000);

        builder.Property(af => af.ImprovedVersion)
            .HasMaxLength(5000);

        builder.HasOne(af => af.Submission)
            .WithMany(s => s.AIFeedbacks)
            .HasForeignKey(af => af.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(af => af.Criteria)
            .WithMany()
            .HasForeignKey(af => af.CriteriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
