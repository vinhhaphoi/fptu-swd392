using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;

class Program
{
    static async Task Main()
    {
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("accept", "text/plain");
        
        var json = @"{
            ""name"": ""TrungKien"",
            ""username"": ""trungkien20"",
            ""email"": ""trungkien20@gmail.com"",
            ""phoneNumber"": ""0900000000"",
            ""password"": ""TrungKien20@""
        }";
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        try
        {
            Console.WriteLine("Sending registration request...");
            var response = await client.PostAsync("https://localhost:7061/api/auth/register", content);
            
            Console.WriteLine($"Status Code: {response.StatusCode}");
            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response: {responseContent}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}