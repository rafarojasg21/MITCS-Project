using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace MITCSService.Metodos
{
    public class Login
    {
        public static bool Autenticacion(string usuario, string password)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();
            DataBase.MITCS_user NewRecord = new DataBase.MITCS_user();

            var Usuario_db = (from users in MITEventUATdb.MITCS_users
                              where users.WindowsUser.ToUpper() == usuario.ToUpper()
                              select users).FirstOrDefault();

            if (Usuario_db != null)
            {
                if (Usuario_db.AuthenticationType == "AD")
                {
                    MembershipProvider mp = default(MembershipProvider);
                    mp = Membership.Provider;
                    return mp.ValidateUser(usuario, password);
                }
                else 
                {
                    // Esta variable es un string que guardará el password cifrado.
                    string securedPassword = "";

                    // Se utiliza el método "EncryptPassword()" que se encuentra dentro de la librería (DLL) "MitcsClassLibrary" y se le envía 
                    // como parámetro el password sin cifrado.
                    securedPassword = MitcsClassLibrary.Security.PasswordGenerator.EncryptPassword(password);

                    var validacion = (from users in MITEventUATdb.MITCS_users
                                      where users.WindowsUser.ToUpper() == usuario.ToUpper() && users.Password == securedPassword
                                      select users).FirstOrDefault();

                    if (validacion != null)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }

            return false;
        }

    }
}