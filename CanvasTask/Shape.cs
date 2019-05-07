using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CanvasTask
{
    public abstract class Shape
    {
        public string Color { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string Type { get; set; }

        public static Shape GetRandomShape(int canvasWidth, int canvasHeight)
        {
            Random rnd = new Random();
            bool isRect = rnd.Next(2) == 1;
            Shape shape;
            if(isRect)
            {
                Rectangle rect = new Rectangle()
                {
                    Width = rnd.Next(50, canvasWidth - 10),
                    Height = rnd.Next(50, canvasHeight - 10),
                };

                rect.X = rnd.Next(10, canvasWidth - rect.Width - 5);
                rect.Y = rnd.Next(10, canvasHeight - rect.Height - 5);

                shape = rect;
            }
            else
            {
                Circle circle = new Circle() { Radius = rnd.Next(50, Math.Min(canvasWidth, canvasHeight) / 2 - 10) };
                circle.X = rnd.Next(circle.Radius + 5, canvasWidth - circle.Radius - 5);
                circle.Y = rnd.Next(circle.Radius + 5, canvasHeight - circle.Radius - 5);

                shape = circle;
            }
            shape.Color = $"rgba({rnd.Next(0, 200)}, {rnd.Next(0, 200)}, {rnd.Next(0, 200)})";

            return shape;
        }
    }
}
