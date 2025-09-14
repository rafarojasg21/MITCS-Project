using MITCSService.DataBase;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.AplicacionRoles;
using static MITCSService.Metodos.Submenu;

namespace MITCSService.Metodos
{
    //Dentro de estos metodos se usan las tablas de Employees_absences, Employees_disabilities y Employees
    public class IncapacidadEmpleados
    {
        public class ListaDepartamentos
        {
            public string EmployeeDepartmentName { get; set; }
        }

        public class ListaAusencias
        {
            public string IncapacidadId { get; set; }
            public DateTime Fecha_inicio { get; set; }
            public DateTime Fecha_final { get; set; }
            public string Tipo { get; set; }
            public string TipoId { get; set; }
            public string Hospital { get; set; }
            public string HospitalId { get; set; }
            public string Doctor { get; set; }
            public string DoctorId { get; set; }
            public string Numero_serie { get; set; }
            public string Observacion { get; set; }
            public DateTime? Fecha_creacion { get; set; }
            public string Creado_por { get; set; }
            public DateTime? Fecha_modificacion { get; set; }
            public string Modificado_por { get; set; }


        }

        //Consulta a BD para obtener de la tabla Employee los Departamentos disponibles
        public static List<ListaDepartamentos> ListaDepartments()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Departments_db = (from Employee in MITEventUATdb.Employees
                                where Employee.removed == false
                                  select new ListaDepartamentos
                                  {
                                      EmployeeDepartmentName = Employee.EmployeeDepartmentName,
                                  })
                                  .Distinct()
                                  .OrderBy(x => x.EmployeeDepartmentName)
                                  .ToList();

            return Departments_db;
        }

        public static List<DataBase.LOV> ListaHospitales()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVHospitales_db = (from LOV in MITEventUATdb.LOVs
                           where LOV.removed == false
                            join LOVType in MITEventUATdb.LOVTypes
                            on LOV.LOVTypeid equals LOVType.id
                            where LOVType.LOVTypeName == "HOSPITALS"
                            select LOV).ToList();

            return LOVHospitales_db;
        }

        public static List<DataBase.LOV> ListaDoctores()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVDoctores_db = (from LOV in MITEventUATdb.LOVs
                                    where LOV.removed == false
                                    join LOVType in MITEventUATdb.LOVTypes
                                    on LOV.LOVTypeid equals LOVType.id
                                    where LOVType.LOVTypeName == "DOCTORS"
                                    select LOV).ToList();

            return LOVDoctores_db;
        }

        public static List<DataBase.LOV> ListaTipo()
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var LOVTipoIncapacidad_db = (from LOV in MITEventUATdb.LOVs
                                  where LOV.removed == false
                                  join LOVType in MITEventUATdb.LOVTypes
                                  on LOV.LOVTypeid equals LOVType.id
                                  where LOVType.LOVTypeName == "DISABILITY TYPE"
                                  select LOV).ToList();

            return LOVTipoIncapacidad_db;
        }

        //Consulta para filtrar por numero de empleado, nombre o apellido; O por departamento.
        public static List<DataBase.Employee> ListaEmployees(string Employees, string Department, int pageIndex, int pageSize)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Employees_db = (from Employee in MITEventUATdb.Employees
                                where Employee.removed == false
                                select Employee);

            if (!string.IsNullOrWhiteSpace(Employees))
            {
                Employees_db = Employees_db.Where(x => x.EmployeeNumber.Contains(Employees) ||
                                                        x.EmployeeFirstName.Contains(Employees.ToUpper()) ||
                                                        x.EmployeeFirstLastName.Contains(Employees.ToUpper()));
            }

            if (!string.IsNullOrWhiteSpace(Department))
            {
                Employees_db = Employees_db.Where(x => x.EmployeeDepartmentName.Contains(Department.ToUpper()));
            }

            // Ordenar y aplicar paginación
            Employees_db = Employees_db.OrderBy(x => x.EmployeeNumber)
                                       .Skip(pageIndex * pageSize)
                                       .Take(pageSize);

            return Employees_db.ToList();
        }

        public static bool CrearEmployeeAbsence(string employeeId, string LOVid, DateTime startDate, DateTime endDate, 
            string observation, string createdby, string hospitalLovID, string doctorLovID, string serialNumber)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.Employees_absence NewRecord = new DataBase.Employees_absence();

            NewRecord.id = Guid.NewGuid().ToString("N");
            NewRecord.employeeId = employeeId;
            NewRecord.LovId = LOVid;
            NewRecord.startDate = startDate;
            NewRecord.endDate = endDate;
            NewRecord.observation = observation;
            NewRecord.created = DateTime.Now;
            NewRecord.createdBy = createdby;
            NewRecord.removed = false;

            //Aqui se rellenan los datos necesarios para crear un registro en Employees_disabilities
            CrearEmployeeDisability(hospitalLovID, doctorLovID, NewRecord.id, createdby, serialNumber);

            MITEventUATdb.Employees_absences.InsertOnSubmit(NewRecord);
            MITEventUATdb.SubmitChanges();
            return true;

        }

        public static bool EditarEmployeeAbsence(string id, string LovID, DateTime startDate, DateTime endDate, 
            string observation, string updatedby, string hospitalLovID, string doctorLovID, string serialNumber)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var EmployeeAbsence_db = (from Employees_absence in MITEventUATdb.Employees_absences
                              where Employees_absence.id == id
                              select Employees_absence).FirstOrDefault();

            if (EmployeeAbsence_db != null)
            {
                EmployeeAbsence_db.LovId = LovID;
                EmployeeAbsence_db.startDate = startDate;
                EmployeeAbsence_db.endDate = endDate;
                EmployeeAbsence_db.observation = observation;
                EmployeeAbsence_db.changed = DateTime.Now;
                EmployeeAbsence_db.changedBy = updatedby;

                EditarEmployeeDisability(hospitalLovID, doctorLovID, id, updatedby, serialNumber);
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

        public static bool DesactivarAbsence(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var EmployeeAbsence_db = (from Employees_absence in MITEventUATdb.Employees_absences
                           where Employees_absence.id == id
                           select Employees_absence).FirstOrDefault();

            if (EmployeeAbsence_db != null)
            {
                EmployeeAbsence_db.removedBy = removedby;
                EmployeeAbsence_db.removed = true;
                EmployeeAbsence_db.removedDate = DateTime.Now;
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

        public static bool ActivarAbsence(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var EmployeeAbsence_db = (from Employees_absence in MITEventUATdb.Employees_absences
                           where Employees_absence.id == id
                           select Employees_absence).FirstOrDefault();

            if (EmployeeAbsence_db != null)
            {
                EmployeeAbsence_db.removed = false;
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

        //Esta funcion es para la tabla Employees_disabilities, y esta dentro de CrearEmployeeAbsence()
        public static bool CrearEmployeeDisability(string hospitalLovID, string doctorLovID, string employeeAbsenceId, 
            string createdby, string serialNumber)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.Employees_disability NewRecord = new DataBase.Employees_disability();

            NewRecord.id = Guid.NewGuid().ToString("N");
            NewRecord.hospitalLovId = hospitalLovID;
            NewRecord.doctorLovId = doctorLovID;
            NewRecord.employeeAbsenceId = employeeAbsenceId;
            NewRecord.created = DateTime.Now;
            NewRecord.createdBy = createdby;
            NewRecord.removed = false;
            NewRecord.serialNumber = serialNumber;

            MITEventUATdb.Employees_disabilities.InsertOnSubmit(NewRecord);
            MITEventUATdb.SubmitChanges();
            return true;

        }

        public static bool EditarEmployeeDisability(string hospitalLovID, string doctorLovID, string employeeAbsenceId,
            string updatedby, string serialNumber)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var EmployeeDisability = (from Employees_disability in MITEventUATdb.Employees_disabilities
                                      where Employees_disability.employeeAbsenceId == employeeAbsenceId
                                      select Employees_disability).FirstOrDefault();

            if (EmployeeDisability != null)
            {
                EmployeeDisability.hospitalLovId = hospitalLovID;
                EmployeeDisability.doctorLovId = doctorLovID;
                EmployeeDisability.changed = DateTime.Now;
                EmployeeDisability.changedBy = updatedby;
                EmployeeDisability.serialNumber = serialNumber;
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

        public static DataBase.Employee ObtenerEmployee(string id)
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                var Employee_db = (from Employee in MITEventUATdb.Employees
                                  where Employee.id == id
                                  select Employee).FirstOrDefault();

                return Employee_db;
            }
        }

        public static List<ListaAusencias> ListaAusenciasPorEmpleado(string employeeId)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            var EmployeeAbsences_db = (from Employees_absence in MITEventUATdb.Employees_absences
                                       where Employees_absence.removed == false
                                       join Employees_disability in MITEventUATdb.Employees_disabilities
                                       on Employees_absence.id equals Employees_disability.employeeAbsenceId
                                       join LovTipo in MITEventUATdb.LOVs
                                       on Employees_absence.LovId equals LovTipo.id
                                       join LovHospital in MITEventUATdb.LOVs
                                       on Employees_disability.hospitalLovId equals LovHospital.id
                                       join LovDoctor in MITEventUATdb.LOVs
                                       on Employees_disability.doctorLovId equals LovDoctor.id
                                       where Employees_absence.employeeId == employeeId
                                       select new ListaAusencias
                                       {
                                           IncapacidadId = Employees_absence.id,
                                           Fecha_inicio = Employees_absence.startDate,
                                           Fecha_final = Employees_absence.endDate,
                                           Tipo = LovTipo.Value,
                                           TipoId = LovTipo.id,
                                           Hospital = LovHospital.Value,
                                           HospitalId = LovHospital.id,
                                           Doctor = LovDoctor.Value,
                                           DoctorId = LovDoctor.id,
                                           Numero_serie = Employees_disability.serialNumber,
                                           Observacion = Employees_absence.observation,
                                           Fecha_creacion = Employees_absence.created,
                                           Creado_por = Employees_absence.createdBy,
                                           Fecha_modificacion = Employees_absence.changed,
                                           Modificado_por = Employees_absence.changedBy
                                       }).ToList();

            return EmployeeAbsences_db;
        }

        public static List<ListaAusencias> ListaAusenciasPorEmpleadoDetalles(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            var EmployeeAbsences_db = (from Employees_absence in MITEventUATdb.Employees_absences
                                       where Employees_absence.removed == false
                                       join Employees_disability in MITEventUATdb.Employees_disabilities
                                       on Employees_absence.id equals Employees_disability.employeeAbsenceId
                                       join LovTipo in MITEventUATdb.LOVs
                                       on Employees_absence.LovId equals LovTipo.id
                                       join LovHospital in MITEventUATdb.LOVs
                                       on Employees_disability.hospitalLovId equals LovHospital.id
                                       join LovDoctor in MITEventUATdb.LOVs
                                       on Employees_disability.doctorLovId equals LovDoctor.id
                                       where Employees_absence.id == id
                                       select new ListaAusencias
                                       {
                                           IncapacidadId = Employees_absence.id,
                                           Fecha_inicio = Employees_absence.startDate,
                                           Fecha_final = Employees_absence.endDate,
                                           Tipo = LovTipo.Value,
                                           TipoId = LovTipo.id,
                                           Hospital = LovHospital.Value,
                                           HospitalId = LovHospital.id,
                                           Doctor = LovDoctor.Value,
                                           DoctorId = LovDoctor.id,
                                           Numero_serie = Employees_disability.serialNumber,
                                           Observacion = Employees_absence.observation,
                                           Fecha_creacion = Employees_absence.created,
                                           Creado_por = Employees_absence.createdBy,
                                           Fecha_modificacion = Employees_absence.changed,
                                           Modificado_por = Employees_absence.changedBy
                                       }).ToList();

            return EmployeeAbsences_db;
        }

    }
}