using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.Menu;

namespace MITCSService.Metodos
{
    public class Roles
    {
        public class RolData
        {
            public string Rol_id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string Application_id { get; set; }
        }

        public static string CrearRoles(string name, string description, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_role NewRecord = new DataBase.MITCS_role();

            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                           where roles.Name.ToUpper() == name.ToUpper()
                           select roles).FirstOrDefault();

            if (Role_db == null)
            {
                NewRecord.Rol_id = Guid.NewGuid().ToString("N");
                NewRecord.Name = name;
                NewRecord.Description = description;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Removed = false;

                MITEventUATdb.MITCS_roles.InsertOnSubmit(NewRecord);
                try
                {
                    MITEventUATdb.SubmitChanges();
                    return NewRecord.Rol_id;
                }
                catch (Exception ex)
                {
                    return "false";
                }
            }

            else
            {
                return "false";
            }

        }

        public static bool EditarRoles(string id, string name, string description, string updatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                           where roles.Rol_id == id
                           select roles).FirstOrDefault();

            if (Role_db != null)
            {
                Role_db.Name = name;
                Role_db.Description = description;
                Role_db.UpdatedBy = updatedby;
                Role_db.Updated = DateTime.Now;
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



        public static bool DesactivarRoles(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                           where roles.Rol_id == id
                           select roles).FirstOrDefault();

            if (Role_db != null)
            {
                Role_db.RemovedBy = removedby;
                Role_db.Removed = true;
                Role_db.RemovedDate = DateTime.Now;
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

        public static bool ActivarRol(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                                 where roles.Rol_id == id
                                 select roles).FirstOrDefault();

            if (Role_db != null)
            {
                Role_db.Removed = false;
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

        public static List<DataBase.MITCS_role> ListaRoles()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                           where roles.Removed == false
                           select roles).ToList();

            return Role_db;
        }

        public static RolData[] RolInfoToArray(string RolID)
        {
            List<RolData> objectList = new List<RolData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Rol_db = (from roles in MITEventUATdb.MITCS_roles
                           where roles.Rol_id == RolID
                           select roles).ToList();

            foreach (var item in Rol_db)
            {
                RolData data = new RolData();
                data.Rol_id = item.Rol_id;
                data.Name = item.Name;
                data.Description = item.Description;
                data.Created = item.Created;
                data.CreatedBy = item.CreatedBy;
                data.Updated = item.Updated;
                data.UpdatedBy = item.UpdatedBy;
                data.Removed = (bool)item.Removed;
                data.RemovedBy =    item.RemovedBy;
                data.RemovedDate = item.RemovedDate;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }
    }
}