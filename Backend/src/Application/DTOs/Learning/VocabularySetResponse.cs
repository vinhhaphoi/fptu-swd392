namespace Application.DTOs.Learning;

public class VocabularySetResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<VocabularyItemResponse> VocabularyItems { get; set; } = new();
}
