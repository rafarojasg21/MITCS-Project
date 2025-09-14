using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MITCSService.Metodos
{
    public class AplicacionRoles
    {
        public class AplicacionRolConNombreApp
        {
            public string Application_id { get; set; }
            public string Rol_id { get; set; }
            public string Submenu_id { get; set; }
            public string NombreAplicacion { get; set; }
            public string TipoAplicacion { get; set; }
            public string URL { get; set; }
        }

        public static bool CrearAplicacionRoles(string aplicacionID, string rolID, string aplicacionDescripcion, string rolDescripcion, string createdby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_roleApplication NewRecord = new DataBase.MITCS_roleApplication();

            var AppRol_db = (from roleApplications in MITEventUATdb.MITCS_roleApplications
                             where roleApplications.Application_id.ToUpper() == aplicacionID.ToUpper()
                             && roleApplications.Rol_id.ToUpper() == rolID.ToUpper()
                           select roleApplications).FirstOrDefault();

            if (AppRol_db == null)
            {
                NewRecord.ApplicationRol_id = Guid.NewGuid().ToString("N");
                NewRecord.Application_id = aplicacionID;
                NewRecord.ApplicationDescription = aplicacionDescripcion;
                NewRecord.Rol_id = rolID;
                NewRecord.RolDescription = rolDescripcion;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Removed = false;

                MITEventUATdb.MITCS_roleApplications.InsertOnSubmit(NewRecord);
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

        public static bool EditarAplicacionRoles(string rolID)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_roleApplication NewRecord = new DataBase.MITCS_roleApplication();

            // Obtener todos los registros con el mismo Rol_id
            var registrosAEliminar = from roleApplications in MITEventUATdb.MITCS_roleApplications
                                     where roleApplications.Rol_id.ToUpper() == rolID.ToUpper()
                                     select roleApplications;

            // Eliminar los registros encontrados
            MITEventUATdb.MITCS_roleApplications.DeleteAllOnSubmit(registrosAEliminar);

            // Guardar los cambios en la base de datos
            MITEventUATdb.SubmitChanges();

            return true; // Opcional: retornar true si la eliminación fue exitosa
        }

        public static List<AplicacionRolConNombreApp> ListaAplicacionRoles(string RolID)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            var AppRol_db = (from roleApplications in MITEventUATdb.MITCS_roleApplications
                             where roleApplications.Removed == false
                             join applications in MITEventUATdb.MITCS_applications 
                             on roleApplications.Application_id equals applications.Application_id
                             where roleApplications.Rol_id == RolID
                             select new AplicacionRolConNombreApp 
                             { 
                                 Application_id = roleApplications.Application_id,
                                 Rol_id = RolID,
                                 Submenu_id = applications.Submenu_id,
                                 NombreAplicacion = applications.Name,
                                 TipoAplicacion = applications.Type,
                                 URL = applications.URL
                             }).ToList();

            return AppRol_db;
        }

        public static List<AplicacionRolConNombreApp> ListaAplicacionSinAsignarAlRol(string RolID)
        {
            var ListaFinal = new List<AplicacionRolConNombreApp>();

            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var AppAsociadasRol_db = (from roleApplications in MITEventUATdb.MITCS_roleApplications
                                      where roleApplications.Removed == false
                                      join applications in MITEventUATdb.MITCS_applications
                                      on roleApplications.Application_id equals applications.Application_id
                                      where roleApplications.Rol_id == RolID
                                      select new AplicacionRolConNombreApp
                                      {
                                          Application_id = roleApplications.Application_id,
                                          Rol_id = RolID,
                                          NombreAplicacion = applications.Name
                                      }).ToList();

            var Apps_db = (from applications in MITEventUATdb.MITCS_applications
                                      select new AplicacionRolConNombreApp
                                      {
                                          Application_id = applications.Application_id,
                                          Rol_id = RolID,
                                          NombreAplicacion = applications.Name
                                      }).ToList();

            if (AppAsociadasRol_db.Count > 0)
            {
                foreach(var item in Apps_db)
                {
                    var encontrado = (from i in AppAsociadasRol_db 
                                      where item.Application_id == i.Application_id
                                      select i).FirstOrDefault();

                    if (encontrado == null)
                    {
                        ListaFinal.Add(item);
                    }
                }
            }

            else
            {
                return Apps_db;
            }

            return ListaFinal;
        }

    }
}