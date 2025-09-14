var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

$(document).ready(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    CargarListaDepartments();
    CargarTurnos();

    $('#datepickerDiurno').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        todayHighlight: true
    });
});

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

function CargarTurnos() {
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaTurnos',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);

            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                // Agregar una opción al Select2 con el valor de LOV_id y el texto de Value
                $('#select_Turno').append('<option value="' + item.Value + '">' + item.Value + '</option>');
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_Turno').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}