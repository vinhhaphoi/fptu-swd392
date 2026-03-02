using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserErrorStatisticRepository
{
    Task<List<UserErrorStatistic>> GetByUserIdAsync(int userId);
    Task<UserErrorStatistic?> GetAsync(int userId, int criteriaId, int partId, int levelId);
    Task<UserErrorStatistic> CreateAsync(UserErrorStatistic statistic);
    Task<UserErrorStatistic> UpdateAsync(UserErrorStatistic statistic);
    Task<UserErrorStatistic> IncrementErrorCountAsync(int userId, int criteriaId, int partId, int levelId);
}
