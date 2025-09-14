using MitcsClassLibrary.Common;
using MITCSService.DataBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using static MITCSService.Metodos.Menu;

namespace MITCSService.Metodos
{
    public class LOV
    {
        public class LOVTypeData
        {
            public string id { get; set; }
            public string LOVTypeName { get; set; }
            public string LOVTypeDescription { get; set; }
            public DateTime created { get; set; }
            public string createdBy { get; set; }
            public DateTime? changed { get; set; }
            public string changedBy { get; set; }
            public bool removed { get; set; }
            public string removedBy { get; set; }
            public DateTime? removedDate { get; set; }
        }

        public class LOVData
        {
            public string id { get; set; }
            public string LOVTypeid { get; set; }
            public string Value { get; set; }
            public string Description { get; set; }
            public DateTime created { get; set; }
            public string createdBy { get; set; }
            public DateTime? changed { get; set; }
            public string changedBy { get; set; }
            public bool removed { get; set; }
            public string removedBy { get; set; }
            public DateTime? removedDate { get; set; }
        }

        public static bool CrearLOVType(string name, string description, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.LOVType NewRecord = new DataBase.LOVType();

            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                           where LOVType.LOVTypeName.ToUpper() == name.ToUpper()
                           select LOVType).FirstOrDefault();

            if (LOVTypes_db == null)
            {
                NewRecord.id = Guid.NewGuid().ToString("N");
                NewRecord.LOVTypeName = name;
                NewRecord.LOVTypeDescription = description;
                NewRecord.createdBy = createdby;
                NewRecord.created = DateTime.Now;
                NewRecord.removed = false;

                MITEventUATdb.LOVTypes.InsertOnSubmit(NewRecord);
                try
                {
                    MITEventUATdb.SubmitChanges();
                    var taskType = "Create";
                    LOVTypeJn(NewRecord.id, name, description, taskType, createdby);
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

        public static bool EditarLOVType(string id, string name, string description, string updatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                               where LOVType.id == id
                           select LOVType).FirstOrDefault();

            if (LOVTypes_db != null)
            {
                LOVTypes_db.LOVTypeName = name;
                LOVTypes_db.LOVTypeDescription = description;
                LOVTypes_db.changedBy = updatedby;
                LOVTypes_db.changed = DateTime.Now;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Edit";
                LOVTypeJn(id, name, description, taskType, updatedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool DesactivarLOVType(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                               where LOVType.id == id
                           select LOVType).FirstOrDefault();

            if (LOVTypes_db != null)
            {
                LOVTypes_db.removedBy = removedby;
                LOVTypes_db.removed = true;
                LOVTypes_db.removedDate = DateTime.Now;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Delete";
                LOVTypeJn(id, LOVTypes_db.LOVTypeName, LOVTypes_db.LOVTypeDescription, taskType, removedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool ActivarLOVType(string id, string activatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                               where LOVType.id == id
                           select LOVType).FirstOrDefault();

            if (LOVTypes_db != null)
            {
                LOVTypes_db.removed = false;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Enable";
                LOVTypeJn(id, LOVTypes_db.LOVTypeName, LOVTypes_db.LOVTypeDescription, taskType, activatedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static List<DataBase.LOVType> ListaLOVType()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                               where LOVType.removed == false
                               select LOVType).ToList();

            return LOVTypes_db;
        }

        public static LOVTypeData[] LOVTypeInfoToArray(string id)
        {
            List<LOVTypeData> objectList = new List<LOVTypeData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTypes_db = (from LOVType in MITEventUATdb.LOVTypes
                           where LOVType.id == id
                           select LOVType).ToList();

            foreach (var item in LOVTypes_db)
            {
                LOVTypeData data = new LOVTypeData();
                data.id = item.id;
                data.LOVTypeName = item.LOVTypeName;
                data.LOVTypeDescription = item.LOVTypeDescription;
                data.created = (DateTime)item.created;
                data.createdBy = item.createdBy;
                data.changed = item.changed;
                data.changedBy = item.changedBy;
                data.removed = (bool)item.removed;
                data.removedBy = item.removedBy;
                data.removedDate = item.removedDate;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

        public static bool CrearLOV(string LOVTypeid, string value, string description, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.LOV NewRecord = new DataBase.LOV();

            var LOV_db = (from LOV in MITEventUATdb.LOVs
                               where LOV.Value.ToUpper() == value.ToUpper()
                               select LOV).FirstOrDefault();

            var LOVType_db = (from LOVType in MITEventUATdb.LOVTypes
                              where LOVType.id == LOVTypeid
                              select LOVType).FirstOrDefault();

            if (LOV_db == null)
            {
                NewRecord.id = Guid.NewGuid().ToString("N");
                NewRecord.LOVTypeid = LOVTypeid;
                NewRecord.Value = value;
                NewRecord.Description = description;
                NewRecord.createdBy = createdby;
                NewRecord.created = DateTime.Now;
                NewRecord.removed = false;

                MITEventUATdb.LOVs.InsertOnSubmit(NewRecord);
                try
                {
                    MITEventUATdb.SubmitChanges();
                    var taskType = "Create";
                    LOVJn(NewRecord.id, LOVTypeid, value, description, taskType, createdby);
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

        public static bool EditarLOV(string id, string LOVTypeid, string value, string description, string updatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOV_db = (from LOV in MITEventUATdb.LOVs
                               where LOV.id == id
                               select LOV).FirstOrDefault();

            if (LOV_db != null)
            {
                LOV_db.LOVTypeid = LOVTypeid;
                LOV_db.Value = value;
                LOV_db.Description = description;
                LOV_db.changedBy = updatedby;
                LOV_db.changed = DateTime.Now;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Edit";
                LOVJn(id, LOVTypeid, value, description, taskType, updatedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool DesactivarLOV(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOV_db = (from LOV in MITEventUATdb.LOVs
                          where LOV.id == id
                               select LOV).FirstOrDefault();

            if (LOV_db != null)
            {
                LOV_db.removedBy = removedby;
                LOV_db.removed = true;
                LOV_db.removedDate = DateTime.Now;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Delete";
                LOVJn(id, LOV_db.LOVTypeid, LOV_db.Value, LOV_db.Description, taskType, removedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool ActivarLOV(string id, string activatedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOV_db = (from LOV in MITEventUATdb.LOVs
                          where LOV.id == id
                               select LOV).FirstOrDefault();

            if (LOV_db != null)
            {
                LOV_db.removed = false;
            }

            else
            {
                return false;
            }

            try
            {
                MITEventUATdb.SubmitChanges();
                var taskType = "Enable";
                LOVJn(id, LOV_db.LOVTypeid, LOV_db.Value, LOV_db.Description, taskType, activatedby);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static List<DataBase.LOV> ListaLOV(string LOVTypeid)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOV_db = (from LOV in MITEventUATdb.LOVs
                          where LOV.LOVTypeid == LOVTypeid 
                          && LOV.removed == false
                          select LOV).ToList();
 
            return LOV_db;
        }

        public static LOVData[] LOVInfoToArray(string id)
        {
            List<LOVData> objectList = new List<LOVData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOV_db = (from LOV in MITEventUATdb.LOVs
                          where LOV.id == id
                               select LOV).ToList();

            foreach (var item in LOV_db)
            {
                LOVData data = new LOVData();
                data.id = item.id;
                data.LOVTypeid = item.LOVTypeid;
                data.Value = item.Value;
                data.Description = item.Description;
                data.created = (DateTime)item.created;
                data.createdBy = item.createdBy;
                data.changed = item.changed;
                data.changedBy = item.changedBy;
                data.removed = (bool)item.removed;
                data.removedBy = item.removedBy;
                data.removedDate = item.removedDate;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

        //Este metodo se utiliza solo para llevar control en BD de los cambios hechos en LOVTypes
        public static bool LOVTypeJn(string id, string name, string description, string taskType, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.LOVTypeJn NewRecord = new DataBase.LOVTypeJn();

            NewRecord.id = id;
            NewRecord.LOVTypeName = name;
            NewRecord.LOVTypeDescription = description;
            NewRecord.taskType = taskType;
            NewRecord.taskDate = DateTime.Now;
            NewRecord.taskBy = createdby;
            NewRecord.taskId = Guid.NewGuid().ToString("N");

            MITEventUATdb.LOVTypeJns.InsertOnSubmit(NewRecord);

            MITEventUATdb.SubmitChanges();
            return true;

        }

        //Este metodo se utiliza solo para llevar control en BD de los cambios hechos en LOVJns
        public static bool LOVJn(string id, string LOVTypeid, string value, string description, string taskType, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.LOVJn NewRecord = new DataBase.LOVJn();

            NewRecord.id = id;
            NewRecord.LOVTypeid = LOVTypeid;
            NewRecord.Value = value;
            NewRecord.Description = description;
            NewRecord.taskType = taskType;
            NewRecord.taskDate = DateTime.Now;
            NewRecord.taskBy = createdby;
            NewRecord.taskId = Guid.NewGuid().ToString("N");

            MITEventUATdb.LOVJns.InsertOnSubmit(NewRecord);

            MITEventUATdb.SubmitChanges();
            return true;

        }

    }
}