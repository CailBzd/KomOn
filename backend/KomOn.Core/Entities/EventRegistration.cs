using System.ComponentModel.DataAnnotations;

namespace KomOn.Core.Entities;

public class EventRegistration
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid EventId { get; set; }
    public virtual Event Event { get; set; } = null!;
    
    [Required]
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
    public decimal? PaymentAmount { get; set; }
    
    [MaxLength(255)]
    public string? PaymentId { get; set; }
    
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum RegistrationStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Waitlisted
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
} 