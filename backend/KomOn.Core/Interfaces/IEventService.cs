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
    Task<Event> UpdateEventAsync(Guid id, Event eventEntity);
    Task<bool> DeleteEventAsync(Guid id);
    Task<bool> CancelEventAsync(Guid id);
    Task<int> GetEventRegistrationCountAsync(Guid eventId);
    Task<bool> IsEventFullAsync(Guid eventId);
} 