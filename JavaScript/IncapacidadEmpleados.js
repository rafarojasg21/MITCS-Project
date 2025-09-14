var urlconexionwebservice = "http://localhost:60319/MITCSWS.asmx/";

$(document).ready(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    CargarListaDepartments();
    CargarListaHospitales();
    CargarListaDoctores();
    CargarListaTipo();
    CargarEmployeesTable();
});

//funcion para cargar la lisa de los departamentos segun la tabla de Employees
function CargarListaDepartments() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaDepartments',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                    // Agregar una opción al Select2 con el valor de LOV_id y el texto de Value
                    $('#select_Department').append('<option value="' + item.EmployeeDepartmentName + '">' + item.EmployeeDepartmentName + '</option>');
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_Department').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

//funcion para cargar la lista de los Hospitales
function CargarListaHospitales() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaHospitales',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Submenu_id y el texto de Name
                    $('#select_listaHospitales').append('<option value="' + item.id + '">' + item.Value + '</option>');
                    $('#select_listaHospitalesEdicion').append('<option value="' + item.id + '">' + item.Value + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listaHospitales').trigger('change');
            $('#select_listaHospitalesEdicion').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

//funcion para cargar la lista de los Doctores
function CargarListaDoctores() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaDoctores',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Submenu_id y el texto de Name
                    $('#select_listaDoctores').append('<option value="' + item.id + '">' + item.Value + '</option>');
                    $('#select_listaDoctoresEdicion').append('<option value="' + item.id + '">' + item.Value + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listaDoctores').trigger('change');
            $('#select_listaDoctoresEdicion').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

//funcion para cargar la lista de los Doctores
function CargarListaTipo() {
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaTipo',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Submenu_id y el texto de Name
                    $('#select_listaTipoIncapacidad').append('<option value="' + item.id + '">' + item.Value + '</option>');
                    $('#select_listaTipoIncapacidadEdicion').append('<option value="' + item.id + '">' + item.Value + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listaTipoIncapacidad').trigger('change');
            $('#select_listaTipoIncapacidadEdicion').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function llenar_detallesEmployee(id) {
    var obj = {};
    obj.id = id;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ObtenerEmployee',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {
                
                document.getElementById("form_idEmployee").value = id;

                CargarIncapacidadesTable();

            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesEmployees")
        }
    });
}

function llenar_detallesIncapacidad(id) {
    var obj = {};
    obj.id = id;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'ListaAusenciasPorEmpleadoDetalles',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                // LLenando la informacion para el modal edicion de Incapacidad
                document.getElementById("form_idIncapacidad").value = item.IncapacidadId;
                document.getElementById("form_fechaInicioEdicion").value = fechaCompletaTransformar(item.Fecha_inicio);
                document.getElementById("form_fechaFinalEdicion").value = fechaCompletaTransformar(item.Fecha_final);
                $('#select_listaHospitalesEdicion').val(item.HospitalId).change();
                $('#select_listaDoctoresEdicion').val(item.DoctorId).change();
                $('#select_listaTipoIncapacidadEdicion').val(item.TipoId).change();
                document.getElementById("form_numeroSerieEdicion").value = item.Numero_serie;
                document.getElementById("form_observacionEdicion").value = item.Observacion;

            });
            horas_incapacidadEdicion();
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesIncapacidad")
        }
    });
}

$("#dateTimeInicio").on("change.datetimepicker", function(e) {
    horas_incapacidad();
});

$("#dateTimeFinal").on("change.datetimepicker", function (e) {
    horas_incapacidad();
});

function horas_incapacidad() {
    var f_inicio = document.getElementById("form_fechaInicio").value;
    var f_final = document.getElementById("form_fechaFinal").value;

    if (!f_inicio || !f_final) {
        return;
    }

    // Convertir las fechas de string a objetos Date
    var fechaInicio = new Date(f_inicio);
    var fechaFinal = new Date(f_final);

    // Calcular la diferencia en milisegundos
    var diferenciaMs = fechaFinal - fechaInicio;

    // Calcular la diferencia en horas
    var diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    // Inicializar variable para las horas de incapacidad
    var horasIncapacidad = 0;

    // Si las fechas son del mismo día
    if (fechaInicio.toDateString() === fechaFinal.toDateString()) {
        horasIncapacidad = Math.min(diferenciaHoras, 8); // Máximo 8 horas si es el mismo día
        horasIncapacidad = parseFloat(horasIncapacidad.toFixed(3)); // Limitar a 3 decimales
    }

    else {
        // Si las fechas son de días diferentes
        var fechaInicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
        var fechaFinalSinHora = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());

        // Calcular días completos entre las dos fechas
        var diasCompletos = Math.round((fechaFinalSinHora - fechaInicioSinHora) / (1000 * 60 * 60 * 24));

        // Sumar las horas del primer día, máximo 8
        var horasPrimerDia = 24 - fechaInicio.getHours();
        horasPrimerDia = Math.min(horasPrimerDia, 8);

        // Sumar las horas del último día, máximo 8
        var horasUltimoDia = fechaFinal.getHours();
        horasUltimoDia = Math.min(horasUltimoDia, 8);

        // Total de horas de incapacidad
        horasIncapacidad = horasPrimerDia + (diasCompletos - 1) * 8 + horasUltimoDia;
    }

    // Mostrar el resultado en el campo "form_horasIncapacidad"
    document.getElementById("form_horasIncapacidad").value = horasIncapacidad;
}

$("#dateTimeInicioEdicion").on("change.datetimepicker", function (e) {
    horas_incapacidadEdicion();
});

$("#dateTimeFinalEdicion").on("change.datetimepicker", function (e) {
    horas_incapacidadEdicion();
});

function horas_incapacidadEdicion() {
    var f_inicio = document.getElementById("form_fechaInicioEdicion").value;
    var f_final = document.getElementById("form_fechaFinalEdicion").value;

    if (!f_inicio || !f_final) {
        return;
    }

    // Convertir las fechas de string a objetos Date
    var fechaInicio = new Date(f_inicio);
    var fechaFinal = new Date(f_final);

    // Calcular la diferencia en milisegundos
    var diferenciaMs = fechaFinal - fechaInicio;

    // Calcular la diferencia en horas
    var diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    // Inicializar variable para las horas de incapacidad
    var horasIncapacidad = 0;

    // Si las fechas son del mismo día
    if (fechaInicio.toDateString() === fechaFinal.toDateString()) {
        horasIncapacidad = Math.min(diferenciaHoras, 8); // Máximo 8 horas si es el mismo día
        horasIncapacidad = parseFloat(horasIncapacidad.toFixed(3)); // Limitar a 3 decimales
    }

    else {
        // Si las fechas son de días diferentes
        var fechaInicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
        var fechaFinalSinHora = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());

        // Calcular días completos entre las dos fechas
        var diasCompletos = Math.round((fechaFinalSinHora - fechaInicioSinHora) / (1000 * 60 * 60 * 24));

        // Sumar las horas del primer día, máximo 8
        var horasPrimerDia = 24 - fechaInicio.getHours();
        horasPrimerDia = Math.min(horasPrimerDia, 8);

        // Sumar las horas del último día, máximo 8
        var horasUltimoDia = fechaFinal.getHours();
        horasUltimoDia = Math.min(horasUltimoDia, 8);

        // Total de horas de incapacidad
        horasIncapacidad = horasPrimerDia + (diasCompletos - 1) * 8 + horasUltimoDia;
    }

    // Mostrar el resultado en el campo "form_horasIncapacidad"
    document.getElementById("form_horasIncapacidadEdicion").value = horasIncapacidad;
}

//creacion de incapacidad
function creacionIncapacidad() {
    $(document).ready(function () {

        var obj = {};
        obj.employeeId = document.getElementById('form_idEmployee').value;
        obj.LOVid = document.getElementById("select_listaTipoIncapacidad").value;
        obj.startDate = document.getElementById("form_fechaInicio").value;
        obj.endDate = document.getElementById("form_fechaFinal").value;
        obj.observation = document.getElementById("form_observacion").value;
        obj.hospitalLovID = document.getElementById("select_listaHospitales").value;
        obj.doctorLovID = document.getElementById("select_listaDoctores").value;
        obj.serialNumber = document.getElementById("form_numeroSerie").value;
        obj.createdby = localStorage.username;

        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'CrearEmployeeAbsence',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                Notificacion_Success("Incapacidad completada exitosamente");
                setTimeout(function () {
                    $('#modal_creacionIncapacidad').modal('hide');
                    document.getElementById("dateTimeInicio").value = "";
                    document.getElementById("dateTimeFinal").value = "";
                    document.getElementById("form_numeroSerie").value = "";
                    document.getElementById("form_observacion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionIncapacidad");
            }
        });
    });
}

function edicionIncapacidad() {
    $(document).ready(function () {

        var obj = {};
        obj.id = document.getElementById('form_idIncapacidad').value;
        obj.LovID = document.getElementById("select_listaTipoIncapacidadEdicion").value;
        obj.startDate = document.getElementById("form_fechaInicioEdicion").value;
        obj.endDate = document.getElementById("form_fechaFinalEdicion").value;
        obj.observation = document.getElementById("form_observacionEdicion").value;
        obj.hospitalLovID = document.getElementById("select_listaHospitalesEdicion").value;
        obj.doctorLovID = document.getElementById("select_listaDoctoresEdicion").value;
        obj.serialNumber = document.getElementById("form_numeroSerieEdicion").value;
        obj.updatedby = localStorage.username;

        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'EditarEmployeeAbsence',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                Notificacion_Success("Incapacidad editada exitosamente");
                setTimeout(function () {
                    $('#modal_edicionIncapacidad').modal('hide');
                    document.getElementById("dateTimeInicioEdicion").value = "";
                    document.getElementById("dateTimeFinalEdicion").value = "";
                    document.getElementById("form_numeroSerieEdicion").value = "";
                    document.getElementById("form_observacionEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - edicionIncapacidad");
            }
        });
    });
}

function desactivarIncapacidad() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idIncapacidad").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarAbsence',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Incapacidad desactivada exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarIncapacidad")
            }
        });
    });
}

function CargarEmployeesTable() {
    // Borra la data previamente mostrada en la tabla (si hay)
    $("#tablaEmployees").dataTable().fnDestroy();

    var obj = {};
    obj.Employees = document.getElementById("form_Employees").value;
    obj.Department = document.getElementById("select_Department").value;

    var pageSize = 50; // Número de registros por solicitud
    var pageIndex = 0;
    var allDataLoaded = false;
    EmployeesTableArray = [];

    function loadData() {
        if (allDataLoaded) {
            return;
        }

        obj.pageIndex = pageIndex;
        obj.pageSize = pageSize;

        $.ajax({
            type: 'POST',
            url: urlconexionwebservice + 'ListaEmployees',
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var json = JSON.parse(data.d);
                if (json.length < pageSize) {
                    allDataLoaded = true;
                }

                // Iterar sobre los datos obtenidos
                $.each(json, function (index, item) {
                    var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_incapacidades" onclick="llenar_detallesEmployee(' + "'" + item.id + "'" + ');" > ' + item.EmployeeNumber + ' </a>';
                    EmployeesTableArray.push({
                        "id": item.id,
                        "EmployeeStatus": item.EmployeeStatus,
                        "EmployeeNumber": hipervinculo,
                        "EmployeeDepartmentCode": item.EmployeeDepartmentCode,
                        "EmployeeDepartmentName": item.EmployeeDepartmentName,
                        "EmployeeCurrentShitf": item.EmployeeCurrentShitf,
                        "EmployeeFirstName": item.EmployeeFirstName,
                        "EmployeeFirstLastName": item.EmployeeFirstLastName,
                        "created": fecha_yyyy_MM_dd_transformar(item.created),
                        "lastUpdate": item.lastUpdate,
                        "ocupationLovId": item.ocupationLovId,
                        "organizationId": item.organizationId,
                        "createdBy": item.createdBy,
                        "changed": fecha_yyyy_MM_dd_transformar(item.changed),
                        "changedBy": item.changedBy,
                        "removed": item.removed,
                        "removedDate": fecha_yyyy_MM_dd_transformar(item.removedDate),
                        "removedBy": item.removedBy,
                        "EmployeeOcupationCode": item.EmployeeOcupationCode,
                        "EmployeeDesoccupation": item.EmployeeDesoccupation,
                        "EmployeeOperation": item.EmployeeOperation,
                        "EmployeeDesoccupationM4": item.EmployeeDesoccupationM4,
                        "HireDate": item.HireDate,
                        "hhrrOccupationLovId": item.hhrrOccupationLovId
                    });
                });

                if (allDataLoaded) {
                    $('#tablaEmployees').DataTable({
                        data: EmployeesTableArray,
                        columns: [
                            { data: 'EmployeeNumber' },
                            { data: 'EmployeeFirstName' },
                            { data: 'EmployeeFirstLastName' },
                            { data: 'EmployeeDepartmentName' }
                        ]
                    });
                }

                else {
                    pageIndex++;
                    loadData();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - CargarEmployeesTable");
                allDataLoaded = true;
            }
        });
    }

    loadData();
}

function CargarIncapacidadesTable() {
    // Borra la data previamente mostrada en la tabla (si hay)
    $("#tablaIncapacidades").dataTable().fnDestroy();

    var obj = {};
    obj.employeeId = document.getElementById("form_idEmployee").value;

    incapacidadesTableArray = [];
    var tablaIncapacidades = $('#tablaIncapacidades');

    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'POST',
        url: urlconexionwebservice + 'ListaAusenciasPorEmpleado',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionIncapacidad" onclick="llenar_detallesIncapacidad(' + "'" + item.IncapacidadId + "'" + ');"> ' + item.Numero_serie + ' </a>';
                incapacidadesTableArray.push({
                    "# de Serie": hipervinculo,
                    "FechaInicio": fechaCompletaTransformar(item.Fecha_inicio),
                    "FechaFinal": fechaCompletaTransformar(item.Fecha_final),
                    "Tipo": item.Tipo,
                    "Hospital": item.Hospital,
                    "Doctor": item.Doctor,
                    "Observacion": item.Observacion,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.Fecha_creacion),
                    "CreadoPor": item.Creado_por,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.Fecha_modificacion),
                    "ModificadoPor": item.Modificado_por
                });
            });

            $('#tablaIncapacidades').DataTable({
                data: incapacidadesTableArray,
                columns: [
                    { data: '# de Serie' },
                    { data: 'FechaInicio' },
                    { data: 'FechaFinal' },
                    { data: 'Tipo' },
                    { data: 'Hospital' },
                    { data: 'Doctor' },
                    { data: 'Observacion' },
                    { data: 'FechaCreacion' },
                    { data: 'CreadoPor' },
                    { data: 'FechaModificacion' },
                    { data: 'ModificadoPor' }
                ]
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}
