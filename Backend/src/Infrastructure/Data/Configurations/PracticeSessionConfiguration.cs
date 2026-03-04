using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class PracticeSessionConfiguration : IEntityTypeConfiguration<PracticeSession>
    {
        public void Configure(EntityTypeBuilder<PracticeSession> builder)
        {
            builder.ToTable("practice_sessions");
            
            builder.HasKey(e => e.Id);

            builder.Property(e => e.UserId)
                   .HasColumnName("user_id")
                   .IsRequired();

            builder.Property(e => e.TopicId)
                   .HasColumnName("topic_id");

            builder.Property(e => e.PracticeModeId)
                   .HasColumnName("practice_mode_id");

            builder.Property(e => e.ExamAttemptId)
                   .HasColumnName("exam_attempt_id");

            builder.Property(e => e.Status)
                   .HasColumnName("status")
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(e => e.StartedAt)
                   .HasColumnName("started_at")
                   .IsRequired();

            builder.Property(e => e.SubmittedAt)
                   .HasColumnName("submitted_at");

            // Relationships
            builder.HasOne(ps => ps.User)
                   .WithMany(u => u.PracticeSessions)
                   .HasForeignKey(ps => ps.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ps => ps.Topic)
                   .WithMany(t => t.PracticeSessions)
                   .HasForeignKey(ps => ps.TopicId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(ps => ps.PracticeMode)
                   .WithMany()
                   .HasForeignKey(ps => ps.PracticeModeId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ps => ps.ExamAttempt)
                   .WithMany(ea => ea.PracticeSessions)
                   .HasForeignKey(ps => ps.ExamAttemptId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(ps => ps.UserSubmissions)
                   .WithOne(us => us.PracticeSession)
                   .HasForeignKey(us => us.PracticeSessionId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(e => e.UserId);
            builder.HasIndex(e => e.TopicId);
            builder.HasIndex(e => e.PracticeModeId);
            builder.HasIndex(e => e.ExamAttemptId);
        }
    }
}
