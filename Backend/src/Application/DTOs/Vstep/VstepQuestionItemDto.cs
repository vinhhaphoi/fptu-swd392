using System.Text.Json.Serialization;

namespace Application.DTOs.Vstep;

/// <summary>
/// DTO for one item in VSTEPQuestions.json (supports both Task 1 and Task 2 shapes).
/// </summary>
public class VstepQuestionItemDto
{
    [JsonPropertyName("questionId")]
    public string QuestionId { get; set; } = string.Empty;

    [JsonPropertyName("taskType")]
    public string TaskType { get; set; } = string.Empty; // "task1" | "task2"

    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    // ----- Task 1 fields -----
    [JsonPropertyName("situation")]
    public string? Situation { get; set; }

    [JsonPropertyName("task")]
    public string? Task { get; set; }

    [JsonPropertyName("requirements")]
    public List<string>? Requirements { get; set; }

    [JsonPropertyName("formalityLevel")]
    public string? FormalityLevel { get; set; }

    [JsonPropertyName("sampleOpening")]
    public string? SampleOpening { get; set; }

    [JsonPropertyName("sampleClosing")]
    public string? SampleClosing { get; set; }

    // ----- Task 2 fields -----
    [JsonPropertyName("topic")]
    public string? Topic { get; set; }

    [JsonPropertyName("instruction")]
    public string? Instruction { get; set; }

    [JsonPropertyName("essayType")]
    public string? EssayType { get; set; }

    [JsonPropertyName("suggestedStructure")]
    public List<string>? SuggestedStructure { get; set; }

    // ----- Common -----
    [JsonPropertyName("difficulty")]
    public string? Difficulty { get; set; }

    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("order")]
    public int Order { get; set; }
}
