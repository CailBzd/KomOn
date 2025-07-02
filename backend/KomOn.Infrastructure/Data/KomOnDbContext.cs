using KomOn.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace KomOn.Infrastructure.Data;

public class KomOnDbContext : DbContext
{
    public KomOnDbContext(DbContextOptions<KomOnDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Sport> Sports { get; set; }
    public DbSet<EventRegistration> EventRegistrations { get; set; }
    public DbSet<UserSport> UserSports { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
        });

        // Event configuration
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(255);
            entity.HasOne(e => e.Organizer)
                  .WithMany(u => u.OrganizedEvents)
                  .HasForeignKey(e => e.OrganizerId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Sport)
                  .WithMany(s => s.Events)
                  .HasForeignKey(e => e.SportId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Sport configuration
        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // EventRegistration configuration
        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Event)
                  .WithMany(ev => ev.Registrations)
                  .HasForeignKey(e => e.EventId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.EventRegistrations)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.EventId, e.UserId }).IsUnique();
        });

        // UserSport configuration
        modelBuilder.Entity<UserSport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.UserSports)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Sport)
                  .WithMany(s => s.UserSports)
                  .HasForeignKey(e => e.SportId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.SportId }).IsUnique();
        });

        // Message configuration
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
            entity.HasOne(e => e.Sender)
                  .WithMany(u => u.SentMessages)
                  .HasForeignKey(e => e.SenderId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Receiver)
                  .WithMany(u => u.ReceivedMessages)
                  .HasForeignKey(e => e.ReceiverId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Event)
                  .WithMany()
                  .HasForeignKey(e => e.EventId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Sports
        var sports = new List<Sport>
        {
            new Sport { Id = Guid.NewGuid(), Name = "Football", Description = "Sport de ballon le plus populaire au monde", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Basketball", Description = "Sport de ballon avec panier", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Tennis", Description = "Sport de raquette", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Running", Description = "Course à pied", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Cyclisme", Description = "Sport de vélo", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Natation", Description = "Sport aquatique", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Volleyball", Description = "Sport de ballon avec filet", IsActive = true },
            new Sport { Id = Guid.NewGuid(), Name = "Badminton", Description = "Sport de raquette léger", IsActive = true }
        };

        modelBuilder.Entity<Sport>().HasData(sports);
    }
} 