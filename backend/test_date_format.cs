using System;
using System.Text.Json;

// Test simple pour vérifier le format de date
public class DateFormatTest
{
    public static void Main()
    {
        // Test 1: Format de date depuis Supabase
        var dateFromSupabase = "1991-05-07";
        var parsedDate = DateTime.Parse(dateFromSupabase);
        Console.WriteLine($"Date depuis Supabase: {dateFromSupabase}");
        Console.WriteLine($"Date parsée: {parsedDate}");
        Console.WriteLine($"Format ISO: {parsedDate.ToString("yyyy-MM-dd")}");
        Console.WriteLine($"Format français: {parsedDate.ToString("dd/MM/yyyy")}");
        
        // Test 2: Format pour le frontend
        var dateForFrontend = parsedDate.ToString("yyyy-MM-dd");
        Console.WriteLine($"Format pour frontend: {dateForFrontend}");
        
        // Test 3: Test de parsing sécurisé
        var testDates = new[] { "1991-05-07", "07/05/1991", "1991-05-07T00:00:00", "1991-05-07 00:00:00" };
        
        foreach (var testDate in testDates)
        {
            try
            {
                var parsed = DateTime.Parse(testDate);
                Console.WriteLine($"'{testDate}' -> {parsed:yyyy-MM-dd}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"'{testDate}' -> Erreur: {ex.Message}");
            }
        }
    }
} 