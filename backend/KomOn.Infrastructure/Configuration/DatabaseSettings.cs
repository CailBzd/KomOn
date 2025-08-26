namespace KomOn.Infrastructure.Configuration;

public class DatabaseSettings
{
    public const string SectionName = "Database";
    
    public string Provider { get; set; } = "PostgreSQL";
    public string ConnectionStringName { get; set; } = "DefaultConnection";
    public bool EnableDetailedErrors { get; set; } = false;
    public bool EnableSensitiveDataLogging { get; set; } = false;
    public bool AutoMigrate { get; set; } = false;
    public int CommandTimeout { get; set; } = 30;
    public bool EnableRetryOnFailure { get; set; } = true;
    public int MaxRetryCount { get; set; } = 3;
    public int RetryDelaySeconds { get; set; } = 5;
}

public class ConnectionStringSettings
{
    public const string SectionName = "ConnectionStrings";
    
    public string DefaultConnection { get; set; } = string.Empty;
    public string PostgreSQL { get; set; } = string.Empty;
    
    public string GetConnectionString(string name)
    {
        return name switch
        {
            "DefaultConnection" => DefaultConnection,
            "PostgreSQL" => PostgreSQL,
            _ => DefaultConnection
        };
    }
} 