using System;
using System.Drawing;
using System.Windows.Forms;

class ChartDrawer : Form
{
    private int M;
    private int N;
    private double p;

    private TextBox MTextBox;
    private TextBox NTextBox;
    private TextBox pTextBox;

    public ChartDrawer()
    {
        Text = "Homework 3";
        Size = new Size(800, 600);
        DoubleBuffered = true;

        MTextBox = new TextBox();
        MTextBox.Text = "5";
        MTextBox.Location = new Point(10, 10);

        NTextBox = new TextBox();
        NTextBox.Text = "10";
        NTextBox.Location = new Point(10, 40);

        pTextBox = new TextBox();
        pTextBox.Text = "0.5";
        pTextBox.Location = new Point(10, 70);

        Controls.Add(MTextBox);
        Controls.Add(NTextBox);
        Controls.Add(pTextBox);

        Paint += new PaintEventHandler(OnPaint);
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);

        M = Convert.ToInt32(MTextBox.Text);
        N = Convert.ToInt32(NTextBox.Text);
        p = Convert.ToDouble(pTextBox.Text);

        Graphics g = e.Graphics;
        DrawChart(M, N, p, "original", g, ClientSize.Width, ClientSize.Height);
    }

    private void DrawChart(int M, int N, double p, string type, Graphics g, int width, int height)
    {
       private void DrawChart(int M, int N, double p, string type, Graphics g, int width, int height)
{
    // Calcola i fattori di scala
    float xScale = (width - 100) / N;
    float yScale = height / (2 * N);

    // Definisci i colori
    Color[] colors = GenerateColors(M);

    // Disegna l'asse delle ordinate
    Pen axisPen = new Pen(Color.Black);
    g.DrawLine(axisPen, 50, 0, 50, height);
    g.DrawLine(axisPen, 50, height / 2, width, height / 2);

    // Disegna le linee orizzontali
    Pen gridPen = new Pen(Color.LightGray, 1);
    for (int i = -N; i <= N; i += 2)
    {
        g.DrawLine(gridPen, 50, height / 2 - i * yScale, width, height / 2 - i * yScale);
    }

    // Etichette sull'asse delle ordinate
    Font labelFont = new Font("Arial", 10);
    Brush labelBrush = new SolidBrush(Color.Black);
    StringFormat labelFormat = new StringFormat();
    labelFormat.Alignment = StringAlignment.Far;
    labelFormat.LineAlignment = StringAlignment.Center;
    for (int i = -N; i <= N; i += 2)
    {
        if (i == N || i == -N)
            labelFormat.LineAlignment = StringAlignment.Near;
        else
            labelFormat.LineAlignment = StringAlignment.Center;
        g.DrawString(i.ToString(), labelFont, labelBrush, 40, height / 2 - i * yScale, labelFormat);
    }

    // Etichette sull'asse delle ascisse
    labelFormat.Alignment = StringAlignment.Center;
    labelFormat.LineAlignment = StringAlignment.Far;
    for (int i = 1; i <= N; i++)
    {
        float horizontalAdjustment = 0;
        if (i == N)
            horizontalAdjustment = -15;
        g.DrawString(i.ToString(), labelFont, labelBrush, 50 + i * xScale + horizontalAdjustment, height / 2 + 10, labelFormat);
    }

    // Simula i punteggi e disegna il grafico
    for (int system = 0; system < M; system++)
    {
        List<int> scores = SimulateScore(N, p, type);
        Pen linePen = new Pen(colors[system], 2);
        for (int attack = 0; attack < N - 1; attack++)
        {
            float x1 = 50 + (attack * xScale);
            float y1 = height / 2 - scores[attack] * yScale;
            float x2 = 50 + ((attack + 1) * xScale);
            float y2 = height / 2 - scores[attack + 1] * yScale;

            g.DrawLine(linePen, x1, y1, x2, y2);
        }
    }
}

private List<int> SimulateScore(int N, double p, string type)
{
    List<int> scores = new List<int>();
    int score = 0;
    for (int i = 0; i < N; i++)
    {
        double probability = new Random().NextDouble();
        switch (type)
        {
            case "original":
                score += (probability < p) ? -1 : 1;
                break;
            case "1b":
                score += (probability < p) ? 0 : 1;
                break;
            case "1c":
                score += (probability < p) ? 0 : 1;
                score /= (i + 1);
                break;
            case "1d":
                score += (probability < p) ? 0 : 1;
                score /= (int)Math.Sqrt(i + 1);
                break;
        }
        scores.Add(score);
    }
    return scores;
}

private Color[] GenerateColors(int count)
{
    Color[] colors = new Color[count];
    for (int i = 0; i < count; i++)
    {
        int hue = (i * 360) / count;
        colors[i] = ColorFromAhsb(255, hue, 1.0f, 0.5f);
    }
    return colors;
}

// Helper function to create a color from alpha, hue, saturation, and brightness values
private Color ColorFromAhsb(int alpha, int hue, float saturation, float brightness)
{
    float fMax, fMid, fMin;
    int hi = (int)(hue / 60.0) % 6;
    float f = hue / 60.0f - hi;
    float f1 = 1 - f;

    fMax = brightness;
    fMin = brightness * (1.0f - saturation);
    fMid = brightness * (1.0f - f * saturation);

    int red, green, blue;

    red = green = blue = (int)(brightness * 255);

    switch (hi)
    {
        case 0:
            red = (int)(fMax * 255);
            green = (int)(fMid * 255);
            blue = (int)(fMin * 255);
            break;
        case 1:
            red = (int)(fMid * 255);
            green = (int)(fMax * 255);
            blue = (int)(fMin * 255);
            break;
        case 2:
            red = (int)(fMin * 255);
            green = (int)(fMax * 255);
            blue = (int)(fMax * 255);
            break;
        case 3:
            red = (int)(fMin * 255);
            green = (int)(fMid * 255);
            blue = (int)(fMax * 255);
            break;
        case 4:
            red = (int)(fMid * 255);
            green = (int)(fMin * 255);
            blue = (int)(fMax * 255);
            break;
        case 5:
            red = (int)(fMax * 255);
            green = (int)(fMin * 255);
            blue = (int)(fMid * 255);
            break;
    }

    return Color.FromArgb(alpha, red, green, blue);
}


    }

    [STAThread]
    public static void Main()
    {
        Application.Run(new ChartDrawer());
    }
}
