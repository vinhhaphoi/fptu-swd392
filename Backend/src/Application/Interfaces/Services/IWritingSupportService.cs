using Application.DTOs.Writing;

namespace Application.Interfaces.Services;

public interface IWritingSupportService
{
    Task<LanguageCheckResponse> CheckLanguageAsync(int submissionId, string text);
    Task<List<string>> GetStructureSuggestionsAsync(Guid topicId, int levelId, string currentText);
}
