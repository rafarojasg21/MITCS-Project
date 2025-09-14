using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.Aplicacion;

namespace MITCSService.Metodos
{
    public class Usuarios
    {
        //Clase para guardar la informacion del Join entre la tabla usuario y rol
        public class UsuarioData
        {
            public string User_id { get; set; }
            public string EmployeeNumber { get; set; }
            public string User { get; set; }
            public string Password { get; set; }
            public string Rol_id { get; set; }
            public string Name { get; set; }
            public string LastName { get; set; }
            public string Organization { get; set; }
            public string AuthenticationType { get; set; }
            public bool Active { get; set; }
            public DateTime Created { get; set; }
            public string CreatedBy { get; set; }
            public string Email { get; set; }
            public DateTime? Updated { get; set; }
            public string UpdatedBy { get; set; }
            public bool Removed { get; set; }
            public string RemovedBy { get; set; }
            public DateTime? RemovedDate { get; set; }
            public string RolName { get; set; }
            public string RolDescription { get; set; }

        }

        public static bool CrearUsuario(string employeeNumber, string user, string password, 
            string rolID, string name, string lastName, string organization, string authenticationType, 
            string createdby, string email)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_user NewRecord = new DataBase.MITCS_user();

            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                                 where users.EmployeeNumber.ToUpper() == employeeNumber.ToUpper()
                                 select users).FirstOrDefault();

            var Role_db = (from roles in MITEventUATdb.MITCS_roles
                              where roles.Rol_id == rolID
                              select roles).FirstOrDefault();

            if (Usuario_db == null)
            {
                NewRecord.User_id = Guid.NewGuid().ToString("N");
                NewRecord.EmployeeNumber = employeeNumber;
                NewRecord.WindowsUser = user;

                // Esta variable es un string que guardará el password cifrado.
                string securedPassword = "";

                // Se utiliza el método "EncryptPassword()" que se encuentra dentro de la librería (DLL) "MitcsClassLibrary" y se le envía 
                // como parámetro el password sin cifrado.
                securedPassword = MitcsClassLibrary.Security.PasswordGenerator.EncryptPassword(password);

                NewRecord.Password = securedPassword;
                NewRecord.Rol_id = rolID;
                NewRecord.Name = name;
                NewRecord.LastName = lastName;
                NewRecord.Organization = organization;
                NewRecord.AuthenticationType = authenticationType;
                NewRecord.Active = true;
                NewRecord.CreatedBy = createdby;
                NewRecord.Created = DateTime.Now;
                NewRecord.Email = email;
                NewRecord.Removed = false;

                MITEventUATdb.MITCS_users.InsertOnSubmit(NewRecord);
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

        public static bool EditarUsuario(string id, string rolID, string employeeNumber, string user, string password, 
            string name, string lastName, string organization, string authenticationType, string updatedby, string email)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              where users.User_id == id
                              select users).FirstOrDefault();

            if (Usuario_db != null)
            {
                Usuario_db.EmployeeNumber = employeeNumber;
                Usuario_db.WindowsUser = user;

                // Esta variable es un string que guardará el password cifrado.
                string securedPassword = "";

                // Se utiliza el método "EncryptPassword()" que se encuentra dentro de la librería (DLL) "MitcsClassLibrary" y se le envía 
                // como parámetro el password sin cifrado.
                securedPassword = MitcsClassLibrary.Security.PasswordGenerator.EncryptPassword(password);

                Usuario_db.Password = securedPassword;
                Usuario_db.Name = name;
                Usuario_db.LastName = lastName;
                Usuario_db.Organization = organization;
                Usuario_db.AuthenticationType = authenticationType;
                Usuario_db.Active = true;
                Usuario_db.Email = email;
                Usuario_db.Rol_id = rolID;
                Usuario_db.UpdatedBy = updatedby;
                Usuario_db.Updated = DateTime.Now;
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

        public static bool DesactivarUsuario(string id, string removedby)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              where users.User_id == id
                              select users).FirstOrDefault();

            if (Usuario_db != null)
            {
                Usuario_db.RemovedBy = removedby;
                Usuario_db.Removed = true;
                Usuario_db.RemovedDate = DateTime.Now;
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

        public static bool ActivarUsuario(string id)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              where users.User_id == id
                              select users).FirstOrDefault();

            if (Usuario_db != null)
            {
                Usuario_db.Removed = false;
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

        public static DataBase.MITCS_user ObtenerUsuario(string user)
        {
            using (DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext())
            {
                var Usuario_db = (from users in MITEventUATdb.MITCS_users
                                  where users.WindowsUser == user
                                  select users).FirstOrDefault();

                return Usuario_db;
            }
        }

        public static List<UsuarioData> UsuarioInfo()
        {
            List<UsuarioData> objectList = new List<UsuarioData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              where users.Removed == false
                              join roles in MITEventUATdb.MITCS_roles on users.Rol_id equals roles.Rol_id
                              select new { users, roles.Name, roles.Description }).ToList();

            foreach (var item in Usuario_db)
            {
                UsuarioData data = new UsuarioData();
                data.User_id = item.users.User_id;
                data.EmployeeNumber = item.users.EmployeeNumber;
                data.User = item.users.WindowsUser;
                data.Password = item.users.Password;
                data.Rol_id = item.users.Rol_id;
                data.Name = item.users.Name;
                data.LastName = item.users.LastName;
                data.Organization = item.users.Organization;
                data.AuthenticationType = item.users.AuthenticationType;
                data.Active = item.users.Active;
                data.Created = item.users.Created;
                data.CreatedBy = item.users.CreatedBy;
                data.Email = item.users.Email;
                data.Updated = item.users.Updated;
                data.UpdatedBy = item.users.UpdatedBy;
                data.Removed = (bool)item.users.Removed;
                data.RemovedBy = item.users.RemovedBy;
                data.RemovedDate = item.users.RemovedDate;
                data.RolName = item.Name;
                data.RolDescription = item.Description;

                objectList.Add(data);
            }

            return objectList;
        }

        public static UsuarioData[] UsuarioInfoToArray(string UserID)
        {
            List<UsuarioData> objectList = new List<UsuarioData>();
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              join roles in MITEventUATdb.MITCS_roles on users.Rol_id equals roles.Rol_id
                              where users.User_id == UserID
                              select new { users, roles.Name, roles.Description }).ToList();

            foreach (var item in Usuario_db)
            {
                UsuarioData data = new UsuarioData();
                data.User_id = item.users.User_id;
                data.EmployeeNumber = item.users.EmployeeNumber;
                data.User = item.users.WindowsUser;
                data.Password = item.users.Password;
                data.Rol_id = item.users.Rol_id;
                data.Name = item.users.Name;
                data.LastName = item.users.LastName;
                data.Organization = item.users.Organization;
                data.AuthenticationType = item.users.AuthenticationType;
                data.Active = item.users.Active;
                data.Created = item.users.Created;
                data.CreatedBy = item.users.CreatedBy;
                data.Email = item.users.Email;
                data.Updated = item.users.Updated;
                data.UpdatedBy = item.users.UpdatedBy;
                data.Removed = (bool)item.users.Removed;
                data.RemovedBy = item.users.RemovedBy;
                data.RemovedDate = item.users.RemovedDate;
                data.RolName = item.Name;
                data.RolDescription = item.Description;

                objectList.Add(data);
            }

            // Convertir la lista a un array y devolverlo
            return objectList.ToArray();
        }
    }
}