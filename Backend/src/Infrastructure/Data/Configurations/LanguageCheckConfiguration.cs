using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class LanguageCheckConfiguration : IEntityTypeConfiguration<LanguageCheck>
    {
        public void Configure(EntityTypeBuilder<LanguageCheck> builder)
        {
            builder.ToTable("language_checks");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("check_id");
            builder.Property(e => e.UserSubmissionId).HasColumnName("user_submission_id").IsRequired();
            builder.Property(e => e.CheckType).HasColumnName("check_type").HasMaxLength(50);
            builder.Property(e => e.GrammarErrors).HasColumnName("grammar_errors");
            builder.Property(e => e.SpellingErrors).HasColumnName("spelling_errors");
            builder.Property(e => e.AiModelVersion).HasColumnName("ai_model_version").HasMaxLength(50);
            builder.Property(e => e.CreatedAt).HasColumnName("checked_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasOne(e => e.Submission)
                   .WithMany(s => s.LanguageChecks)
                   .HasForeignKey(e => e.UserSubmissionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
