using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MITCSService.Metodos
{
    public class SolicitudComida
    {

        public static bool CrearSolicitudComida(DateTime requestDate, string department, string requestShift, 
            string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.DispatchFoodRequest NewRecord = new DataBase.DispatchFoodRequest();

            NewRecord.id = Guid.NewGuid().ToString("N");
            NewRecord.requestDate = requestDate;
            NewRecord.department = department;
            NewRecord.requestShift = requestShift;
            NewRecord.createdBy = createdby;
            NewRecord.created = DateTime.Now;
            NewRecord.removed = false;

            MITEventUATdb.DispatchFoodRequests.InsertOnSubmit(NewRecord);
            MITEventUATdb.SubmitChanges();
            return true;
        }

        public static bool VerificarDispatchFoodRequest(DateTime requestDate, string department, string requestShift)
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                var exists = MITEventUATdb.DispatchFoodRequests
                    .Any(dfr => dfr.requestDate == requestDate
                                && dfr.department == department
                                && dfr.requestShift == requestShift);

                return exists;
            }
        }

    }
}