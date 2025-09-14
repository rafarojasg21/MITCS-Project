var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(function () {
    $('#datepickerDiurno').datepicker({
        multidate: true
    });
});

$(function () {
    $('#datepickerNocturno').datepicker({
        multidate: true
    });
});

$(function () {
    $('#datepickerVespertino').datepicker({
        multidate: true
    });
});

$(document).ready(function () {
    CargarProveedoresTable();
    llenar_turnos();
});

function llenar_detallesProveedor(id) {
    var obj = {};
    obj.id = id;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ProveedorInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                if (item.priority == '1') {
                    document.getElementById("select_prioridadProveedorEdicion").value = "LOW";
                }

                else if (item.priority == '2') {
                    document.getElementById("select_prioridadProveedorEdicion").value = "MEDIUM";
                }

                else document.getElementById("select_prioridadProveedorEdicion").value = "HIGH";

                document.getElementById("form_nombreProveedorEdicion").value = item.name;
                document.getElementById("form_idProveedorEdicion").value = item.id;
                document.getElementById("form_contactoProveedorEdicion").value = item.contact;
                document.getElementById("form_capacidadProveedorEdicion").value = item.capacity;
                document.getElementById("form_precioRegularProveedorEdicion").value = item.regularFoodPrice;
                document.getElementById("form_precioEspecialProveedorEdicion").value = item.specialFoodPrice;

            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesProveedor")
        }
    });
}

function creacionProveedorComida() {
    $(document).ready(function () {
        var obj = {};
        obj.name = document.getElementById("form_nombreProveedor").value;
        obj.contact = document.getElementById("form_contactoProveedor").value;
        obj.capacity = document.getElementById("form_capacidadProveedor").value;
        obj.regularFoodPrice = document.getElementById("form_precioRegularProveedor").value;
        obj.specialFoodPrice = document.getElementById("form_precioEspecialProveedor").value;
        obj.createdby = localStorage.username;

        var prioridad = document.getElementById("select_prioridadProveedor").value;

        //Validando que los campos no esten vacios
        if (prioridad.trim() === 'LOW') {
            obj.priority = '1';
        }

        else if (prioridad.trim() === 'MEDIUM') {
            obj.priority = '2';
        }

        else obj.priority = '3';

        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'CrearProveedorComida',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                Notificacion_Success("Proveedor completado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionProveedorComida').modal('hide');
                    document.getElementById("form_nombreProveedor").value = "";
                    document.getElementById("form_contactoProveedor").value = "";
                    document.getElementById("form_capacidadProveedor").value = "";
                    document.getElementById("form_precioRegularProveedor").value = "";
                    document.getElementById("form_precioEspecialProveedor").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionProveedorComida");
            }
        });
    });
}

function edicionProveedorComida() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idProveedorEdicion").value;
        obj.name = document.getElementById("form_nombreProveedorEdicion").value;
        obj.contact = document.getElementById("form_contactoProveedorEdicion").value;
        obj.capacity = document.getElementById("form_capacidadProveedorEdicion").value;
        obj.regularFoodPrice = document.getElementById("form_precioRegularProveedorEdicion").value;
        obj.specialFoodPrice = document.getElementById("form_precioEspecialProveedorEdicion").value;
        obj.updatedBy = localStorage.username;

        var prioridad = document.getElementById("select_prioridadProveedorEdicion").value;

        //Validando que los campos no esten vacios
        if (prioridad.trim() === 'LOW') {
            obj.priority = '1';
        }

        else if (prioridad.trim() === 'MEDIUM') {
            obj.priority = '2';
        }

        else obj.priority = '3';

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarProveedorComida',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Proveedor editado exitosamente");
                setTimeout(function () {
                    $('#modal_edicionProveedorComida').modal('hide');
                    document.getElementById("form_nombreProveedorEdicion").value = "";
                    document.getElementById("form_contactoProveedorEdicion").value = "";
                    document.getElementById("form_capacidadProveedorEdicion").value = "";
                    document.getElementById("form_precioRegularProveedorEdicion").value = "";
                    document.getElementById("form_precioEspecialProveedorEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - edicionProveedorComida")
            }
        });
    });
}

function desactivarProveedorComida() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idProveedorEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarProveedorComida',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Proveedor desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarProveedorComida")
            }
        });
    });
}

function CargarProveedoresTable() {
    proveedoresTableArray = [];
    var tablaProveedores = $('#tablaProveedoresComida');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaProveedoresComida',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {

                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionProveedorComida" onclick="llenar_detallesProveedor(' + "'" + item.id + "'" + ');"> ' + item.name + ' </a>';
                var calendario = '<button type="button" class="btn btn-primary fa fa-calendar" data-toggle="modal" data-target="#modal_calendarioProveedorComida" onclick="llenar_detallesCalendarioProveedor(' + "'" + item.id + "'" + ');"></button>';
                var prioridad = '';

                if (item.priority == '1') {
                    prioridad = 'LOW';
                }

                else if (item.priority == '2') {
                    prioridad = 'MEDIUM';
                }

                else prioridad = 'HIGH';

                proveedoresTableArray.push({
                    "Proveedor_id": item.id,
                    "Nombre": hipervinculo,
                    "Contacto": item.contact,
                    "Capacidad": item.capacity,
                    "Prioridad": prioridad,
                    "CreadoPor": item.createdBy,
                    "ModificadoPor": item.changedBy,
                    "Desactivado": item.removed,
                    "DesactivadoPor": item.removedBy,
                    "PrecioRegular": item.regularFoodPrice,
                    "PrecioEspecial": item.specialFoodPrice,
                    "Calendario": calendario
                });
            });

            $('#tablaProveedoresComida').DataTable({
                data: proveedoresTableArray,
                columns: [
                    { data: 'Nombre' },
                    { data: 'Contacto' },
                    { data: 'Capacidad' },
                    { data: 'Prioridad' },
                    { data: 'PrecioRegular' },
                    { data: 'PrecioEspecial' },
                    { data: 'Calendario' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function llenar_turnos() {
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaTurnos',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var turnos = JSON.parse(data.d);

            // Agrupar turnos por tipo
            var turnosDiurnos = turnos.find(turno => turno.Value === "DIURNO");
            var turnosNocturnos = turnos.find(turno => turno.Value === "NOCTURNO");
            var turnosVespertinos = turnos.find(turno => turno.Value === "VESPERTINO");

            // Llenar formularios con el valor específico de cada turno
            if (turnosDiurnos) {
                document.getElementById("form_turnoDiurno").value = turnosDiurnos.Value;
            }
            if (turnosNocturnos) {
                document.getElementById("form_turnoNocturno").value = turnosNocturnos.Value;
            }
            if (turnosVespertinos) {
                document.getElementById("form_turnoVespertino").value = turnosVespertinos.Value;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_turnos");
        }
    });
}

function llenar_detallesCalendarioProveedor(id) {
    document.getElementById("form_idProveedor").value = id;

    var obj = {};
    obj.providerId = id;

    $.ajax({
        type: 'POST',
        url: urlconexionwebservice + 'CalendarioProveedorInfoToArray',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);

            // Limpiar los datepickers antes de llenarlos
            $('#datepickerDiurno').datepicker('clearDates');
            $('#datepickerNocturno').datepicker('clearDates');
            $('#datepickerVespertino').datepicker('clearDates');

            // Arrays para almacenar todas las fechas de cada turno
            var diurnoDates = [];
            var nocturnoDates = [];
            var vespertinoDates = [];

            $.each(json, function (index, item) {
                var date = new Date(parseInt(item.requestDate.substr(6))); // Convertir la fecha a un objeto Date
                var formattedDate = moment(date).format('L'); // Formatear la fecha

                // Dependiendo del turno, agregar la fecha al array correspondiente
                if (item.requestShift === "DIURNO") {
                    diurnoDates.push(formattedDate);
                } else if (item.requestShift === "NOCTURNO") {
                    nocturnoDates.push(formattedDate);
                } else if (item.requestShift === "VESPERTINO") {
                    vespertinoDates.push(formattedDate);
                }
            });

            // Establecer todas las fechas en los datepickers correspondientes
            $('#datepickerDiurno').datepicker('setDates', diurnoDates);

            $('#datepickerNocturno').datepicker('setDates', nocturnoDates);

            $('#datepickerVespertino').datepicker('setDates', vespertinoDates);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesCalendarioProveedor");
        }
    });
}

function borrarRegistrosPosteriores() {
    var obj = {};
    obj.providerId = document.getElementById('form_idProveedor').value;

    $.ajax({
        type: "POST",
        url: urlconexionwebservice + 'BorrarRegistrosPosteriores',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            console.log("Registros borrados exitosamente.");
        },
        error: function (error) {
            console.error("Error al borrar los registros: ", error);
        }
    });
}


function calendarioDiurnoProveedorComida() {
    var dates = $('#datepicker_diurno').val();
    var dateArray = dates.split(',');
    var today = new Date();

    $(document).ready(function () {
        dateArray.forEach(function (date) {
            var selectedDate = new Date(date);

            if (selectedDate >= today) { // Validar si la fecha es a partir de hoy
                var obj = {};
                obj.providerId = document.getElementById('form_idProveedor').value;
                obj.requestDate = date;
                obj.requestShift = document.getElementById("form_turnoDiurno").value;
                obj.createdBy = localStorage.username;

                $.ajax({
                    type: 'POST',
                    url: urlconexionwebservice + 'CalendarioProveedorComida',
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        // Aquí puedes manejar la respuesta del servidor para cada fecha
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Notificacion_Error("Service Error - calendarioDiurnoProveedorComida");
                    }
                });
            } else {
                Notificacion_Error("No se pueden seleccionar fechas anteriores a la actual.");
            }
        });
    });
}

function calendarioNocturnoProveedorComida() {
    // Obtener el valor del input de fechas
    var dates = $('#datepicker_nocturno').val();

    // Separar las fechas por comas
    var dateArray = dates.split(',');

    // Obtener la fecha actual
    var today = new Date();

    $(document).ready(function () {

        // Recorrer cada fecha en el array
        dateArray.forEach(function (date) {
            var selectedDate = new Date(date);

            // Validar si la fecha es a partir de hoy
            if (selectedDate >= today) {
                var obj = {};
                obj.providerId = document.getElementById('form_idProveedor').value;
                obj.requestDate = date;
                obj.requestShift = document.getElementById("form_turnoNocturno").value;
                obj.createdBy = localStorage.username;

                $.ajax({
                    type: 'POST',
                    url: urlconexionwebservice + 'CalendarioProveedorComida',
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        // Aquí puedes manejar la respuesta del servidor para cada fecha
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Notificacion_Error("Service Error - calendarioNocturnoProveedorComida");
                    }
                });
            } else {
                Notificacion_Error("No se pueden seleccionar fechas anteriores a la actual.");
            }
        });
    });
}

function calendarioVespertinoProveedorComida() {
    // Obtener el valor del input de fechas
    var dates = $('#datepicker_vespertino').val();

    // Separar las fechas por comas
    var dateArray = dates.split(',');

    // Obtener la fecha actual
    var today = new Date();

    $(document).ready(function () {

        // Recorrer cada fecha en el array
        dateArray.forEach(function (date) {
            var selectedDate = new Date(date);

            // Validar si la fecha es a partir de hoy
            if (selectedDate >= today) {
                var obj = {};
                obj.providerId = document.getElementById('form_idProveedor').value;
                obj.requestDate = date;
                obj.requestShift = document.getElementById("form_turnoVespertino").value;
                obj.createdBy = localStorage.username;

                $.ajax({
                    type: 'POST',
                    url: urlconexionwebservice + 'CalendarioProveedorComida',
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        Notificacion_Success("Calendarios agendados exitosamente");
                        setTimeout(function () {
                            $('#modal_calendarioProveedorComida').modal('hide');
                            location.reload();
                        }, 2000); // Esperar 2 segundos antes de recargar la página
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Notificacion_Error("Service Error - calendarioVespertinoProveedorComida");
                    }
                });
            } else {
                Notificacion_Error("No se pueden seleccionar fechas anteriores a la actual.");
            }
        });
    });
}