using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TopicVocabularySetConfiguration : IEntityTypeConfiguration<TopicVocabularySet>
{
    public void Configure(EntityTypeBuilder<TopicVocabularySet> builder)
    {
        builder.ToTable("topic_vocabulary_sets");

        builder.HasKey(tvs => new { tvs.TopicId, tvs.VocabularySetId });

        builder.HasOne(tvs => tvs.Topic)
            .WithMany(t => t.TopicVocabularySets)
            .HasForeignKey(tvs => tvs.TopicId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tvs => tvs.VocabularySet)
            .WithMany(vs => vs.TopicVocabularySets)
            .HasForeignKey(tvs => tvs.VocabularySetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
