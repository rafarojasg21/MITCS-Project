var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(document).ready(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Escucha el clic en el botón con clase "btn-secondary"
    $('.btn-secondary').click(function () {

        // Muestra el modal con ID "modal_duplicacionRol"
        $('#modal_duplicacionRol').modal('show');
    });

    //Bootstrap Duallistbox
    var demo1 = $('#ListaAplicaciones').bootstrapDualListbox({
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
        selectorMinimalHeight: 250,
    });

    var demo2 = $('#ListaAplicacionesRoles').bootstrapDualListbox({
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
        selectorMinimalHeight: 250,
    });

    var demo3 = $('#ListaAplicacionesRolesDuplicado').bootstrapDualListbox({
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
        selectorMinimalHeight: 250,
    });

    cargarlistaAplicaciones();
    CargarRolTable();
});

//funcion para cargar la lista de las aplicaciones en la BD
function cargarlistaAplicaciones() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaAplicacion',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al DualListBox
            $.each(json, function (index, item) {
                if (!item.Removed) {
                    // Agregar una opción al DualListBox con el valor de Application_id y el texto de Name
                    $('#ListaAplicaciones').append('<option value="' + item.Application_id + '">' + item.Name + '</option>');
                }
            });

            // Actualizar el DualListBox después de agregar las opciones
            $('#ListaAplicaciones').bootstrapDualListbox('refresh', true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - cargarlistaAplicaciones")
        }
    });
}

//funcion para llenar los datos de la BD en los Detalles y modals
function llenar_detallesRol(RolID) {
    var obj = {};
    obj.RolID = RolID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'RolInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                //LLenando la informacion para el modal edicion de rol
                document.getElementById("form_nombreRolEdicion").value = item.Name;
                document.getElementById("form_idRolEdicion").value = item.Rol_id;
                document.getElementById("form_descripcionRolEdicion").value = item.Description;

                //LLenando la informacion para el modal duplicacion de rol
                document.getElementById("form_nombreRolDuplicacion").value = item.Name;
                document.getElementById("form_descripcionRolDuplicacion").value = item.Description;
            });

            //Llamando la funcion para rellenar la informacion de las aplicaciones en el DualListBox
            cargarListaAplicacionesDisponibles(RolID);
            cargarListaAplicacionRolesSeleccionadas(RolID);
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesRol")
        }
    });
}

function cargarListaAplicacionesDisponibles(RolID) {
    var obj = {};
    obj.RolID = RolID;

    //Para limpiar el DualListBox
    $('#ListaAplicacionesRoles').empty();
    $('#ListaAplicacionesRolesDuplicado').empty();

    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'POST',
        url: urlconexionwebservice + 'ListaAplicacionSinAsignarAlRol',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al DualListBox
            $.each(json, function (index, item) {
                    // Agregar una opción al DualListBox con el valor de Application_id y el texto de Name
                $('#ListaAplicacionesRoles').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
                $('#ListaAplicacionesRolesDuplicado').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
            });

            // Actualizar el DualListBox después de agregar las opciones
            $('#ListaAplicacionesRoles').bootstrapDualListbox('refresh', true);
            $('#ListaAplicacionesRolesDuplicado').bootstrapDualListbox('refresh', true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function cargarListaAplicacionRolesSeleccionadas(RolID) {
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

                if (RolID === item.Rol_id) {
                    // Agregar una opción al DualListBox con el valor de Application_id y el texto de Name
                    $('#ListaAplicacionesRoles').append('<option value="' + item.Application_id + '" selected = "selected ">' + item.NombreAplicacion + '</option>');
                    $('#ListaAplicacionesRolesDuplicado').append('<option value="' + item.Application_id + '" selected = "selected ">' + item.NombreAplicacion + '</option>');
                }
                else {
                    $('#ListaAplicacionesRoles').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
                    $('#ListaAplicacionesRolesDuplicado').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
                }
            });

            // Actualizar el DualListBox después de agregar las opciones
            $('#ListaAplicacionesRoles').bootstrapDualListbox('refresh', true);
            $('#ListaAplicacionesRolesDuplicado').bootstrapDualListbox('refresh', true);
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - cargarListaAplicacionRolesSeleccionadas")
        }
    });
}

//creacion de roles
function creacionRol() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON
        var seleccionado = 1;
        var obj = {};
        obj.name = document.getElementById("form_nombreRol").value;
        obj.description = document.getElementById("form_descripcionRol").value;
        obj.createdby = localStorage.username;

        var nombreRol = obj.name;
        var descripcionRol = obj.description;

        //Validando que los campos no esten vacios
        if (nombreRol.trim() === '' || descripcionRol.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta o POST si envias parametros.
            url: urlconexionwebservice + 'CrearRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA

                if (data.d.trim() != '') {

                    // Llamar a la función para agregar aplicaciones al rol con el ID del rol como parámetro
                    crearAplicacionRoles(data.d, descripcionRol, seleccionado);

                    Notificacion_Success("Rol completado exitosamente");
                    setTimeout(function () {
                        $('#modal_creacionRol').modal('hide');
                        document.getElementById("form_nombreRol").value = "";
                        document.getElementById("form_descripcionRol").value = "";
                        location.reload();
                    }, 2000); // Esperar 2 segundos antes de recargar la página
                }

                else {
                    Notificacion_Error("Service Error - creacionRol")
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionRol")
            }
        });
    });
}

//añadiendo las aplicaciones a las que pertenecera un rol
function crearAplicacionRoles(rolID, descripcionRol, seleccionado) {

    if (seleccionado == 1) {
        // Obtener todos los elementos seleccionados del DualListBox
        var selectedItems = $('#ListaAplicaciones').val();
    }
    else if (seleccionado == 0){
        var selectedItems = $('#ListaAplicacionesRoles').val();
    }
    else if (seleccionado == 2) {
        var selectedItems = $('#ListaAplicacionesRolesDuplicado').val();
    }

    // Verificar si al menos un elemento está seleccionado
    for (var i = 0; i < selectedItems.length; i++) {
        var obj = {
            aplicacionID: selectedItems[i], // Enviar la lista de IDs de aplicaciones seleccionadas
            rolID: rolID,
            aplicacionDescripcion: "", // No estoy seguro de si necesitas esto
            rolDescripcion: descripcionRol,
            createdby: localStorage.username
        };

        // Realizar la petición AJAX al servicio web
        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'CrearAplicacionRoles',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                Notificacion_Success("Aplicaciones agregadas al rol exitosamente");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - crearAplicacionRoles");
            }
        });
    }
}

function editarRol() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON
        seleccionado = 0;
        var obj = {};
        obj.id = document.getElementById("form_idRolEdicion").value;
        obj.name = document.getElementById("form_nombreRolEdicion").value;
        obj.description = document.getElementById("form_descripcionRolEdicion").value;
        obj.updatedby = localStorage.username;

        var nombreRol = obj.name;
        var descripcionRol = obj.description;

        //Validando que los campos no esten vacios
        if (nombreRol.trim() === '' || descripcionRol.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            async: false,
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA

                limpiarAppsSeleccionadas(obj.id);

                crearAplicacionRoles(obj.id, obj.description, seleccionado);

                Notificacion_Success("Rol editado exitosamente");
                setTimeout(function () {
                    $('#modal_edicionRoles').modal('hide');
                    document.getElementById("form_idRolEdicion").value = "";
                    document.getElementById("form_nombreRolEdicion").value = "";
                    document.getElementById("form_descripcionRolEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarRol")
            }
        });
    });
}

function limpiarAppsSeleccionadas(rolID) {
    var obj = {};
    obj.rolID = rolID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'EditarAplicacionRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        async: false,
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - limpiarAppsSeleccionadas")
        }
    });
}

function desactivarRol() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idRolEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Rol desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarRol")
            }
        });
    });
}

function duplicarRol() {
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON
        var seleccionado = 2;
        var obj = {};
        obj.name = document.getElementById("form_nombreRolDuplicacion").value;
        obj.description = document.getElementById("form_descripcionRolDuplicacion").value;
        obj.createdby = localStorage.username;

        var nombreRol = obj.name;
        var descripcionRol = obj.description;

        //Validando que los campos no esten vacios
        if (nombreRol.trim() === '' || descripcionRol.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta o POST si envias parametros.
            url: urlconexionwebservice + 'CrearRoles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA

                if (data.d.trim() != '') {

                    // Llamar a la función para agregar aplicaciones al rol con el ID del rol como parámetro
                    crearAplicacionRoles(data.d, descripcionRol, seleccionado);

                    Notificacion_Success("Duplicacion de Rol completada exitosamente");
                    setTimeout(function () {
                        $('#modal_duplicacionRol').modal('hide');
                        document.getElementById("form_nombreRolDuplicacion").value = "";
                        document.getElementById("form_descripcionRolDuplicacion").value = "";
                        location.reload();
                    }, 2000); // Esperar 2 segundos antes de recargar la página
                }

                else {
                    Notificacion_Error("Service Error - duplicarRol")
                }
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - duplicarRol")
            }
        });
    });
}

function CargarRolTable() {
    rolTableArray = [];
    var tablaRol = $('#tablaRol');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaRoles',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionRol" onclick = "llenar_detallesRol(' + "'" + item.Rol_id + "'" + ');" > ' + item.Name + ' </a > ';

                rolTableArray.push({
                    "Rol_id": item.Rol_id,
                    "Nombre": hipervinculo,
                    "Descripcion": item.Description,
                    "CreadoPor": item.CreatedBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.Created),
                    "ModificadoPor": item.UpdatedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.Updated),
                    "Desactivado": item.Removed,
                    "DesactivadoPor": item.RemovedBy,
                    "FechaDesactivacion": fecha_yyyy_MM_dd_transformar(item.RemovedDate)
                });
            });

            $('#tablaRol').DataTable({
                data: rolTableArray,
                columns: [
                    { data: 'Nombre' },
                    { data: 'Descripcion' },
                    { data: 'CreadoPor' },
                    { data: 'FechaCreacion' },
                    { data: 'ModificadoPor' },
                    { data: 'FechaModificacion' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}