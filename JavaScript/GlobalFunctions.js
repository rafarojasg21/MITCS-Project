var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";
var url_imagen = 'http://localhost:54391/Website/Page/';

// Llamar funciones cuando el documento esté listo
$(document).ready(function () {
    verificarCredenciales();
    ListaMenuLateral(localStorage.RolID);
    ListaSubmenuLateral(localStorage.RolID);
    ListaAplicacionesSegunRol(localStorage.RolID);
    GenerarBotonConfiguracion(localStorage.username)
    Mover_modal();

    //Date and time picker (Utilizados en AdminEmpleados.html) para seleccion de una sola fecha 
    $('#dateTimeInicio').datetimepicker({ icons: { time: 'far fa-clock' } });
    $('#dateTimeFinal').datetimepicker({ icons: { time: 'far fa-clock' } });
    $('#dateTimeInicioEdicion').datetimepicker({ icons: { time: 'far fa-clock' } });
    $('#dateTimeFinalEdicion').datetimepicker({ icons: { time: 'far fa-clock' } });
});

$('#menuSearch').on('keyup', function () {
    var searchTerm = $(this).val().toLowerCase();
    filterMenu(searchTerm);
});

//Funcion para filtrar el menu lateral de la pagina
function filterMenu(searchTerm) {
    $('#MenuLateral li.nav-item').each(function () {
        var menuItem = $(this).find('p').text().toLowerCase();
        if (menuItem.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

//Funcion para permitir el movimiento de un modal por la ventana
function Mover_modal() {
    $('.modal').modal({
        keyboard: false,
        show: false
    });
    // Jquery draggable
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });
}

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

//Funcion para mostrar en la esquina un mensaje de exito
function Notificacion_Success(Message) {
    Toast.fire({
        icon: 'success',
        title: Message
    })
};

//Funcion para mostrar en la esquina un mensaje de error
function Notificacion_Error(Message) {
    Toast.fire({
        icon: 'error',
        title: Message
    })
};

//Funcion para transformar el formato de la fecha traida del asmx en el JS
function fecha_yyyy_MM_dd_transformar(fechajson) {

    if (fechajson != null) {

        var json = parseInt(fechajson.substr(6));

        var transformar = new Date(json);

        var day = transformar.getDate();
        var month = transformar.getMonth();
        var years = transformar.getFullYear();
        var minutes = transformar.getMinutes();

        minutes = minutes < 10 ? '0' + minutes : minutes;

        day = day < 10 ? '0' + day : day;

        month = (month + 1) < 10 ? '0' + (month + 1) : (month + 1);

        var fecha = month + "-" + day + "-" + years;


        return fecha;

    }

    else{
        return "";
    }

}

function fechaCompletaTransformar(fechajson) {
    
    var json = parseInt(fechajson.substr(6));

    var transformar = new Date(json);

    var day = transformar.getDate();
    var month = transformar.getMonth();
    var years = transformar.getFullYear();

    var hours = transformar.getHours();
    var minutes = transformar.getMinutes();
    var segundos = transformar.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';


    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var fecha = (month + 1) + "/" + day + "/" + years + " " + hours + ":" + minutes /* + ":" + segundos */ + " " + ampm;

    return fecha;

}

function logout() {
    localStorage.clear();
    location.href = 'http://localhost:54391/Website/Page/Login.html';
}

function verificarCredenciales() {
    if (localStorage.username == null) {
        localStorage.clear();
        location.href = 'http://localhost:54391/Website/Page/Login.html';
    }
}

function GenerarBotonConfiguracion(User) {
        
    var contenedor = $('#BtnConfiguracion');

    contenedor.append(`
    <li class="dropdown user user-menu">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
            <i id="conectionstatus" class="fa fa-circle" style="color:lightgreen" title="Online"></i>
            <strong id="usuariolog" style="color:black">${User}</strong>
        </a>
        <ul class="dropdown-menu dropdown-menu-right dropdown-user">
            <li>
                <a data-toggle="modal" href="" style="color:black" data-target="#ModalChange">
                    <i class="fa fa-lock fa-fw"></i>
                    Cambiar contraseña
                </a>
            </li>
            <hr class="dropdown-divider">
            <li>
                <a onclick="logout()" href="" style="color:black">
                    <i class="fa fa-sign-out-alt fa-fw"></i>
                    Cerrar sesión
                </a>
            </li>
        </ul>
    </li>
    `);
}

function ListaAplicacionesSegunRol(RolID) {
    var obj = {};
    obj.RolID = RolID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ListaAplicacionRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);

            $.each(json, function (index, item) {
                var contenedor = $('#' + item.Submenu_id);

                if (item.TipoAplicacion == 'Aplicacion') {
                    var rutaCompleta = url_imagen + item.URL;

                    contenedor.append(`
                    <li class="nav-item">
                        <a href="${rutaCompleta}" class="nav-link" >
                            <i style="margin-left: 20px;" class="far fa-circle nav-icon"></i>
                            <p>${item.NombreAplicacion}</p>
                        </a>
                    </li>
                `);
                }

                else {
                    var rutaCompleta = item.URL;

                    contenedor.append(`
                    <li class="nav-item">
                        <a href="${rutaCompleta}" class="nav-link" target="_blank">
                            <i style="margin-left: 20px;" class="far fa-circle nav-icon"></i>
                            <p>${item.NombreAplicacion}</p>
                        </a>
                    </li>
                `);
                }
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - ListaAplicacionesSegunRol")
        }
    });
}

function ListaSubmenuLateral(RolID) {
    var obj = {};
    obj.RolID = RolID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ListaSubmenuLateral',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        async: false,
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);

            $.each(json, function (index, item) {
                var contenedor = $('#' + item.Menu_id);

                contenedor.append(`
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i style="margin-left: 10px;" class="fas fa-circle nav-icon"></i>
                            <p>
                                ${item.NombreSubmenu}
                                <i class="fas fa-angle-left right"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview" id="${item.Submenu_id}">
	                    </ul>
                    </li>
                `);
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - ListaSubmenuLateral")
        }
    });
}

function ListaMenuLateral(RolID) {
    var obj = {};
    obj.RolID = RolID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ListaMenuLateral',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        async: false,
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            var contenedor = $('#MenuLateral');
            contenedor.empty(); // Limpia el contenedor antes de agregar elementos

            $.each(json, function (index, item) {
                var imagenCompleta = url_imagen + item.ImageURL;

                contenedor.append(`
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <img src="${imagenCompleta}">
                            <p>
                                ${item.NombreMenu}
                                <i class="fas fa-angle-left right"></i>
                            </p>
                        </a>
	                    <ul class="nav nav-treeview" id="${item.Menu_id}">
	                    </ul>
                    </li>
                `);
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - ListaMenuLateral")
        }
    });
}