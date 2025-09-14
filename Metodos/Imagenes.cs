using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace MITCSService.Metodos
{
    public class Imagenes
    {
        public static bool AgregarImagenes()
        {
            // Ruta de la carpeta donde se encuentran las imágenes
            string rutaCarpeta = @"C:\Users\rrojas\Source\Workspaces\MITCS HTML5\MITCS\MITCSSite\Website\Page\Images";

            // Crear una instancia del contexto de la base de datos
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            // Obtener todos los archivos .png en la carpeta
            var archivosImagen = Directory.GetFiles(rutaCarpeta, "*.png");

            // Recorrer cada archivo de imagen
            foreach (var archivo in archivosImagen)
            {
                // Obtener el nombre del archivo (sin la ruta completa)
                string nombreArchivo = Path.GetFileName(archivo);

                // Construir la URL de la imagen
                string imageUrl = $"Images/{nombreArchivo}";

                // Validar si ya existe un registro con la misma URL
                var imagenExistente = (from img in MITEventUATdb.MITCS_images
                                       where img.ImageURL == imageUrl
                                       select img).FirstOrDefault();

                if (imagenExistente == null)
                {
                    // Generar un ID único
                    string imageId = Guid.NewGuid().ToString("N");

                    // Crear una nueva instancia del registro de imagen
                    DataBase.MITCS_image nuevaImagen = new DataBase.MITCS_image
                    {
                        Image_id = imageId,
                        ImageURL = imageUrl
                    };

                    // Insertar el nuevo registro en la base de datos
                    MITEventUATdb.MITCS_images.InsertOnSubmit(nuevaImagen);
                }
            }

            try
            {
                // Guardar los cambios en la base de datos
                MITEventUATdb.SubmitChanges();
                return true;
            }
            catch (Exception ex)
            {
                // Manejar el error si ocurre
                return false;
            }
        }

        public static List<DataBase.MITCS_image> ObtenerImagenes()
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                try
                {
                    var imagenes = (from img in MITEventUATdb.MITCS_images
                                    select img).ToList();
                    return imagenes;
                }
                catch (Exception ex)
                {
                    // Manejar la excepción si es necesario
                    return null;
                }
            }
        }
    }
}