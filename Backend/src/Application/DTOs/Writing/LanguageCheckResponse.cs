namespace Application.DTOs.Writing;

public class LanguageError
{
    public string OriginalText { get; set; } = string.Empty;
    public string SuggestedCorrection { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public int StartIndex { get; set; }
    public int Length { get; set; }
}

public class LanguageCheckResponse
{
    public Guid Id { get; set; }
    public string CheckType { get; set; } = string.Empty;
    public List<LanguageError> GrammarErrors { get; set; } = new();
    public List<LanguageError> SpellingErrors { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
