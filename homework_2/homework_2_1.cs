using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.IO;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        string filePath = "Professional_Life.xlsx";
        var fileInfo = new FileInfo(filePath);

        if (fileInfo.Exists)
        {
            using (var package = new ExcelPackage(fileInfo))
            {
                // Prima tabella: Background (degree)
                var sheet1 = package.Workbook.Worksheets["Sheet1"];
                var columnValues1 = sheet1.Cells[2, 2, sheet1.Dimension.End.Row, 2]
                    .Select(cell => cell.Text)
                    .ToList();

                var backgroundCounts = new Dictionary<string, int>();
                foreach (var background in columnValues1)
                {
                    if (!string.IsNullOrEmpty(background))
                    {
                        if (backgroundCounts.ContainsKey(background))
                        {
                            backgroundCounts[background]++;
                        }
                        else
                        {
                            backgroundCounts[background] = 1;
                        }
                    }
                }

                // Seconda tabella: Età
                var columnValues2 = sheet1.Cells[2, 16, sheet1.Dimension.End.Row, 16]
                    .Select(cell => cell.Text)
                    .ToList();

                var ageCounts = new Dictionary<string, int>();
                foreach (var age in columnValues2)
                {
                    if (!string.IsNullOrEmpty(age))
                    {
                        if (ageCounts.ContainsKey(age))
                        {
                            ageCounts[age]++;
                        }
                        else
                        {
                            ageCounts[age] = 1;
                        }
                    }
                }

                // Tabella di riferimento: Altezze
                var columnValues3 = sheet1.Cells[2, 18, sheet1.Dimension.End.Row, 18]
                    .Select(cell => cell.Text)
                    .ToList();

                var intervals = new List<string> { "1.50-1.59", "1.60-1.69", "1.70-1.79", "1.80-1.89", "1.90-1.99" };

                var intervalCounts = new Dictionary<string, int>();
                foreach (var value in columnValues3)
                {
                    var floatValue = double.Parse(value, System.Globalization.CultureInfo.InvariantCulture);
                    var interval = intervals.FirstOrDefault(i => floatValue >= double.Parse(i.Split('-')[0], System.Globalization.CultureInfo.InvariantCulture) && floatValue <= double.Parse(i.Split('-')[1], System.Globalization.CultureInfo.InvariantCulture));
                    if (interval != null)
                    {
                        if (intervalCounts.ContainsKey(interval))
                        {
                            intervalCounts[interval]++;
                        }
                        else
                        {
                            intervalCounts[interval] = 1;
                        }
                    }
                }

                // Salva i dati in un database SQLite
                using (SQLiteConnection connection = new SQLiteConnection("Data Source=mydatabase.db"))
                {
                    connection.Open();

                    // Crea una tabella per i dati
                    string createTableQuery = "CREATE TABLE IF NOT EXISTS Data (Background TEXT, Age TEXT, Interval TEXT, Count INT)";
                    using (SQLiteCommand createTableCommand = new SQLiteCommand(createTableQuery, connection))
                    {
                        createTableCommand.ExecuteNonQuery();
                    }

                    // Inserisci i dati nella tabella
                    foreach (var background in backgroundCounts)
                    {
                        string insertQuery = "INSERT INTO Data (Background, Count) VALUES (@Background, @Count)";
                        using (SQLiteCommand insertCommand = new SQLiteCommand(insertQuery, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@Background", background.Key);
                            insertCommand.Parameters.AddWithValue("@Count", background.Value);
                            insertCommand.ExecuteNonQuery();
                        }
                    }

                    foreach (var age in ageCounts)
                    {
                        string insertQuery = "INSERT INTO Data (Age, Count) VALUES (@Age, @Count)";
                        using (SQLiteCommand insertCommand = new SQLiteCommand(insertQuery, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@Age", age.Key);
                            insertCommand.Parameters.AddWithValue("@Count", age.Value);
                            insertCommand.ExecuteNonQuery();
                        }
                    }

                    foreach (var interval in intervalCounts)
                    {
                        string insertQuery = "INSERT INTO Data (Interval, Count) VALUES (@Interval, @Count)";
                        using (SQLiteCommand insertCommand = new SQLiteCommand(insertQuery, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@Interval", interval.Key);
                            insertCommand.Parameters.AddWithValue("@Count", interval.Value);
                            insertCommand.ExecuteNonQuery();
                        }
                    }
                }

            }
        }
    }
}
