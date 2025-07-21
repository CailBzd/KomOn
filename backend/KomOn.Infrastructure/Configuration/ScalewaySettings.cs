namespace KomOn.Infrastructure.Configuration;

public class ScalewaySettings
{
    public string ProjectId { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string Region { get; set; } = "fr-par";
    public string DatabaseUrl { get; set; } = string.Empty;
} 