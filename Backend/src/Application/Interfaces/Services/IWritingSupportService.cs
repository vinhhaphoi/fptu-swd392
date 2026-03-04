using Application.DTOs.Writing;

namespace Application.Interfaces.Services;

public interface IWritingSupportService
{
    Task<LanguageCheckResponse> CheckLanguageAsync(Guid submissionId, string text);
    Task<List<string>> GetStructureSuggestionsAsync(Guid topicId, Guid levelId, string currentText);
}
