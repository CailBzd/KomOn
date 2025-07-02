using System.ComponentModel.DataAnnotations;

namespace KomOn.Core.Entities;

public class Message
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid SenderId { get; set; }
    public virtual User Sender { get; set; } = null!;
    
    [Required]
    public Guid ReceiverId { get; set; }
    public virtual User Receiver { get; set; } = null!;
    
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;
    
    public MessageType Type { get; set; } = MessageType.Text;
    
    public bool IsRead { get; set; } = false;
    
    public DateTime ReadAt { get; set; }
    
    public Guid? EventId { get; set; }
    public virtual Event? Event { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum MessageType
{
    Text,
    Image,
    File,
    System
} 