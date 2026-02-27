using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class TopicConfiguration : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.ToTable("topics");
            
            builder.HasKey(e => e.Id);

            builder.Property(e => e.PartId)
                   .HasColumnName("part_id")
                   .IsRequired();

            builder.Property(e => e.LevelId)
                   .HasColumnName("level_id")
                   .IsRequired();

            builder.Property(e => e.Title)
                   .HasColumnName("title")
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(e => e.Prompt)
                   .HasColumnName("prompt")
                   .IsRequired();

            builder.Property(e => e.Purpose)
                   .HasColumnName("purpose")
                   .HasMaxLength(500);

            builder.Property(e => e.RecipientRole)
                   .HasColumnName("recipient_role")
                   .HasMaxLength(100);

            builder.Property(e => e.Version)
                   .HasColumnName("version")
                   .HasDefaultValue(1);

            builder.Property(e => e.IsActive)
                   .HasColumnName("is_active")
                   .HasDefaultValue(true);

            builder.Property(e => e.UpdatedAt)
                   .HasColumnName("updated_at")
                   .IsRequired();

            // Relationships
            builder.HasOne(t => t.Part)
                   .WithMany(p => p.Topics)
                   .HasForeignKey(t => t.PartId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.Level)
                   .WithMany(l => l.Topics)
                   .HasForeignKey(t => t.LevelId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(t => t.PracticeSessions)
                   .WithOne(ps => ps.Topic)
                   .HasForeignKey(ps => ps.TopicId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(e => e.Title);
            builder.HasIndex(e => e.PartId);
            builder.HasIndex(e => e.LevelId);
        }
    }
}
