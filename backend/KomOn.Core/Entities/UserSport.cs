using System.ComponentModel.DataAnnotations;

namespace KomOn.Core.Entities;

public class UserSport
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    [Required]
    public Guid SportId { get; set; }
    public virtual Sport Sport { get; set; } = null!;
    
    public SkillLevel SkillLevel { get; set; } = SkillLevel.Beginner;
    
    public bool IsFavorite { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum SkillLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
} 