using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.Roles;

namespace MITCSService.Metodos
{
    public class ProveedoresComida
    {

        public class ProveedoresData
        {
            public string id { get; set; }
            public string name { get; set; }
            public string contact { get; set; }
            public int? capacity { get; set; }
            public int? priority { get; set; }
            public DateTime created { get; set; }
            public string createdBy { get; set; }
            public DateTime? changed { get; set; }
            public string changedBy { get; set; }
            public bool removed { get; set; }
            public string removedBy { get; set; }
            public DateTime? removedDate { get; set; }
            public decimal regularFoodPrice { get; set; }
            public decimal specialFoodPrice { get; set; }
        }

        public class calendarioProveedoresData
        {
            public string id { get; set; }
            public string providerId { get; set; }
            public DateTime requestDate { get; set; }
            public string requestShift { get; set; }
            public DateTime created { get; set; }
            public string createdBy { get; set; }
            public DateTime? changed { get; set; }
            public string changedBy { get; set; }
            public bool removed { get; set; }
            public string removedBy { get; set; }
            public DateTime? removedDate { get; set; }
            public decimal regularFoodPrice { get; set; }
            public decimal specialFoodPrice { get; set; }
        }

        public static List<DataBase.LOV> ListaTurnos()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTurnos_db = (from LOV in MITEventUATdb.LOVs
                                    where LOV.removed == false
                                    join LOVType in MITEventUATdb.LOVTypes
                                    on LOV.LOVTypeid equals LOVType.id
                                    where LOVType.LOVTypeName == "SHIFT"
                                    select LOV).ToList();

            return LOVTurnos_db;
        }

        public static bool CrearProveedorComida(string name, string contact, int capacity, int priority, 
            decimal regularFoodPrice, decimal specialFoodPrice, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.Dispatch_provider NewRecord = new DataBase.Dispatch_provider();

            var Proveedor_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                           where ProveedoresComida.name.ToUpper() == name.ToUpper()
                           select ProveedoresComida).FirstOrDefault();

            if (Proveedor_db == null)
            {
                NewRecord.id = Guid.NewGuid().ToString("N");
                NewRecord.name = name;
                NewRecord.contact = contact;
                NewRecord.capacity = capacity;
                NewRecord.priority = priority;
                NewRecord.regularFoodPrice = regularFoodPrice;
                NewRecord.specialFoodPrice = specialFoodPrice;
                NewRecord.createdBy = createdby;
                NewRecord.created = DateTime.Now;
                NewRecord.removed = false;

                MITEventUATdb.Dispatch_providers.InsertOnSubmit(NewRecord);
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

        public static bool EditarProveedorComida(string id, string name, string contact, int capacity, int priority,
            decimal regularFoodPrice, decimal specialFoodPrice, string updatedBy)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Proveedor_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                                 where ProveedoresComida.id == id
                                 select ProveedoresComida).FirstOrDefault();

            if (Proveedor_db != null)
            {
                Proveedor_db.name = name;
                Proveedor_db.contact = contact;
                Proveedor_db.capacity = capacity;
                Proveedor_db.priority = priority;
                Proveedor_db.regularFoodPrice = regularFoodPrice;
                Proveedor_db.specialFoodPrice = specialFoodPrice;
                Proveedor_db.changed = DateTime.Now;
                Proveedor_db.changedBy = updatedBy;
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

        public static bool DesactivarProveedorComida(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Proveedor_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                                 where ProveedoresComida.id == id
                                 select ProveedoresComida).FirstOrDefault();

            if (Proveedor_db != null)
            {
                Proveedor_db.removedBy = removedby;
                Proveedor_db.removed = true;
                Proveedor_db.removedDate = DateTime.Now;
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

        public static bool ActivarProveedorComida(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Proveedor_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                                where ProveedoresComida.id == id
                                select ProveedoresComida).FirstOrDefault();

            if (Proveedor_db != null)
            {
                Proveedor_db.removed = false;
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

        public static List<DataBase.Dispatch_provider> ListaProveedoresComida()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Proveedores_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                           where ProveedoresComida.removed == false
                           select ProveedoresComida).ToList();

            return Proveedores_db;
        }

        public static ProveedoresData[] ProveedorInfoToArray(string id)
        {
            List<ProveedoresData> objectList = new List<ProveedoresData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Proveedores_db = (from ProveedoresComida in MITEventUATdb.Dispatch_providers
                          where ProveedoresComida.id == id
                          select ProveedoresComida).ToList();

            foreach (var item in Proveedores_db)
            {
                ProveedoresData data = new ProveedoresData();
                data.id = item.id;
                data.name = item.name;
                data.contact = item.contact;
                data.capacity = item.capacity;
                data.priority = item.priority;
                data.created = item.created;
                data.createdBy = item.createdBy;
                data.changed = item.changed;
                data.changedBy = item.changedBy;
                data.removed = item.removed;
                data.removedBy = item.removedBy;
                data.removedDate = item.removedDate;
                data.regularFoodPrice = item.regularFoodPrice;
                data.specialFoodPrice = item.specialFoodPrice;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

        public static void BorrarRegistrosPosteriores(string providerId)
        {
            // Obtener la fecha actual
            DateTime today = DateTime.Today;

            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            // Obtener todos los registros con fecha posterior a la actual y que coincidan con el providerId
            var registrosPosteriores = MITEventUATdb.DispatchProviderSchedules
                .Where(r => r.requestDate > today && r.providerId == providerId);

            // Eliminar los registros
            MITEventUATdb.DispatchProviderSchedules.DeleteAllOnSubmit(registrosPosteriores);

            // Guardar los cambios en la base de datos
            MITEventUATdb.SubmitChanges();
        }

        public static bool CalendarioProveedorComida(string providerId, DateTime requestDate, string requestShift, string createdBy)
        {
            // Obtener la fecha actual
            DateTime today = DateTime.Today;

            // Verificar si la fecha solicitada es anterior a la actual
            if (requestDate < today)
            {
                // Si la fecha es anterior a la actual, no se realiza ninguna acción
                return false;
            }

            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            // Verificar si ya existe un registro con la misma fecha, proveedor y turno
            var existingRecord = MITEventUATdb.DispatchProviderSchedules
                .FirstOrDefault(r => r.providerId == providerId
                                     && r.requestDate == requestDate
                                     && r.requestShift == requestShift
                                     && !r.removed);

            if (existingRecord != null)
            {
                // Si ya existe un registro, puedes retornar false o manejarlo según tus necesidades
                return false;
            }

            // Si no existe, se crea un nuevo registro
            DataBase.DispatchProviderSchedule NewRecord = new DataBase.DispatchProviderSchedule();
            NewRecord.id = Guid.NewGuid().ToString("N");
            NewRecord.providerId = providerId;
            NewRecord.requestDate = requestDate;
            NewRecord.requestShift = requestShift;
            NewRecord.createdBy = createdBy;
            NewRecord.created = DateTime.Now;
            NewRecord.removed = false;

            MITEventUATdb.DispatchProviderSchedules.InsertOnSubmit(NewRecord);
            MITEventUATdb.SubmitChanges();

            return true;
        }

        public static calendarioProveedoresData[] CalendarioProveedorInfoToArray(string providerId)
        {
            List<calendarioProveedoresData> objectList = new List<calendarioProveedoresData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var calendarioProveedores_db = (from calendarioProveedoresComida in MITEventUATdb.DispatchProviderSchedules
                                            where calendarioProveedoresComida.providerId == providerId
                                            join LOV in MITEventUATdb.LOVs
                                            on calendarioProveedoresComida.requestShift equals LOV.Value
                                            select calendarioProveedoresComida).ToList();

            foreach (var item in calendarioProveedores_db)
            {
                calendarioProveedoresData data = new calendarioProveedoresData();
                data.id = item.id;
                data.providerId = item.providerId;
                data.requestDate = item.requestDate;
                data.requestShift = item.requestShift;
                data.created = item.created;
                data.createdBy = item.createdBy;
                data.changed = item.changed;
                data.changedBy = item.changedBy;
                data.removed = item.removed;
                data.removedBy = item.removedBy;
                data.removedDate = item.removedDate;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }

    }
}