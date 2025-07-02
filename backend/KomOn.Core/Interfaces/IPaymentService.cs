using KomOn.Core.Entities;

namespace KomOn.Core.Interfaces;

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency, string description);
    Task<bool> ProcessPaymentAsync(string paymentIntentId);
    Task<bool> RefundPaymentAsync(string paymentIntentId, decimal? amount = null);
    Task<PaymentStatus> GetPaymentStatusAsync(string paymentIntentId);
    Task<IEnumerable<EventRegistration>> GetUserPaymentsAsync(Guid userId);
    Task<decimal> GetTotalRevenueAsync(Guid organizerId, DateTime? startDate = null, DateTime? endDate = null);
} 