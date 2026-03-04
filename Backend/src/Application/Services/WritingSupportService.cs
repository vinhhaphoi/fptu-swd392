using Application.DTOs.Writing;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;
using System.Text.Json;

namespace Application.Services;

public class WritingSupportService : IWritingSupportService
{
    private readonly ILanguageCheckRepository _languageCheckRepository;
    private readonly ISentenceStructureRepository _sentenceStructureRepository;

    public WritingSupportService(
        ILanguageCheckRepository languageCheckRepository,
        ISentenceStructureRepository sentenceStructureRepository)
    {
        _languageCheckRepository = languageCheckRepository;
        _sentenceStructureRepository = sentenceStructureRepository;
    }

    public async Task<LanguageCheckResponse> CheckLanguageAsync(Guid submissionId, string text)
    {
        // In a real implementation, this would call an AI service.
        // For now, we mock some results and save them.
        
        var grammarErrors = new List<LanguageError>(); // Mocking empty or calling AI
        var spellingErrors = new List<LanguageError>(); 

        var check = new LanguageCheck
        {
            Id = Guid.NewGuid(),
            UserSubmissionId = submissionId,
            CheckType = "REAL_TIME",
            AiModelVersion = "gpt-4-turbo",
            GrammarErrors = JsonSerializer.Serialize(grammarErrors),
            SpellingErrors = JsonSerializer.Serialize(spellingErrors),
            CreatedAt = DateTime.UtcNow
        };

        await _languageCheckRepository.CreateAsync(check);

        return new LanguageCheckResponse
        {
            Id = check.Id,
            CheckType = check.CheckType,
            GrammarErrors = grammarErrors,
            SpellingErrors = spellingErrors,
            CreatedAt = check.CreatedAt
        };
    }

    public async Task<List<string>> GetStructureSuggestionsAsync(Guid topicId, Guid levelId, string currentText)
    {
        var structures = await _sentenceStructureRepository.GetByTopicAndLevelAsync(topicId, levelId);
        
        // Logic to select relevant structures based on currentText (simplified)
        return structures.Select(s => s.StructurePattern).Take(3).ToList();
    }
}
