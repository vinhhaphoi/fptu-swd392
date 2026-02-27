using Infrastructure.Data.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Application.Interfaces.Repositories;
using Infrastructure.Repositories;
using Supabase;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register Supabase client (anon or service role; auth is BE-only so anon optional)
        var supabaseUrl = configuration.GetValue<string>("Supabase:Url");
        var supabaseAnonKey = configuration.GetValue<string>("Supabase:AnonKey");
        var supabaseServiceKey = configuration.GetValue<string>("Supabase:ServiceRoleKey");
        var key = !string.IsNullOrWhiteSpace(supabaseAnonKey) ? supabaseAnonKey : supabaseServiceKey;
        services.AddSingleton<Client>(_ => new Client(supabaseUrl!, key));
        
        // Configure Supabase options for email validation
        // Note: Email validation is typically handled at the Supabase dashboard level
        

        
        // Register DbContext: prefer Pooler (Session mode) - supports IPv4; Direct is IPv6-only and can cause DNS "no data of requested type"
        var connectionString = configuration.GetConnectionString("PoolerConnection")
            ?? configuration.GetConnectionString("DirectConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("ConnectionStrings:DirectConnection or PoolerConnection is required.");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Register repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IExamStructureRepository, ExamStructureRepository>();
        services.AddScoped<ILevelRepository, LevelRepository>();
        services.AddScoped<IPartRepository, PartRepository>();
        services.AddScoped<IPartTypeRepository, PartTypeRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<IPracticeModeRepository, PracticeModeRepository>();
        services.AddScoped<IPracticeSessionRepository, PracticeSessionRepository>();
        services.AddScoped<ITopicRepository, TopicRepository>();
        services.AddScoped<IUserSubmissionRepository, UserSubmissionRepository>();
        services.AddScoped<IVocabularySetRepository, VocabularySetRepository>();
        services.AddScoped<ISampleTextRepository, SampleTextRepository>();
        services.AddScoped<IHintRepository, HintRepository>();
        services.AddScoped<ISystemPromptRepository, SystemPromptRepository>();
        services.AddScoped<IScoringCriteriaRepository, ScoringCriteriaRepository>();
        services.AddScoped<ILanguageCheckRepository, LanguageCheckRepository>();
        
        // New repositories
        services.AddScoped<ISubmissionScoreRepository, SubmissionScoreRepository>();
        services.AddScoped<ICriteriaScoreRepository, CriteriaScoreRepository>();
        services.AddScoped<IAIFeedbackRepository, AIFeedbackRepository>();
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        services.AddScoped<IUserTopicProgressRepository, UserTopicProgressRepository>();
        services.AddScoped<IExamAttemptRepository, ExamAttemptRepository>();
        services.AddScoped<IRubricRepository, RubricRepository>();
        services.AddScoped<ISentenceStructureRepository, SentenceStructureRepository>();
        services.AddScoped<ITopicVocabularySetRepository, TopicVocabularySetRepository>();
        services.AddScoped<IUserErrorStatisticRepository, UserErrorStatisticRepository>();
        services.AddScoped<ILearningPlanRepository, LearningPlanRepository>();

        return services;
    }
}
