using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CriteriaScoreConfiguration : IEntityTypeConfiguration<CriteriaScore>
{
    public void Configure(EntityTypeBuilder<CriteriaScore> builder)
    {
        builder.ToTable("criteria_scores");

        builder.HasKey(cs => cs.Id);

        builder.Property(cs => cs.SubmissionScoreId)
            .IsRequired();

        builder.Property(cs => cs.CriteriaId)
            .IsRequired();

        builder.HasOne(cs => cs.SubmissionScore)
            .WithMany(ss => ss.CriteriaScores)
            .HasForeignKey(cs => cs.SubmissionScoreId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cs => cs.Criteria)
            .WithMany()
            .HasForeignKey(cs => cs.CriteriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
