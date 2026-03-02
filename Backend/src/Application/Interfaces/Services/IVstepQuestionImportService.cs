namespace Application.Interfaces.Services;

/// <summary>
/// Imports VSTEP writing questions from JSON (VSTEPQuestions.json) into Topics.
/// </summary>
public interface IVstepQuestionImportService
{
    /// <summary>
    /// Loads and parses the JSON file, then imports all questions as Topics.
    /// Task1 -> Part 1, Task2 -> Part 2. Ensures ExamStructure and Parts exist.
    /// </summary>
    /// <param name="jsonFilePath">Full path to VSTEPQuestions.json.</param>
    /// <returns>Count of topics created.</returns>
    Task<int> ImportFromFileAsync(string jsonFilePath);
}
