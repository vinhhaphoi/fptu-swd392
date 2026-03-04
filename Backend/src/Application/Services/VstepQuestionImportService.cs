using System.Text.Json;
using Application.DTOs.Vstep;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Domain.Entities;

namespace Application.Services;

public class VstepQuestionImportService : IVstepQuestionImportService
{
    private readonly ITopicRepository _topicRepository;
    private readonly IPartRepository _partRepository;
    private readonly IExamStructureRepository _examStructureRepository;
    private readonly ILevelRepository _levelRepository;
    private readonly IPartTypeRepository _partTypeRepository;

    public VstepQuestionImportService(
        ITopicRepository topicRepository,
        IPartRepository partRepository,
        IExamStructureRepository examStructureRepository,
        ILevelRepository levelRepository,
        IPartTypeRepository partTypeRepository)
    {
        _topicRepository = topicRepository;
        _partRepository = partRepository;
        _examStructureRepository = examStructureRepository;
        _levelRepository = levelRepository;
        _partTypeRepository = partTypeRepository;
    }

    public async Task<int> ImportFromFileAsync(string? jsonFilePath = null)
    {
        if (string.IsNullOrWhiteSpace(jsonFilePath))
            throw new ArgumentException("JSON file path is required.", nameof(jsonFilePath));
        var path = Path.GetFullPath(jsonFilePath);
        if (!File.Exists(path))
            throw new FileNotFoundException("VSTEPQuestions.json not found.", path);

        var questions = ParseJsonFile(path);
        if (questions.Count == 0)
            return 0;

        var (part1Id, part2Id) = await EnsureExamStructureAndPartsAsync();
        var defaultLevelId = await EnsureDefaultLevelAsync();

        var created = 0;
        foreach (var q in questions)
        {
            var partId = string.Equals(q.TaskType, "task2", StringComparison.OrdinalIgnoreCase) ? part2Id : part1Id;
            var prompt = BuildPrompt(q);
            var title = q.Title.Length > 255 ? q.Title[..255] : q.Title;
            var purpose = (q.Category ?? q.EssayType ?? q.FormalityLevel)?.Length > 500
                ? (q.Category ?? q.EssayType ?? q.FormalityLevel)![..500]
                : (q.Category ?? q.EssayType ?? q.FormalityLevel);
            var recipientRole = (q.FormalityLevel ?? q.EssayType)?.Length > 100
                ? (q.FormalityLevel ?? q.EssayType)![..100]
                : (q.FormalityLevel ?? q.EssayType);

            var topic = new Topic
            {
                Id = Guid.NewGuid(),
                PartId = partId,
                LevelId = defaultLevelId,
                Title = title,
                Prompt = prompt,
                Purpose = purpose,
                RecipientRole = recipientRole,
                Version = 1,
                IsActive = q.IsActive,
                UpdatedAt = DateTime.UtcNow
            };
            await _topicRepository.CreateAsync(topic);
            created++;
        }

        return created;
    }

    private static List<VstepQuestionItemDto> ParseJsonFile(string path)
    {
        var text = File.ReadAllText(path);
        // File may contain multiple root JSON objects concatenated (}\n{). Merge into one object.
        var merged = System.Text.RegularExpressions.Regex.Replace(text, @"\}\s*\{", ",");
        using var doc = JsonDocument.Parse(merged);
        var root = doc.RootElement;
        var list = new List<VstepQuestionItemDto>();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        foreach (var prop in root.EnumerateObject())
        {
            try
            {
                var dto = JsonSerializer.Deserialize<VstepQuestionItemDto>(prop.Value.GetRawText(), options);
                if (dto != null && !string.IsNullOrEmpty(dto.QuestionId))
                    list.Add(dto);
            }
            catch
            {
                // Skip malformed entries
            }
        }
        return list;
    }

    private static string BuildPrompt(VstepQuestionItemDto q)
    {
        if (string.Equals(q.TaskType, "task2", StringComparison.OrdinalIgnoreCase))
        {
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(q.Topic)) parts.Add(q.Topic);
            if (!string.IsNullOrWhiteSpace(q.Instruction)) parts.Add("\n\n" + q.Instruction);
            if (q.SuggestedStructure is { Count: > 0 })
                parts.Add("\n\nSuggested structure:\n" + string.Join("\n", q.SuggestedStructure));
            return string.Join("", parts).Trim();
        }
        // Task 1
        var t1 = new List<string>();
        if (!string.IsNullOrWhiteSpace(q.Situation)) t1.Add("Situation: " + q.Situation);
        if (!string.IsNullOrWhiteSpace(q.Task)) t1.Add("Task: " + q.Task);
        if (q.Requirements is { Count: > 0 })
            t1.Add("Requirements:\n" + string.Join("\n", q.Requirements.Select(r => "• " + r)));
        return string.Join("\n\n", t1).Trim();
    }

    private async Task<(Guid part1Id, Guid part2Id)> EnsureExamStructureAndPartsAsync()
    {
        var structures = await _examStructureRepository.GetAllAsync();
        var vstep = structures.FirstOrDefault(s => s.Name.Contains("VSTEP", StringComparison.OrdinalIgnoreCase));
        if (vstep == null)
        {
            vstep = new ExamStructure
            {
                Id = Guid.NewGuid(),
                Name = "VSTEP Writing",
                Description = "VSTEP Writing Exam",
                TotalParts = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            vstep = await _examStructureRepository.CreateAsync(vstep);
        }

        var parts = await _partRepository.GetByExamStructureIdAsync(vstep.Id);
        var partTypes = await _partTypeRepository.GetAllAsync();
        PartType type1, type2;
        if (partTypes.Count < 1)
        {
            type1 = await _partTypeRepository.CreateAsync(new PartType { Id = Guid.NewGuid(), Code = "Task1", Description = "Part 1 - Letter/Email" });
            type2 = await _partTypeRepository.CreateAsync(new PartType { Id = Guid.NewGuid(), Code = "Task2", Description = "Part 2 - Essay" });
        }
        else if (partTypes.Count < 2)
        {
            type1 = partTypes[0];
            type2 = await _partTypeRepository.CreateAsync(new PartType { Id = Guid.NewGuid(), Code = "Task2", Description = "Part 2 - Essay" });
        }
        else
        {
            type1 = partTypes[0];
            type2 = partTypes[1];
        }

        var part1 = parts.FirstOrDefault(p => p.PartNumber == 1);
        if (part1 == null)
        {
            part1 = new Part
            {
                Id = Guid.NewGuid(),
                ExamStructureId = vstep.Id,
                PartTypeId = type1.Id,
                PartNumber = 1,
                Title = "Part 1 - Letter/Email",
                Description = "Write a letter or email (120-150 words)",
                TimeLimit = 20,
                MinWords = 120,
                MaxWords = 150
            };
            part1 = await _partRepository.CreateAsync(part1);
        }

        var part2 = parts.FirstOrDefault(p => p.PartNumber == 2);
        if (part2 == null)
        {
            part2 = new Part
            {
                Id = Guid.NewGuid(),
                ExamStructureId = vstep.Id,
                PartTypeId = type2.Id,
                PartNumber = 2,
                Title = "Part 2 - Essay",
                Description = "Write an essay (250-300 words)",
                TimeLimit = 40,
                MinWords = 250,
                MaxWords = 300
            };
            part2 = await _partRepository.CreateAsync(part2);
        }

        return (part1.Id, part2.Id);
    }

    private async Task<Guid> EnsureDefaultLevelAsync()
    {
        var levels = await _levelRepository.GetAllAsync();
        var level = levels.FirstOrDefault(l => l.LevelCode.Equals("B2", StringComparison.OrdinalIgnoreCase))
                    ?? levels.FirstOrDefault();
        if (level == null)
            throw new InvalidOperationException("No levels in database. Run Supabase_Setup_Login_Register.sql or seed levels first.");
        return level.Id;
    }
}
