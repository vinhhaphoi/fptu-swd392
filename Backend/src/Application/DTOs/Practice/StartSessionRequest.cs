namespace Application.DTOs.Practice;

public class StartSessionRequest
{
    public int PracticeModeId { get; set; }
    public Guid? TopicId { get; set; }
    public int? ExamStructureId { get; set; }
}
