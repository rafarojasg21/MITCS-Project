using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using static MITCSService.Metodos.Submenu;

namespace MITCSService.Metodos
{

    public class Menu
    {
        public class MenuData
        {
            public string Menu_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string ImagePath { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
        }

        public static bool CrearMenu(string name, string description, string imagePath, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_menus NewRecord = new DataBase.MITCS_menus();

            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                           where menus.Name.ToUpper() == name.ToUpper()
                           select menus).FirstOrDefault();

            if (Menu_db == null)
            {
                NewRecord.Menu_id = Guid.NewGuid().ToString("N");
                NewRecord.Name = name;
                NewRecord.Description = description;
                NewRecord.ImagePath = imagePath;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Removed = false;

                MITEventUATdb.MITCS_menus.InsertOnSubmit(NewRecord);
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

        public static bool EditarMenu(string id, string name, string description, string imagePath, string updatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                            where menus.Menu_id == id
                            select menus).FirstOrDefault();

            if (Menu_db != null)
            {
                Menu_db.Name = name;
                Menu_db.Description = description;
                Menu_db.ImagePath = imagePath;
                Menu_db.UpdatedBy = updatedby;
                Menu_db.Updated = DateTime.Now;
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

        public static bool DesactivarMenu(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                           where menus.Menu_id == id
                           select menus).FirstOrDefault();

            if (Menu_db != null)
            {
                Menu_db.RemovedBy = removedby;
                Menu_db.Removed = true;
                Menu_db.RemovedDate = DateTime.Now;
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

        public static bool ActivarMenu(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                           where menus.Menu_id == id
                           select menus).FirstOrDefault();

            if (Menu_db != null)
            {
                Menu_db.Removed = false;
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

        public static List<DataBase.MITCS_menus> ListaMenu()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                           where menus.Removed == false
                           select menus).ToList();

            return Menu_db;
        }

        public static MenuData[] MenuInfoToArray(string MenuID)
        {
            List<MenuData> objectList = new List<MenuData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                           where menus.Menu_id == MenuID
                           select menus).ToList();

            foreach (var item in Menu_db)
            {
                MenuData data = new MenuData();
                data.Menu_id = item.Menu_id;
                data.Name = item.Name;
                data.Description = item.Description;
                data.ImagePath = item.ImagePath;
                data.Created = item.Created;
                data.CreatedBy = item.CreatedBy;
                data.Updated = item.Updated;
                data.UpdatedBy = item.UpdatedBy;
                data.Removed = (bool)item.Removed;
                data.RemovedBy = item.RemovedBy;
                data.RemovedDate = item.RemovedDate;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

    }
}