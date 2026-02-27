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

         builder.Property(up => up.FullName)
            .HasMaxLength(255);

        builder.Property(up => up.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(up => up.Bio)
            .HasMaxLength(1000);

        builder.Property(up => up.EstimatedBandScore)
            .HasDefaultValue(0);

        builder.Property(up => up.StreakDays)
            .HasDefaultValue(0);

        builder.Property(up => up.UpdatedAt)
            .IsRequired();
    }
}
