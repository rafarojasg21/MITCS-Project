var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(document).ready(function () {
    
    CargarLOVTypeTable();
});

function llenar_detallesLOVType(id) {
    var obj = {};
    obj.id = id;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'LOVTypeInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                // LLenando la informacion para el modal edicion de LOVType
                document.getElementById("form_nombreLOVTypeEdicion").value = item.LOVTypeName;
                document.getElementById("form_idLOVTypeEdicion").value = item.id;
                document.getElementById("form_descripcionLOVTypeEdicion").value = item.LOVTypeDescription;
            });

            //Borra la data previamente mostrada en la tabla (si hay) y carga los Valores del LOVType seleccionado
            $("#tablaLOV").dataTable().fnDestroy();
            CargarLOVTable();
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesLOVType")
        }
    });
}

//creacion de LOVType
function creacionLOVType() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.name = document.getElementById("form_nombreLOVType").value;
        obj.description = document.getElementById("form_descripcionLOVType").value;
        obj.createdby = localStorage.username;

        var nombreLOVType = obj.name;
        var descripcionLOVType = obj.description;

        //Validando que los campos no esten vacios
        if (nombreLOVType.trim() === '' || descripcionLOVType.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'CrearLOVType',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("LOV completado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionLOVType').modal('hide');
                    document.getElementById("form_nombreLOVType").value = "";
                    document.getElementById("form_descripcionLOVType").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionLOVType")
            }
        });
    });
}

function editarLOVType() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idLOVTypeEdicion").value;
        obj.name = document.getElementById("form_nombreLOVTypeEdicion").value;
        obj.description = document.getElementById("form_descripcionLOVTypeEdicion").value;
        obj.updatedby = localStorage.username;

        var nombreLOVType = obj.name;
        var descripcionLOVType = obj.description;

        //Validando que los campos no esten vacios
        if (nombreLOVType.trim() === '' || descripcionLOVType.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarLOVType',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("LOV editado exitosamente");
                setTimeout(function () {
                    $('#modal_edicionLOVType').modal('hide');
                    document.getElementById("form_idLOVTypeEdicion").value = "";
                    document.getElementById("form_nombreLOVTypeEdicion").value = "";
                    document.getElementById("form_descripcionLOVTypeEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarLOVType")
            }
        });
    });
}

function desactivarLOVType() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idLOVTypeEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarLOVType',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("LOV desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarLOVType")
            }
        });
    });
}

function CargarLOVTypeTable() {
    LOVTypeTableArray = [];
    var tablaLOVType = $('#tablaLOVType');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaLOVType',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionLOVType" onclick="llenar_detallesLOVType(' + "'" + item.id + "'" + ');"> ' + item.LOVTypeName + ' </a>';
                LOVTypeTableArray.push({
                    "LOVType_id": item.id,
                    "Nombre": hipervinculo,
                    "Descripcion": item.LOVTypeDescription,
                    "CreadoPor": item.createdBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.created),
                    "ModificadoPor": item.changedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.changed),
                    "Desactivado": item.removed,
                    "DesactivadoPor": item.removedBy,
                    "FechaDesactivacion": fecha_yyyy_MM_dd_transformar(item.removedDate)
                });
            });

            $('#tablaLOVType').DataTable({
                data: LOVTypeTableArray,
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

function llenar_detallesLOV(id) {
    var obj = {};
    obj.id = id;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'LOVInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                // LLenando la informacion para el modal edicion de LOVType
                document.getElementById("form_nombreLOVEdicion").value = item.Value;
                document.getElementById("form_idLOVEdicion").value = item.id;
                document.getElementById("form_descripcionLOVEdicion").value = item.Description;
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesLOV")
        }
    });
}

//creacion de LOV
function creacionLOV() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.LOVTypeid = document.getElementById("form_idLOVTypeEdicion").value;
        obj.value = document.getElementById("form_nombreLOV").value;
        obj.description = document.getElementById("form_descripcionLOV").value;
        obj.createdby = localStorage.username;

        var valueLOV = obj.value;
        var descripcionLOV = obj.description;

        //Validando que los campos no esten vacios
        if (valueLOV.trim() === '' || descripcionLOV.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'CrearLOV',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Valor completado exitosamente");

                $('#modal_creacionLOV').modal('hide');
                document.getElementById("form_nombreLOV").value = "";
                document.getElementById("form_descripcionLOV").value = "";
                
                llenar_detallesLOVType(obj.LOVTypeid);
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionLOV")
            }
        });
    });
}

function editarLOV() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idLOVEdicion").value;
        obj.LOVTypeid = document.getElementById("form_idLOVTypeEdicion").value;
        obj.value = document.getElementById("form_nombreLOVEdicion").value;
        obj.description = document.getElementById("form_descripcionLOVEdicion").value;
        obj.updatedby = localStorage.username;

        var nombreLOV = obj.value;
        var descripcionLOV = obj.description;

        //Validando que los campos no esten vacios
        if (nombreLOV.trim() === '' || descripcionLOV.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarLOV',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Valor editado exitosamente");

                $('#modal_edicionLOV').modal('hide');
                document.getElementById("form_idLOVEdicion").value = "";
                document.getElementById("form_nombreLOVEdicion").value = "";
                document.getElementById("form_descripcionLOVEdicion").value = "";

                llenar_detallesLOVType(obj.LOVTypeid);
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarLOV")
            }
        });
    });
}

function desactivarLOV() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idLOVEdicion").value;
        obj.removedby = localStorage.username;

        var LOVTypeid = document.getElementById("form_idLOVTypeEdicion").value;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarLOV',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Valor desactivado exitosamente");

                $('#modal_edicionLOV').modal('hide');
                llenar_detallesLOVType(LOVTypeid);
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarLOV")
            }
        });
    });
}

function CargarLOVTable() {
    var obj = {};
    obj.LOVTypeid = document.getElementById("form_idLOVTypeEdicion").value;; 

    LOVTableArray = [];
    var tablaLOV = $('#tablaLOV');

    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'POST',
        url: urlconexionwebservice + 'ListaLOV',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionLOV" onclick="llenar_detallesLOV(' + "'" + item.id + "'" + ');"> ' + item.Value + ' </a>';
                LOVTableArray.push({
                    "LOV_id": item.id,
                    "LOVType_id": item.LOVTypeid,
                    "Valor": hipervinculo,
                    "Descripcion": item.Description,
                    "CreadoPor": item.createdBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.created),
                    "ModificadoPor": item.changedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.changed),
                    "Desactivado": item.removed,
                    "DesactivadoPor": item.removedBy,
                    "FechaDesactivacion": fecha_yyyy_MM_dd_transformar(item.removedDate)
                });
            });

            $('#tablaLOV').DataTable({
                data: LOVTableArray,
                columns: [
                    { data: 'Valor' },
                    { data: 'Descripcion' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}