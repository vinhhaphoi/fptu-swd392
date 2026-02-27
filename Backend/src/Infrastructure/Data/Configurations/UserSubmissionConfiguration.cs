using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class UserSubmissionConfiguration : IEntityTypeConfiguration<UserSubmission>
    {
        public void Configure(EntityTypeBuilder<UserSubmission> builder)
        {
            builder.ToTable("writing_submissions");
            
            builder.HasKey(e => e.Id);

            builder.Property(e => e.PracticeSessionId)
                   .HasColumnName("practice_session_id")
                   .IsRequired();

            builder.Property(e => e.VersionNumber)
                   .HasColumnName("version_number")
                   .HasDefaultValue(1)
                   .IsRequired();

            builder.Property(e => e.IsFinal)
                   .HasColumnName("is_final")
                   .HasDefaultValue(false)
                   .IsRequired();

            builder.Property(e => e.SubmissionText)
                   .HasColumnName("submission_text")
                   .IsRequired();

            builder.Property(e => e.WordCount)
                   .HasColumnName("word_count")
                   .IsRequired();

            builder.Property(e => e.WritingTimeSeconds)
                   .HasColumnName("writing_time_seconds")
                   .IsRequired();

            builder.Property(e => e.CreatedAt)
                   .HasColumnName("created_at")
                   .IsRequired();

            // Relationships
            builder.HasOne(us => us.PracticeSession)
                   .WithMany(ps => ps.UserSubmissions)
                   .HasForeignKey(us => us.PracticeSessionId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(e => e.PracticeSessionId);
            builder.HasIndex(e => new { e.PracticeSessionId, e.VersionNumber });
        }
    }
}
