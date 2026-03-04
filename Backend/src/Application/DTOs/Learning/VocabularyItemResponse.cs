namespace Application.DTOs.Learning;

public class VocabularyItemResponse
{
    public Guid Id { get; set; }
    public string Word { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public string? Example { get; set; }
}
