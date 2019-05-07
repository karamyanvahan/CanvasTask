using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CanvasTask
{
    public class Rectangle: Shape
    {
        public Rectangle()
        {
            Type = "Rectangle";
        }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
