var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(document).ready(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    cargarListaSubmmenu();
    CargarAplicacionTable();
});

//funcion para cargar la lista de los submenus en la BD
function cargarListaSubmmenu() {
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
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Submenu_id y el texto de Name
                    $('#select_listasubmenu_aplicacion').append('<option value="' + item.Submenu_id + '">' + item.Name + '</option>');
                    $('#select_listaSubmenuAplicacion_edicion').append('<option value="' + item.Submenu_id + '">' + item.Name + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listasubmenu_aplicacion').trigger('change');
            $('#select_listaSubmenuAplicacion_edicion').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

//funcion para llenar los datos de la BD en los Detalles y modals
function llenar_detallesAplicacion(AplicacionID) {
    var obj = {};
    obj.AplicacionID = AplicacionID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'AplicacionInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                // LLenando la informacion para el modal edicion de Aplicacion
                // Verificar si la opción existe
                if ($('#select_listaSubmenuAplicacion_edicion option[value="' + item.Submenu_id + '"]').length > 0) {
                    // Seleccionar la opción existente
                    $('#select_listaSubmenuAplicacion_edicion').val(item.Submenu_id).change();
                } else {
                    console.log('La opción no existe en el select');
                }
                $('#select_tipoAplicacion_edicion').val(item.Type).change();
                document.getElementById("form_nombreAplicacionEdicion").value = item.Name;
                document.getElementById("form_idAplicacionEdicion").value = item.Application_id;
                document.getElementById("form_descripcionAplicacionEdicion").value = item.Description;
                document.getElementById("form_URLEdicion").value = item.URL;

            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesAplicacion")
        }
    });
}

//creacion de aplicacion
function creacionAplicacion() {
    $(document).ready(function () {
        var obj = {};
        obj.submenuID = document.getElementById("select_listasubmenu_aplicacion").value;
        obj.name = document.getElementById("form_nombreAplicacion").value;
        obj.description = document.getElementById("form_descripcionAplicacion").value;
        obj.type = document.getElementById("select_tipoAplicacion").value;
        obj.createdby = localStorage.username;
        obj.URL = document.getElementById("form_URL").value;

        var nombreAplicacion = obj.name;
        var descripcionAplicacion = obj.description;

        //Validando que los campos no esten vacios
        if (nombreAplicacion.trim() === '' || descripcionAplicacion.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'CrearAplicacion',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                Notificacion_Success("Aplicacion completada exitosamente");
                setTimeout(function () {
                    $('#modal_creacionAplicacion').modal('hide');
                    document.getElementById("form_nombreAplicacion").value = "";
                    document.getElementById("form_descripcionAplicacion").value = "";
                    document.getElementById("form_URL").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionAplicacion");
            }
        });
    });
}

function editarAplicacion() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idAplicacionEdicion").value;
        obj.submenuID = document.getElementById("select_listaSubmenuAplicacion_edicion").value;
        obj.name = document.getElementById("form_nombreAplicacionEdicion").value;
        obj.description = document.getElementById("form_descripcionAplicacionEdicion").value;
        obj.type = document.getElementById("select_tipoAplicacion_edicion").value;
        obj.updatedby = localStorage.username;
        obj.URL = document.getElementById("form_URLEdicion").value;


        var nombreAplicacion = obj.name;
        var descripcionAplicacion = obj.description;

        //Validando que los campos no esten vacios
        if (nombreAplicacion.trim() === '' || descripcionAplicacion.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarAplicacion',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Aplicacion editada exitosamente");
                setTimeout(function () {
                    $('#modal_edicionAplicacion').modal('hide');
                    document.getElementById("form_idAplicacionEdicion").value = "";
                    document.getElementById("form_nombreAplicacionEdicion").value = "";
                    document.getElementById("form_descripcionAplicacionEdicion").value = "";
                    document.getElementById("form_URLEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarAplicacion")
            }
        });
    });
}

function desactivarAplicacion() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idAplicacionEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarAplicacion',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Aplicacion desactivada exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarAplicacion")
            }
        });
    });
}

function CargarAplicacionTable() {
    aplicacionTableArray = [];
    var tablaAplicacion = $('#tablaAplicacion');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaAplicacion',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionAplicacion" onclick="llenar_detallesAplicacion(' + "'" + item.Application_id + "'" + ');"> ' + item.Name + ' </a>';
                aplicacionTableArray.push({
                    "Aplicacion_id": item.Application_id,
                    "Nombre": hipervinculo,
                    "Descripcion": item.Description,
                    "Tipo": item.Type,
                    "CreadoPor": item.CreatedBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.Created),
                    "ModificadoPor": item.UpdatedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.Updated),
                    "Desactivado": item.Removed,
                    "DesactivadoPor": item.RemovedBy,
                    "FechaDesactivacion": fecha_yyyy_MM_dd_transformar(item.RemovedDate),
                    "SubmenuPadre": item.NombreSubmenu
                });
            });

            $('#tablaAplicacion').DataTable({
                data: aplicacionTableArray,
                columns: [
                    { data: 'Nombre' },
                    { data: 'Descripcion' },
                    { data: 'Tipo' },
                    { data: 'CreadoPor' },
                    { data: 'FechaCreacion' },
                    { data: 'ModificadoPor' },
                    { data: 'FechaModificacion' },
                    { data: 'SubmenuPadre' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}