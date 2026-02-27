using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class RubricConfiguration : IEntityTypeConfiguration<Rubric>
{
    public void Configure(EntityTypeBuilder<Rubric> builder)
    {
        builder.ToTable("rubrics");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(r => r.Version)
            .HasDefaultValue(1);

        builder.Property(r => r.IsActive)
            .HasDefaultValue(true);

        builder.HasOne(r => r.Part)
            .WithMany()
            .HasForeignKey(r => r.PartId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
