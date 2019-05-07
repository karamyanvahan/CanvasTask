using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace CanvasTask.Controllers
{
    public class HomeController: Controller
    {
        IConfiguration configuration;

        public HomeController(IConfiguration conf)
        {
            configuration = conf;
        }

        public ViewResult Index() => View();

        [Route("/getshape/{canvasWidth}/{canvasHeight}")]
        public JsonResult GetShape(int canvasWidth, int canvasHeight)
        {
            return Json(Shape.GetRandomShape(canvasWidth, canvasHeight));
        }

        [HttpPost]
        public StatusCodeResult Save([FromBody]string imageData)
        {
            //string storagePath = configuration.GetValue<string>("ImageStorage");

            //List<string> images;

            //using (StreamReader sr = new StreamReader(storagePath))
            //{
            //    images = JsonConvert.DeserializeObject<List<string>>(sr.ReadToEnd());
            //}

            //images.Insert(0, imageData);

            //using (StreamWriter sr = new StreamWriter(storagePath))
            //{
            //    sr.Write(JsonConvert.SerializeObject(images));
            //}

            //return StatusCode(200);

            string imageListPath = configuration.GetValue<string>("imageList");
            string imageListString;
            string fileName = Path.GetRandomFileName() + ".png";
            string imagePath = Path.Join(configuration.GetValue<string>("ImageStorage"), fileName);

            using (FileStream fs = new FileStream(imagePath, FileMode.Create))
            {
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    byte[] data = Convert.FromBase64String(imageData);
                    bw.Write(data);
                    bw.Close();
                }
            }

            using (StreamReader sr = new StreamReader(imageListPath))
            {
                imageListString = sr.ReadToEnd();
            }

            List<string> imageList = JsonConvert.DeserializeObject<List<string>>(imageListString);
            imageList.Insert(0, fileName);

            using (StreamWriter sw = new StreamWriter(imageListPath))
            {
                sw.Write(JsonConvert.SerializeObject(imageList));
            }

            return StatusCode(200);
        }

        public JsonResult getImages()
        {
            string imageListPath = configuration.GetValue<string>("imageList");
            string imageList;
            using (StreamReader sr = new StreamReader(imageListPath))
            {
                imageList = sr.ReadToEnd();
            }

            return Json(imageList);
        }
    }
}
