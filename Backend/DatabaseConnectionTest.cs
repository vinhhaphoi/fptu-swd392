using Npgsql;
using System;

class Program
{
    static void Main()
    {
        // Your Supabase connection string
        string connectionString = "Host=aws-1-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.jlyaginvztjbycwnzelp;Password=swd391vstepwriting;Ssl Mode=Require;Trust Server Certificate=true;Pooling=true";
        
        try
        {
            using var connection = new NpgsqlConnection(connectionString);
            connection.Open();
            
            // Test basic query
            using var cmd = new NpgsqlCommand("SELECT 1 as test", connection);
            var result = cmd.ExecuteScalar();
            
            Console.WriteLine($"✅ Database connection successful! Test result: {result}");
            
            // Check if profiles table exists
            var tableCheckCmd = new NpgsqlCommand("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles')", connection);
            var tableExists = (bool)tableCheckCmd.ExecuteScalar();
            
            Console.WriteLine($"Profiles table exists: {tableExists}");
            
            if (tableExists)
            {
                // Check table structure
                var structureCmd = new NpgsqlCommand("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position", connection);
                using var reader = structureCmd.ExecuteReader();
                
                Console.WriteLine("\nProfiles table structure:");
                while (reader.Read())
                {
                    Console.WriteLine($"  {reader["column_name"]}: {reader["data_type"]}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Database connection failed: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}