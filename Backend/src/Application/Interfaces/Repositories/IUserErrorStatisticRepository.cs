using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserErrorStatisticRepository
{
    Task<List<UserErrorStatistic>> GetByUserIdAsync(Guid userId);
    Task<UserErrorStatistic?> GetAsync(Guid userId, int criteriaId, int partId, int levelId);
    Task<UserErrorStatistic> CreateAsync(UserErrorStatistic statistic);
    Task<UserErrorStatistic> UpdateAsync(UserErrorStatistic statistic);
}
