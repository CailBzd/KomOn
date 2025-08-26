using KomOn.Core.Entities;

namespace KomOn.Core.Interfaces;

public interface IEventService
{
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task<Event?> GetEventByIdAsync(Guid id);
    Task<IEnumerable<Event>> GetEventsBySportAsync(Guid sportId);
    Task<IEnumerable<Event>> GetEventsByOrganizerAsync(Guid organizerId);
    Task<IEnumerable<Event>> SearchEventsAsync(string searchTerm, Guid? sportId = null, DateTime? startDate = null, DateTime? endDate = null);
    Task<Event> CreateEventAsync(Event eventEntity);
    Task<Event> UpdateEventAsync(Event eventEntity);
    Task<bool> DeleteEventAsync(Guid id);
    Task<bool> CancelEventAsync(Guid id);
    Task<int> GetEventRegistrationCountAsync(Guid eventId);
    Task<bool> IsEventFullAsync(Guid eventId);
    
    // Méthodes pour les inscriptions
    Task<EventRegistration?> GetEventRegistrationAsync(Guid eventId, Guid userId);
    Task<IEnumerable<EventRegistration>> GetEventRegistrationsAsync(Guid eventId);
    Task<EventRegistration> RegisterToEventAsync(EventRegistration registration);
    Task<bool> UnregisterFromEventAsync(Guid eventId, Guid userId);
} 