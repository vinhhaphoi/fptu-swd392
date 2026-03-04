namespace Application.DTOs.Practice;

public class StartSessionRequest
{
    public Guid PracticeModeId { get; set; }
    public Guid? TopicId { get; set; }
    public Guid? ExamStructureId { get; set; }
}
