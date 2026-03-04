namespace Application.DTOs.Learning;

public class SampleTextResponse
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public float SampleBandScore { get; set; }
    public int Version { get; set; }
}
