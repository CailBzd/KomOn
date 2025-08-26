using KomOn.Core.Entities;
using KomOn.Core.Interfaces;

namespace KomOn.Infrastructure.Services;

public class EventService : IEventService
{
    // Stockage temporaire en mémoire pour les tests
    private static readonly Dictionary<Guid, Event> _events = new();
    
    // Constructeur pour initialiser des événements de test
    public EventService()
    {
        InitializeTestEvents();
    }
    
    private void InitializeTestEvents()
    {
        if (_events.Count > 0) return; // Déjà initialisé
        
        var testEvents = new List<Event>
        {
            new Event
            {
                Id = Guid.NewGuid(),
                Title = "Match de foot amical",
                Description = "Match de football amical au parc des sports. Tous niveaux acceptés !",
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(2).AddHours(2),
                Location = "Parc des Sports, Lyon",
                Latitude = 45.7578137,
                Longitude = 4.8320114,
                SportId = Guid.NewGuid(), // Sport temporaire
                OrganizerId = Guid.NewGuid(), // Organisateur temporaire
                MaxParticipants = 22,
                Price = 0,
                DifficultyLevel = DifficultyLevel.Beginner,
                Requirements = "Chaussures de sport, tenue confortable",
                Status = EventStatus.Published,
                Type = EventType.Competition,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Event
            {
                Id = Guid.NewGuid(),
                Title = "Course à pied matinale",
                Description = "Course à pied de 5km dans le parc de la Tête d'Or",
                StartDate = DateTime.UtcNow.AddDays(1),
                EndDate = DateTime.UtcNow.AddDays(1).AddHours(1),
                Location = "Parc de la Tête d'Or, Lyon",
                Latitude = 45.7772,
                Longitude = 4.8559,
                SportId = Guid.NewGuid(),
                OrganizerId = Guid.NewGuid(),
                MaxParticipants = 50,
                Price = 5,
                DifficultyLevel = DifficultyLevel.Intermediate,
                Requirements = "Chaussures de running",
                Status = EventStatus.Published,
                Type = EventType.Training,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Event
            {
                Id = Guid.NewGuid(),
                Title = "Tournoi de tennis",
                Description = "Tournoi de tennis en simple et double",
                StartDate = DateTime.UtcNow.AddDays(5),
                EndDate = DateTime.UtcNow.AddDays(5).AddHours(4),
                Location = "Tennis Club de Lyon",
                Latitude = 45.7640,
                Longitude = 4.8357,
                SportId = Guid.NewGuid(),
                OrganizerId = Guid.NewGuid(),
                MaxParticipants = 32,
                Price = 15,
                DifficultyLevel = DifficultyLevel.Advanced,
                Requirements = "Raquette de tennis, tenue de sport",
                Status = EventStatus.Published,
                Type = EventType.Tournament,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };
        
        foreach (var evt in testEvents)
        {
            _events[evt.Id] = evt;
        }
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await Task.FromResult(_events.Values);
    }

    public async Task<Event?> GetEventByIdAsync(Guid id)
    {
        return await Task.FromResult(_events.TryGetValue(id, out var evt) ? evt : null);
    }

    public async Task<Event> CreateEventAsync(Event evt)
    {
        evt.Id = Guid.NewGuid();
        evt.CreatedAt = DateTime.UtcNow;
        evt.UpdatedAt = DateTime.UtcNow;
        
        _events[evt.Id] = evt;
        return await Task.FromResult(evt);
    }

    public async Task<Event> UpdateEventAsync(Event evt)
    {
        if (_events.TryGetValue(evt.Id, out var existingEvent))
        {
            existingEvent.Title = evt.Title;
            existingEvent.Description = evt.Description;
            existingEvent.Location = evt.Location;
            existingEvent.StartDate = evt.StartDate;
            existingEvent.EndDate = evt.EndDate;
            existingEvent.MaxParticipants = evt.MaxParticipants;
            existingEvent.Latitude = evt.Latitude;
            existingEvent.Longitude = evt.Longitude;
            existingEvent.Price = evt.Price;
            existingEvent.DifficultyLevel = evt.DifficultyLevel;
            existingEvent.Requirements = evt.Requirements;
            existingEvent.UpdatedAt = DateTime.UtcNow;
            
            return await Task.FromResult(existingEvent);
        }
        
        throw new ArgumentException("Événement non trouvé");
    }

    public async Task<bool> DeleteEventAsync(Guid id)
    {
        return await Task.FromResult(_events.Remove(id));
    }

    public Task<bool> CancelEventAsync(Guid id)
    {
        if (_events.TryGetValue(id, out var evt))
        {
            evt.Status = EventStatus.Cancelled;
            evt.UpdatedAt = DateTime.UtcNow;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public async Task<IEnumerable<Event>> GetEventsByOrganizerAsync(Guid organizerId)
    {
        var events = _events.Values.Where(e => e.OrganizerId == organizerId);
        return await Task.FromResult(events);
    }

    public async Task<IEnumerable<Event>> GetEventsBySportAsync(Guid sportId)
    {
        var events = _events.Values.Where(e => e.SportId == sportId);
        return await Task.FromResult(events);
    }

    public async Task<IEnumerable<Event>> SearchEventsAsync(string searchTerm, Guid? sportId = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        var events = _events.Values.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            events = events.Where(e => e.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                     e.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                     e.Location.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
        }

        if (sportId.HasValue)
        {
            events = events.Where(e => e.SportId == sportId.Value);
        }

        if (startDate.HasValue)
        {
            events = events.Where(e => e.StartDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            events = events.Where(e => e.EndDate <= endDate.Value);
        }

        return await Task.FromResult(events.ToList());
    }

    public async Task<int> GetEventRegistrationCountAsync(Guid eventId)
    {
        var count = _registrations.Values.Count(r => r.EventId == eventId && r.Status == RegistrationStatus.Confirmed);
        return await Task.FromResult(count);
    }

    public async Task<bool> IsEventFullAsync(Guid eventId)
    {
        if (_events.TryGetValue(eventId, out var evt))
        {
            var registrationCount = await GetEventRegistrationCountAsync(eventId);
            return registrationCount >= evt.MaxParticipants;
        }
        return false;
    }
    
    // Méthodes pour les inscriptions
    private static readonly Dictionary<Guid, EventRegistration> _registrations = new();
    
    public async Task<EventRegistration?> GetEventRegistrationAsync(Guid eventId, Guid userId)
    {
        var registration = _registrations.Values.FirstOrDefault(r => r.EventId == eventId && r.UserId == userId);
        return await Task.FromResult(registration);
    }
    
    public async Task<IEnumerable<EventRegistration>> GetEventRegistrationsAsync(Guid eventId)
    {
        var registrations = _registrations.Values.Where(r => r.EventId == eventId);
        return await Task.FromResult(registrations);
    }
    
    public async Task<EventRegistration> RegisterToEventAsync(EventRegistration registration)
    {
        registration.Id = Guid.NewGuid();
        registration.RegistrationDate = DateTime.UtcNow;
        registration.CreatedAt = DateTime.UtcNow;
        registration.UpdatedAt = DateTime.UtcNow;
        
        _registrations[registration.Id] = registration;
        return await Task.FromResult(registration);
    }
    
    public async Task<bool> UnregisterFromEventAsync(Guid eventId, Guid userId)
    {
        var registration = _registrations.Values.FirstOrDefault(r => r.EventId == eventId && r.UserId == userId);
        if (registration != null)
        {
            return await Task.FromResult(_registrations.Remove(registration.Id));
        }
        return await Task.FromResult(false);
    }
} 