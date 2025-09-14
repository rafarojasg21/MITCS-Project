var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(document).ready(function () {

    //Initialize Select2 Elements
    $('.select2').select2()

    CargarSubmenuTable();
    cargarListaMenu();
});

//funcion para cargar la lista del menu en la creacion de un nuevo submenu
function cargarListaMenu() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaMenu',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2 para el modal de crear y editar
            $.each(json, function (index, item) {
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Menu_id y el texto de Name
                    $('#select_listamenu_submenu').append('<option value="' + item.Menu_id + '">' + item.Name + '</option>');
                    $('#select_listaMenuSubmenu_edicion').append('<option value="' + item.Menu_id + '">' + item.Name + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listamenu_submenu').trigger('change');
            $('#select_listaMenuSubmenu_edicion').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - cargarListaMenu")
        }
    });
}

//funcion para llenar los datos de la BD en los Detalles y modals
function llenar_detallesSubmenu(SubmenuID) {
    var submenuID = SubmenuID;
    var obj = {};
    obj.SubmenuID = submenuID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'SubmenuInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                // LLenando la informacion para el modal edicion de submenu
                // Verificar si la opción existe
                if ($('#select_listaMenuSubmenu_edicion option[value="' + item.Menu_id + '"]').length > 0) {
                    // Seleccionar la opción existente
                    $('#select_listaMenuSubmenu_edicion').val(item.Menu_id).change();
                } else {
                    console.log('La opción no existe en el select');
                }

                document.getElementById("form_nombreSubmenuEdicion").value = item.Name;
                document.getElementById("form_idSubmenuEdicion").value = item.Submenu_id;
                document.getElementById("form_descripcionSubmenuEdicion").value = item.Description;
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesSubmenu")
        }

    });
}

//creacion de submenu
function creacionSubmenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.menuID = document.getElementById("select_listamenu_submenu").value;
        obj.name = document.getElementById("form_nombreSubmenu").value;
        obj.description = document.getElementById("form_descripcionSubmenu").value;
        obj.createdby = localStorage.username;

        var nombreSubmenu = obj.name;
        var descripcionSubmenu = obj.description;

        //Validando que los campos no esten vacios
        if (nombreSubmenu.trim() === '' || descripcionSubmenu.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta o POST si envias parametros.
            url: urlconexionwebservice + 'CrearSubmenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Submenu completado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionSubmenu').modal('hide');
                    document.getElementById("form_nombreSubmenu").value = "";
                    document.getElementById("form_descripcionSubmenu").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionSubmenu")
            }

        });
    });
}

function editarSubmenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idSubmenuEdicion").value;
        obj.menuID = document.getElementById("select_listaMenuSubmenu_edicion").value;
        obj.name = document.getElementById("form_nombreSubmenuEdicion").value;
        obj.description = document.getElementById("form_descripcionSubmenuEdicion").value;
        obj.updatedby = localStorage.username;

        var nombreSubmenu = obj.name;
        var descripcionSubmenu = obj.description;

        //Validando que los campos no esten vacios
        if (nombreSubmenu.trim() === '' || descripcionSubmenu.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarSubmenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Submenu editado exitosamente");
                setTimeout(function () {
                    $('#modal_edicionSubmenu').modal('hide');
                    document.getElementById("form_idSubmenuEdicion").value = "";
                    document.getElementById("form_nombreSubmenuEdicion").value = "";
                    document.getElementById("form_descripcionSubmenuEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarSubmenu")
            }

        });
    });
}

function desactivarSubmenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idSubmenuEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarSubmenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Submenu desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarSubmenu")
            }

        });
    });
}

function CargarSubmenuTable() {
    submenuTableArray = [];
    var tablasubmenu = $('#tablasubmenu');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaSubmenu',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionSubmenu" onclick="llenar_detallesSubmenu(' + "'" + item.Submenu_id + "'" + ');"> ' + item.Name + ' </a>';
                submenuTableArray.push({
                    "Submenu_id": item.Submenu_id,
                    "Nombre": hipervinculo,
                    "Descripcion": item.Description,
                    "CreadoPor": item.CreatedBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.Created),
                    "ModificadoPor": item.UpdatedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.Updated),
                    "Desactivado": item.Removed,
                    "DesactivadoPor": item.RemovedBy,
                    "FechaDesactivacion": fecha_yyyy_MM_dd_transformar(item.RemovedDate),
                    "MenuPadre": item.NombreMenu
                });
            });

            $('#tablasubmenu').DataTable({
                data: submenuTableArray,
                columns: [
                    { data: 'Nombre' },
                    { data: 'Descripcion' },
                    { data: 'CreadoPor' },
                    { data: 'FechaCreacion' },
                    { data: 'ModificadoPor' },
                    { data: 'FechaModificacion' },
                    { data: 'MenuPadre' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}