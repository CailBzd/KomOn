using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace KomOn.Core.Entities;

[Table("users")]
public class User
{
    [PrimaryKey("id")]
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [Column("username")]
    [Required]
    [MaxLength(50)]
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
    
    [Column("first_name")]
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = string.Empty;
    
    [Column("last_name")]
    [Required]
    [MaxLength(100)]
    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = string.Empty;
    
    [Column("email")]
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [Column("password_hash")]
    [Required]
    [MaxLength(255)]
    [JsonPropertyName("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Column("phone_number")]
    [MaxLength(20)]
    [JsonPropertyName("phone_number")]
    public string? PhoneNumber { get; set; }
    
    [Column("date_of_birth")]
    [JsonPropertyName("date_of_birth")]
    public DateTime DateOfBirth { get; set; }
    
    [Column("bio")]
    [MaxLength(500)]
    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
    
    [Column("profile_picture_url")]
    [MaxLength(255)]
    [JsonPropertyName("profile_picture_url")]
    public string? ProfilePictureUrl { get; set; }
    
    [Column("role")]
    [JsonPropertyName("role")]
    public string Role { get; set; } = "participant";
    
    [Column("status")]
    [JsonPropertyName("status")]
    public string Status { get; set; } = "active";
    
    [Column("created_at")]
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    [JsonPropertyName("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties (pour les relations futures)
    [JsonIgnore]
    public virtual ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();
    [JsonIgnore]
    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();
    [JsonIgnore]
    public virtual ICollection<UserSport> UserSports { get; set; } = new List<UserSport>();
    [JsonIgnore]
    public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
    [JsonIgnore]
    public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
} 