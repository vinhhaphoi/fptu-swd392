using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("user_profiles");

        builder.HasKey(up => up.UserId);
        builder.Property(up => up.UserId).HasColumnName("user_id");

        builder.Property(up => up.FullName)
            .HasColumnName("full_name")
            .HasMaxLength(255);

        builder.Property(up => up.AvatarUrl)
            .HasColumnName("avatar_url")
            .HasMaxLength(500);

        builder.Property(up => up.Bio)
            .HasColumnName("bio")
            .HasMaxLength(1000);

        builder.Property(up => up.EstimatedBandScore)
            .HasColumnName("estimated_band_score")
            .HasDefaultValue(0);

        builder.Property(up => up.StreakDays)
            .HasColumnName("streak_days")
            .HasDefaultValue(0);

        builder.Property(up => up.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();
    }
}
