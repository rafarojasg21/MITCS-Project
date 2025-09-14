using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.Submenu;

namespace MITCSService.Metodos
{
    public class Aplicacion
    {
        public class AplicacionConNombreSubmenu
        {
            public string Application_id { get; set; }
            public string Submenu_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string URL { get; set; }
            public string NombreSubmenu { get; set; }
        }

        //Clase para guardar la informacion del Join entre la tabla aplicacion y submenu
        public class AplicacionData
        {
            public string Application_id { get; set; }
            public string Submenu_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string URL { get; set; }
            public string SubmenuName { get; set; }
        }

        public static bool CrearAplicacion(string submenuID, string name, string description, string type, 
            string createdby, string URL)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_application NewRecord = new DataBase.MITCS_application();

            var Aplicacion_db = (from applications in MITEventUATdb.MITCS_applications
                                 where applications.Name.ToUpper() == name.ToUpper()
                                 select applications).FirstOrDefault();

            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                              where submenus.Submenu_id == submenuID
                              select submenus).FirstOrDefault();

            if (Aplicacion_db == null)
            {
                NewRecord.Application_id = Guid.NewGuid().ToString("N");
                NewRecord.Submenu_id = submenuID;
                NewRecord.Name = name;
                NewRecord.Description = description;
                NewRecord.Type = type;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Removed = false;
                NewRecord.URL = URL;

                MITEventUATdb.MITCS_applications.InsertOnSubmit(NewRecord);
                try
                {
                    MITEventUATdb.SubmitChanges();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }

            else
            {
                return false;
            }

        }

        public static bool EditarAplicacion(string id, string submenuID, string name, string description, 
            string type, string updatedby, string URL)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Aplicacion_db = (from applications in MITEventUATdb.MITCS_applications
                                 where applications.Application_id == id
                                 select applications).FirstOrDefault();

            if (Aplicacion_db != null)
            {
                Aplicacion_db.Submenu_id = submenuID;
                Aplicacion_db.Name = name;
                Aplicacion_db.Description = description;
                Aplicacion_db.Type = type;
                Aplicacion_db.UpdatedBy = updatedby;
                Aplicacion_db.Updated = DateTime.Now;
                Aplicacion_db.URL = URL;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool DesactivarAplicacion(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Aplicacion_db = (from applications in MITEventUATdb.MITCS_applications
                                 where applications.Application_id == id
                                 select applications).FirstOrDefault();

            if (Aplicacion_db != null)
            {
                Aplicacion_db.RemovedBy = removedby;
                Aplicacion_db.Removed = true;
                Aplicacion_db.RemovedDate = DateTime.Now;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool ActivarAplicacion(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Aplicacion_db = (from applications in MITEventUATdb.MITCS_applications
                              where applications.Application_id == id
                              select applications).FirstOrDefault();

            if (Aplicacion_db != null)
            {
                Aplicacion_db.Removed = false;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static List<AplicacionConNombreSubmenu> ListaAplicacion()
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                var aplicacionConNombreSubmenu = (from applications in MITEventUATdb.MITCS_applications
                                                  where applications.Removed == false
                                                  join submenus in MITEventUATdb.MITCS_submenus
                                                on applications.Submenu_id equals submenus.Submenu_id
                                                select new AplicacionConNombreSubmenu
                                                {
                                                    Application_id = applications.Application_id,
                                                    Submenu_id = applications.Submenu_id,
                                                    Name = applications.Name,
                                                    Description = applications.Description,
                                                    Type = applications.Type,
                                                    Created = applications.Created,
                                                    CreatedBy = applications.CreatedBy,
                                                    Updated = applications.Updated,
                                                    UpdatedBy = applications.UpdatedBy,
                                                    Removed = (bool)applications.Removed,
                                                    RemovedBy = applications.RemovedBy,
                                                    RemovedDate = applications.RemovedDate,
                                                    URL = applications.URL,
                                                    NombreSubmenu = submenus.Name
                                                }).ToList();

                return aplicacionConNombreSubmenu;
            }
        }

        public static AplicacionData[] AplicacionInfoToArray(string AplicacionID)
        {
            List<AplicacionData> objectList = new List<AplicacionData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Aplicacion_db = (from applications in MITEventUATdb.MITCS_applications
                                 join submenus in MITEventUATdb.MITCS_submenus 
                                 on applications.Submenu_id equals submenus.Submenu_id
                                 where applications.Application_id == AplicacionID
                                 select new { applications, submenus.Name }).ToList();

            foreach (var item in Aplicacion_db)
            {
                AplicacionData data = new AplicacionData();
                data.Application_id = item.applications.Application_id;
                data.Submenu_id = item.applications.Submenu_id;
                data.Name = item.applications.Name;
                data.Description = item.applications.Description;
                data.Type = item.applications.Type;
                data.Created = item.applications.Created;
                data.CreatedBy = item.applications.CreatedBy;
                data.Updated = item.applications.Updated;
                data.UpdatedBy = item.applications.UpdatedBy;
                data.Removed = (bool)item.applications.Removed;
                data.RemovedBy = item.applications.RemovedBy;
                data.RemovedDate = item.applications.RemovedDate;
                data.URL = item.applications.URL;
                data.SubmenuName = item.Name;

                objectList.Add(data);
            }

            return objectList.ToArray();
        }
    }
}