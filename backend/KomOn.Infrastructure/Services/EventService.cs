using KomOn.Core.Entities;
using KomOn.Core.Interfaces;

namespace KomOn.Infrastructure.Services;

public class EventService : IEventService
{
    // Stockage temporaire en mémoire pour les tests
    private static readonly Dictionary<Guid, Event> _events = new();

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

    public async Task<Event> UpdateEventAsync(Guid id, Event evt)
    {
        if (_events.TryGetValue(id, out var existingEvent))
        {
            existingEvent.Title = evt.Title;
            existingEvent.Description = evt.Description;
            existingEvent.Location = evt.Location;
            existingEvent.StartDate = evt.StartDate;
            existingEvent.EndDate = evt.EndDate;
            existingEvent.MaxParticipants = evt.MaxParticipants;
            existingEvent.UpdatedAt = DateTime.UtcNow;
            
            return await Task.FromResult(existingEvent);
        }
        
        throw new ArgumentException("Événement non trouvé");
    }

    public async Task<bool> DeleteEventAsync(Guid id)
    {
        return await Task.FromResult(_events.Remove(id));
    }

    public async Task<bool> CancelEventAsync(Guid id)
    {
        if (_events.TryGetValue(id, out var evt))
        {
            evt.Status = EventStatus.Cancelled;
            evt.UpdatedAt = DateTime.UtcNow;
            return true;
        }
        return false;
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
        // TODO: Implémenter avec les inscriptions réelles
        return await Task.FromResult(0);
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
} 