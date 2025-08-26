using Microsoft.AspNetCore.Mvc;
using KomOn.Core.Interfaces;
using KomOn.Core.Entities;
using KomOn.Core.DTOs;
using System.Security.Claims;

namespace KomOn.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IUserService _userService;
    private readonly ILogger<EventController> _logger;

    public EventController(
        IEventService eventService,
        IUserService userService,
        ILogger<EventController> logger)
    {
        _eventService = eventService;
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Récupère tous les événements avec filtres optionnels
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllEvents(
        [FromQuery] string? location = null,
        [FromQuery] double? latitude = null,
        [FromQuery] double? longitude = null,
        [FromQuery] int? radius = null,
        [FromQuery] string? sport = null)
    {
        try
        {
            _logger.LogInformation("📅 Récupération des événements avec filtres: Location={Location}, Lat={Latitude}, Lng={Longitude}, Radius={Radius}, Sport={Sport}", 
                location, latitude, longitude, radius, sport);

            var events = await _eventService.GetAllEventsAsync();

            // Filtrer par localisation si spécifié
            if (!string.IsNullOrEmpty(location))
            {
                events = events.Where(e => e.Location != null && 
                    e.Location.Contains(location, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Filtrer par géolocalisation si spécifié
            if (latitude.HasValue && longitude.HasValue && radius.HasValue)
            {
                events = events.Where(e => e.Latitude != 0 && e.Longitude != 0).ToList();
                
                // Calculer la distance et filtrer par rayon
                var filteredEvents = new List<Event>();
                foreach (var evt in events)
                {
                    var distance = CalculateDistance(
                        latitude.Value, longitude.Value,
                        evt.Latitude, evt.Longitude);
                    
                    if (distance <= radius.Value)
                    {
                        filteredEvents.Add(evt);
                    }
                }
                events = filteredEvents;
            }

            // Filtrer par sport si spécifié
            if (!string.IsNullOrEmpty(sport))
            {
                events = events.Where(e => e.Sport != null && 
                    e.Sport.Name.Contains(sport, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            _logger.LogInformation("✅ {Count} événements trouvés", events.Count());

            return Ok(new
            {
                success = true,
                data = events,
                count = events.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la récupération des événements");
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur",
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Récupère un événement par son ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(Guid id)
    {
        try
        {
            var evt = await _eventService.GetEventByIdAsync(id);
            
            if (evt == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Événement non trouvé"
                });
            }

            return Ok(new
            {
                success = true,
                data = evt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la récupération de l'événement {Id}", id);
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// Récupère les événements à venir
    /// </summary>
    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingEvents()
    {
        try
        {
            var events = await _eventService.GetAllEventsAsync();
            var upcomingEvents = events.Where(e => e.StartDate > DateTime.UtcNow)
                                     .OrderBy(e => e.StartDate)
                                     .Take(10)
                                     .ToList();

            return Ok(new
            {
                success = true,
                data = upcomingEvents,
                count = upcomingEvents.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la récupération des événements à venir");
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// Crée un nouvel événement
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
    {
        try
        {
            // Récupérer l'utilisateur connecté
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    error = "Utilisateur non authentifié"
                });
            }

            var evt = new Event
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Location = request.Location,
                Latitude = request.Latitude ?? 0,
                Longitude = request.Longitude ?? 0,
                MaxParticipants = request.MaxParticipants,
                Price = request.Price,
                DifficultyLevel = Enum.Parse<DifficultyLevel>(request.DifficultyLevel),
                Requirements = request.Requirements,
                OrganizerId = userId,
                SportId = request.SportId,
                Type = Enum.Parse<EventType>(request.Type ?? "Competition"),
                Status = Enum.Parse<EventStatus>(request.Status ?? "Published"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                
                // Nouvelles propriétés avancées
                Visibility = request.Visibility ?? "public",
                RegistrationType = request.RegistrationType ?? "automatic",
                WaitingListEnabled = request.WaitingListEnabled ?? false,
                MaxWaitingList = request.MaxWaitingList ?? 5,
                ContributionType = request.ContributionType ?? "none",
                ContributionAmount = request.ContributionAmount ?? 0,
                ContributionDescription = request.ContributionDescription,
                AllowGuests = request.AllowGuests ?? false,
                MaxGuestsPerParticipant = request.MaxGuestsPerParticipant ?? 1,
                AutoApproveRegistrations = request.AutoApproveRegistrations ?? true,
                RequirePhoneNumber = request.RequirePhoneNumber ?? false,
                RequireEmergencyContact = request.RequireEmergencyContact ?? false,
                CancellationPolicy = request.CancellationPolicy,
                RefundPolicy = request.RefundPolicy
            };

            var createdEvent = await _eventService.CreateEventAsync(evt);

            _logger.LogInformation("✅ Événement créé: {EventId} par {UserId}", createdEvent.Id, userId);

            return CreatedAtAction(nameof(GetEventById), new { id = createdEvent.Id }, new
            {
                success = true,
                data = createdEvent
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la création de l'événement");
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur",
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Met à jour un événement
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
    {
        try
        {
            var existingEvent = await _eventService.GetEventByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Événement non trouvé"
                });
            }

            // Vérifier que l'utilisateur est l'organisateur
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    error = "Utilisateur non authentifié"
                });
            }

            if (existingEvent.OrganizerId != userId)
            {
                return Forbid();
            }

            // Mettre à jour les propriétés
            existingEvent.Title = request.Title ?? existingEvent.Title;
            existingEvent.Description = request.Description ?? existingEvent.Description;
            existingEvent.StartDate = request.StartDate ?? existingEvent.StartDate;
            existingEvent.EndDate = request.EndDate ?? existingEvent.EndDate;
            existingEvent.Location = request.Location ?? existingEvent.Location;
            existingEvent.Latitude = request.Latitude ?? existingEvent.Latitude;
            existingEvent.Longitude = request.Longitude ?? existingEvent.Longitude;
            existingEvent.MaxParticipants = request.MaxParticipants ?? existingEvent.MaxParticipants;
            existingEvent.Price = request.Price ?? existingEvent.Price;
            if (!string.IsNullOrEmpty(request.DifficultyLevel))
            {
                existingEvent.DifficultyLevel = Enum.Parse<DifficultyLevel>(request.DifficultyLevel);
            }
            existingEvent.Requirements = request.Requirements ?? existingEvent.Requirements;
            existingEvent.UpdatedAt = DateTime.UtcNow;

            var updatedEvent = await _eventService.UpdateEventAsync(existingEvent);

            return Ok(new
            {
                success = true,
                data = updatedEvent
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la mise à jour de l'événement {Id}", id);
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// Supprime un événement
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        try
        {
            var existingEvent = await _eventService.GetEventByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Événement non trouvé"
                });
            }

            // Vérifier que l'utilisateur est l'organisateur
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    error = "Utilisateur non authentifié"
                });
            }

            if (existingEvent.OrganizerId != userId)
            {
                return Forbid();
            }

            await _eventService.DeleteEventAsync(id);

            return Ok(new
            {
                success = true,
                message = "Événement supprimé avec succès"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la suppression de l'événement {Id}", id);
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// S'inscrit à un événement
    /// </summary>
    [HttpPost("{id}/register")]
    public async Task<IActionResult> RegisterToEvent(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    error = "Utilisateur non authentifié"
                });
            }

            var evt = await _eventService.GetEventByIdAsync(id);
            if (evt == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Événement non trouvé"
                });
            }

            // Vérifier si l'utilisateur est déjà inscrit
            var existingRegistration = await _eventService.GetEventRegistrationAsync(id, userId);
            if (existingRegistration != null)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Vous êtes déjà inscrit à cet événement"
                });
            }

            // Vérifier si l'événement est complet
            var registrations = await _eventService.GetEventRegistrationsAsync(id);
            if (registrations.Count() >= evt.MaxParticipants)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "L'événement est complet"
                });
            }

            var registration = new EventRegistration
            {
                Id = Guid.NewGuid(),
                EventId = id,
                UserId = userId,
                RegistrationDate = DateTime.UtcNow,
                Status = RegistrationStatus.Confirmed
            };

            await _eventService.RegisterToEventAsync(registration);

            return Ok(new
            {
                success = true,
                message = "Inscription réussie"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de l'inscription à l'événement {Id}", id);
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// Se désinscrit d'un événement
    /// </summary>
    [HttpDelete("{id}/register")]
    public async Task<IActionResult> UnregisterFromEvent(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    error = "Utilisateur non authentifié"
                });
            }

            var registration = await _eventService.GetEventRegistrationAsync(id, userId);
            if (registration == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Inscription non trouvée"
                });
            }

            await _eventService.UnregisterFromEventAsync(id, userId);

            return Ok(new
            {
                success = true,
                message = "Désinscription réussie"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors de la désinscription de l'événement {Id}", id);
            return StatusCode(500, new
            {
                success = false,
                error = "Erreur interne du serveur"
            });
        }
    }

    /// <summary>
    /// Calcule la distance entre deux points géographiques (formule de Haversine)
    /// </summary>
    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; // Rayon de la Terre en kilomètres
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}

// DTOs pour les requêtes
public class CreateEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int MaxParticipants { get; set; }
    public decimal Price { get; set; }
    public string DifficultyLevel { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public Guid SportId { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
    
    // Nouvelles propriétés avancées
    public string? Visibility { get; set; }
    public string? RegistrationType { get; set; }
    public bool? WaitingListEnabled { get; set; }
    public int? MaxWaitingList { get; set; }
    public string? ContributionType { get; set; }
    public decimal? ContributionAmount { get; set; }
    public string? ContributionDescription { get; set; }
    public bool? AllowGuests { get; set; }
    public int? MaxGuestsPerParticipant { get; set; }
    public bool? AutoApproveRegistrations { get; set; }
    public bool? RequirePhoneNumber { get; set; }
    public bool? RequireEmergencyContact { get; set; }
    public string? CancellationPolicy { get; set; }
    public string? RefundPolicy { get; set; }
}

public class UpdateEventRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int? MaxParticipants { get; set; }
    public decimal? Price { get; set; }
    public string? DifficultyLevel { get; set; }
    public string? Requirements { get; set; }
} 