using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserTopicProgressConfiguration : IEntityTypeConfiguration<UserTopicProgress>
{
    public void Configure(EntityTypeBuilder<UserTopicProgress> builder)
    {
        builder.ToTable("user_topic_progress");

        builder.HasKey(utp => utp.Id);

        builder.Property(utp => utp.AttemptsCount)
            .HasDefaultValue(0);

        builder.Property(utp => utp.BestBandScore)
            .HasMaxLength(10)
            .HasDefaultValue("0.0");

        builder.Property(utp => utp.AverageScore)
            .HasDefaultValue(0);

        builder.Property(utp => utp.LastAttemptAt)
            .IsRequired();

        builder.Property(utp => utp.MasteryLevel)
            .HasMaxLength(50);

        builder.HasOne(utp => utp.User)
            .WithMany(u => u.TopicProgresses)
            .HasForeignKey(utp => utp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(utp => utp.Topic)
            .WithMany(t => t.UserTopicProgresses)
            .HasForeignKey(utp => utp.TopicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
