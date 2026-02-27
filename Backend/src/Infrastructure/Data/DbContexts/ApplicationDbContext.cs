using Domain.Entities;
using Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.DbContexts;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<UserTopicProgress> UserTopicProgresses => Set<UserTopicProgress>();
    public DbSet<ExamAttempt> ExamAttempts => Set<ExamAttempt>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
    public DbSet<Level> Levels => Set<Level>();
    public DbSet<PracticeMode> PracticeModes => Set<PracticeMode>();
    public DbSet<ExamStructure> ExamStructures => Set<ExamStructure>();
    public DbSet<Part> Parts => Set<Part>();
    public DbSet<PartType> PartTypes => Set<PartType>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<TopicVocabularySet> TopicVocabularySets => Set<TopicVocabularySet>();
    public DbSet<PracticeSession> PracticeSessions => Set<PracticeSession>();
    public DbSet<UserSubmission> UserSubmissions => Set<UserSubmission>();
    public DbSet<VocabularySet> VocabularySets => Set<VocabularySet>();
    public DbSet<VocabularyItem> VocabularyItems => Set<VocabularyItem>();
    public DbSet<SentenceStructure> SentenceStructures => Set<SentenceStructure>();
    public DbSet<SampleText> SampleTexts => Set<SampleText>();
    public DbSet<SampleType> SampleTypes => Set<SampleType>();
    public DbSet<Hint> Hints => Set<Hint>();
    public DbSet<HintType> HintTypes => Set<HintType>();
    public DbSet<LanguageCheck> LanguageChecks => Set<LanguageCheck>();
    public DbSet<Rubric> Rubrics => Set<Rubric>();
    public DbSet<ScoringCriteria> ScoringCriteria => Set<ScoringCriteria>();
    public DbSet<CriteriaScore> CriteriaScores => Set<CriteriaScore>();
    public DbSet<SubmissionScore> SubmissionScores => Set<SubmissionScore>();
    public DbSet<AIFeedback> AIFeedbacks => Set<AIFeedback>();
    public DbSet<UserErrorStatistic> UserErrorStatistics => Set<UserErrorStatistic>();
    public DbSet<SystemPrompt> SystemPrompts => Set<SystemPrompt>();
    public DbSet<LearningPlan> LearningPlans => Set<LearningPlan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations using Fluent API
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new UserProfileConfiguration());
        modelBuilder.ApplyConfiguration(new UserTopicProgressConfiguration());
        modelBuilder.ApplyConfiguration(new ExamAttemptConfiguration());
        modelBuilder.ApplyConfiguration(new PasswordResetTokenConfiguration());
        modelBuilder.ApplyConfiguration(new LevelConfiguration());
        modelBuilder.ApplyConfiguration(new PracticeModeConfiguration());
        modelBuilder.ApplyConfiguration(new ExamStructureConfiguration());
        modelBuilder.ApplyConfiguration(new PartConfiguration());
        modelBuilder.ApplyConfiguration(new TopicConfiguration());
        modelBuilder.ApplyConfiguration(new TopicVocabularySetConfiguration());
        modelBuilder.ApplyConfiguration(new PracticeSessionConfiguration());
        modelBuilder.ApplyConfiguration(new UserSubmissionConfiguration());
        modelBuilder.ApplyConfiguration(new VocabularySetConfiguration());
        modelBuilder.ApplyConfiguration(new VocabularyItemConfiguration());
        modelBuilder.ApplyConfiguration(new SentenceStructureConfiguration());
        modelBuilder.ApplyConfiguration(new SampleTextConfiguration());
        modelBuilder.ApplyConfiguration(new HintConfiguration());
        modelBuilder.ApplyConfiguration(new LanguageCheckConfiguration());
        modelBuilder.ApplyConfiguration(new RubricConfiguration());
        modelBuilder.ApplyConfiguration(new ScoringCriteriaConfiguration());
        modelBuilder.ApplyConfiguration(new CriteriaScoreConfiguration());
        modelBuilder.ApplyConfiguration(new SubmissionScoreConfiguration());
        modelBuilder.ApplyConfiguration(new AIFeedbackConfiguration());
        modelBuilder.ApplyConfiguration(new UserErrorStatisticConfiguration());
        modelBuilder.ApplyConfiguration(new SystemPromptConfiguration());
        modelBuilder.ApplyConfiguration(new LearningPlanConfiguration());
    }
}
