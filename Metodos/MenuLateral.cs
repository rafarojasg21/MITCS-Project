using MitcsClassLibrary.UI;
using MITCSService.DataBase;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static MITCSService.Metodos.AplicacionRoles;

namespace MITCSService.Metodos
{
    public class MenuLateral
    {
        public class ListaSubmenuConNombre
        {
            public string Submenu_id { get; set; }
            public string Menu_id { get; set; }
            public string NombreSubmenu { get; set; }
        }

        public class ListaMenuConNombre
        {
            public string Menu_id { get; set; }
            public string NombreMenu { get; set; }
            public string ImageURL { get; set; }
        }

        // Para la obtencion de las aplicaciones relacionadas al Rol con el que se ingresa al loggearse
        // estas estan en la funcion de ListaAplicacionRoles(string RolID) en AplicacionRoles.cs

        //Devuelve la lista de Submenus con respecto a las aplicaciones asignadas al rol
        public static List<ListaSubmenuConNombre> ListaSubmenuLateral(string RolID)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            var SubmenuLateral_db = (from roleApplications in MITEventUATdb.MITCS_roleApplications
                                     join applications in MITEventUATdb.MITCS_applications
                                     on roleApplications.Application_id equals applications.Application_id
                                     join submenus in MITEventUATdb.MITCS_submenus
                                     on applications.Submenu_id equals submenus.Submenu_id
                                     where roleApplications.Rol_id == RolID
                                     select new ListaSubmenuConNombre
                                     {
                                         Submenu_id = applications.Submenu_id,
                                         Menu_id = submenus.Menu_id,
                                         NombreSubmenu = submenus.Name,
                                     }).Distinct().ToList();

            return SubmenuLateral_db;
        }

        //Devuelve la lista de Menus con respecto a los submenus
        public static List<ListaMenuConNombre> ListaMenuLateral(string RolID)
        {
            DataBase.MITEventsUATDataContext MITEventUATdb = new DataBase.MITEventsUATDataContext();

            var MenuLateral_db = (from roleApplications in MITEventUATdb.MITCS_roleApplications
                                  join applications in MITEventUATdb.MITCS_applications
                                  on roleApplications.Application_id equals applications.Application_id
                                  join submenus in MITEventUATdb.MITCS_submenus
                                  on applications.Submenu_id equals submenus.Submenu_id
                                  join menus in MITEventUATdb.MITCS_menus
                                  on submenus.Menu_id equals menus.Menu_id
                                  where roleApplications.Rol_id == RolID
                                  select new ListaMenuConNombre
                                     {
                                         Menu_id = submenus.Menu_id,
                                         NombreMenu = menus.Name,
                                         ImageURL = menus.ImagePath
                                     }).Distinct().ToList();

            return MenuLateral_db;
        }

    }
}