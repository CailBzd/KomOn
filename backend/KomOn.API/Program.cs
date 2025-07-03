using KomOn.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using KomOn.Core.Interfaces;
using KomOn.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<KomOnDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Services
builder.Services.AddScoped<IEventService, KomOn.Infrastructure.Services.EventService>();
builder.Services.AddScoped<IUserService, KomOn.Infrastructure.Services.UserService>();
builder.Services.AddScoped<IAuthService, KomOn.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<IPaymentService, KomOn.Infrastructure.Services.PaymentService>();
builder.Services.AddScoped<KomOn.API.Services.AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Swagger toujours activé pour la documentation API
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    // Configuration spécifique au développement si nécessaire
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialiser l'utilisateur de test par défaut
await KomOn.Infrastructure.Services.UserService.InitializeDefaultTestUserAsync();

// Global exception handler
// app.UseMiddleware<ExceptionHandlingMiddleware>(); // TODO: Décommenter si le middleware existe

app.Run(); 