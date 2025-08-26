using System.ComponentModel.DataAnnotations;

namespace KomOn.Core.Entities;

public class Event
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Location { get; set; } = string.Empty;
    
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    [Required]
    public Guid SportId { get; set; }
    public virtual Sport Sport { get; set; } = null!;
    
    [Required]
    public Guid OrganizerId { get; set; }
    public virtual User Organizer { get; set; } = null!;
    
    public int MaxParticipants { get; set; }
    
    public decimal Price { get; set; }
    
    public EventStatus Status { get; set; } = EventStatus.Draft;
    
    public EventType Type { get; set; } = EventType.Competition;
    
    public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Beginner;
    
    [MaxLength(500)]
    public string? Requirements { get; set; }
    
    [MaxLength(255)]
    public string? ImageUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Nouvelles propriétés avancées pour les événements
    public string Visibility { get; set; } = "public"; // public, private, invitation
    public string RegistrationType { get; set; } = "automatic"; // automatic, approval, invitation_only
    public bool WaitingListEnabled { get; set; } = false;
    public int MaxWaitingList { get; set; } = 5;
    public string ContributionType { get; set; } = "none"; // none, fixed, variable
    public decimal ContributionAmount { get; set; } = 0;
    public string? ContributionDescription { get; set; }
    public bool AllowGuests { get; set; } = false;
    public int MaxGuestsPerParticipant { get; set; } = 1;
    public bool AutoApproveRegistrations { get; set; } = true;
    public bool RequirePhoneNumber { get; set; } = false;
    public bool RequireEmergencyContact { get; set; } = false;
    public string? CancellationPolicy { get; set; }
    public string? RefundPolicy { get; set; }
    
    // Navigation properties
    public virtual ICollection<EventRegistration> Registrations { get; set; } = new List<EventRegistration>();
}

public enum EventStatus
{
    Draft,
    Published,
    Cancelled,
    Completed
}

public enum EventType
{
    Competition,
    Training,
    Tournament,
    Exhibition,
    Workshop
}

public enum DifficultyLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
} 