using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CanvasTask
{
    public class Circle: Shape
    {
        public Circle()
        {
            Type = "Circle";
        }
        public int Radius { get; set; }
    }
}
