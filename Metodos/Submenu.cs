using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MITCSService.Metodos
{
    public class Submenu
    {
        public class SubmenuConNombreMenu
        {
            public string Submenu_id { get; set; }
            public string Menu_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string NombreMenu { get; set; }
        }

        //Clase para guardar la informacion del Join entre la tabla submenu y menu
        public class SubmenuData
        {
            public string Submenu_id { get; set; }
            public string Menu_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string MenuName { get; set; }
        }

        public static bool CrearSubmenu(string menuID, string name, string description, string createdby)
         {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_submenus NewRecord = new DataBase.MITCS_submenus();

            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                           where submenus.Name.ToUpper() == name.ToUpper()
                           select submenus).FirstOrDefault();

            var Menu_db = (from menus in MITEventUATdb.MITCS_menus
                              where menus.Menu_id == menuID
                              select menus).FirstOrDefault();

            if (Submenu_db == null)
            {
                NewRecord.Submenu_id = Guid.NewGuid().ToString("N");
                NewRecord.Menu_id = menuID;
                NewRecord.Name = name;
                NewRecord.Description = description;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Removed = false;

                MITEventUATdb.MITCS_submenus.InsertOnSubmit(NewRecord);
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

        public static bool EditarSubmenu(string id, string menuID, string name, string description, string updatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                           where submenus.Submenu_id == id
                           select submenus).FirstOrDefault();

            if (Submenu_db != null)
            {
                Submenu_db.Menu_id = menuID;
                Submenu_db.Name = name;
                Submenu_db.Description = description;
                Submenu_db.UpdatedBy = updatedby;
                Submenu_db.Updated = DateTime.Now;
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

        public static bool DesactivarSubmenu(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                           where submenus.Submenu_id == id
                           select submenus).FirstOrDefault();

            if (Submenu_db != null)
            {
                Submenu_db.RemovedBy = removedby;
                Submenu_db.Removed = true;
                Submenu_db.RemovedDate = DateTime.Now;
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

        public static bool ActivarSubmenu(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                           where submenus.Submenu_id == id
                           select submenus).FirstOrDefault();

            if (Submenu_db != null)
            {
                Submenu_db.Removed = false;
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

        public static List<SubmenuConNombreMenu> ListaSubmenu()
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                var submenusConNombreMenu = (from submenus in MITEventUATdb.MITCS_submenus
                                             where submenus.Removed == false
                                             join menus in MITEventUATdb.MITCS_menus
                                             on submenus.Menu_id equals menus.Menu_id
                                             select new SubmenuConNombreMenu
                                             {
                                                 Submenu_id = submenus.Submenu_id,
                                                 Menu_id = submenus.Menu_id,
                                                 Name = submenus.Name,
                                                 Description = submenus.Description,
                                                 Created = submenus.Created,
                                                 CreatedBy = submenus.CreatedBy,
                                                 Updated = submenus.Updated,
                                                 UpdatedBy = submenus.UpdatedBy,
                                                 Removed = (bool)submenus.Removed,
                                                 RemovedBy = submenus.RemovedBy,
                                                 RemovedDate = submenus.RemovedDate,
                                                 NombreMenu = menus.Name
                                             }).ToList();

                return submenusConNombreMenu;
            }
        }

        public static SubmenuData[] SubmenuInfoToArray(string SubmenuID)
        {
            List<SubmenuData> objectList = new List<SubmenuData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Submenu_db = (from submenus in MITEventUATdb.MITCS_submenus
                              join menus in MITEventUATdb.MITCS_menus 
                              on submenus.Menu_id equals menus.Menu_id
                              where submenus.Submenu_id == SubmenuID
                              select new {submenus, menus.Name}).ToList(); 

            foreach (var item in Submenu_db)
            {
                SubmenuData data = new SubmenuData();
                data.Submenu_id = item.submenus.Submenu_id;
                data.Menu_id = item.submenus.Menu_id;
                data.Name = item.submenus.Name;
                data.Description = item.submenus.Description;
                data.Created = item.submenus.Created;
                data.CreatedBy = item.submenus.CreatedBy;
                data.Updated = item.submenus.Updated;   
                data.UpdatedBy = item.submenus.UpdatedBy;
                data.Removed = (bool)item.submenus.Removed;
                data.RemovedBy = item.submenus.RemovedBy;
                data.RemovedDate = item.submenus.RemovedDate;
                data.MenuName = item.Name;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

    }
}