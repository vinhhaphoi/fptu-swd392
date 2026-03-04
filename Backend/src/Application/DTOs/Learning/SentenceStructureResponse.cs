namespace Application.DTOs.Learning;

public class SentenceStructureResponse
{
    public Guid Id { get; set; }
    public string StructurePattern { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}
