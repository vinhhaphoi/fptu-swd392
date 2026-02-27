using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class SentenceStructureConfiguration : IEntityTypeConfiguration<SentenceStructure>
    {
        public void Configure(EntityTypeBuilder<SentenceStructure> builder)
        {
            builder.ToTable("sentence_structures");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("structure_id");
            builder.Property(e => e.TopicId).HasColumnName("topic_id").IsRequired();
            builder.Property(e => e.LevelId).HasColumnName("level_id").IsRequired();
            builder.Property(e => e.StructurePattern).HasColumnName("structure_pattern").HasMaxLength(255).IsRequired();
            builder.Property(e => e.Explanation).HasColumnName("explanation");

            builder.HasOne(e => e.Topic)
                   .WithMany(t => t.SentenceStructures)
                   .HasForeignKey(e => e.TopicId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Level)
                   .WithMany()
                   .HasForeignKey(e => e.LevelId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
