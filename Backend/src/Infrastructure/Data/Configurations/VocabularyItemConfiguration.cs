using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class VocabularyItemConfiguration : IEntityTypeConfiguration<VocabularyItem>
    {
        public void Configure(EntityTypeBuilder<VocabularyItem> builder)
        {
            builder.ToTable("vocabulary_items");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("vocab_id");
            builder.Property(e => e.VocabularySetId).HasColumnName("vocab_set_id").IsRequired();
            builder.Property(e => e.Word).HasColumnName("word").HasMaxLength(100).IsRequired();
            builder.Property(e => e.Meaning).HasColumnName("meaning").HasMaxLength(255);
            builder.Property(e => e.Example).HasColumnName("example");

            builder.HasOne(e => e.VocabularySet)
                   .WithMany(s => s.VocabularyItems)
                   .HasForeignKey(e => e.VocabularySetId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
