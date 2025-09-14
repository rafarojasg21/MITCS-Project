var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

//Inicializar el estado del passwordDiv al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    var selectAuthentication = document.getElementById('select_autenticacion');
    var passwordInput = document.getElementById('form_contraUsuario'); // Target the password input
    var passwordDiv = document.getElementById('passwordDiv'); // Select the password container

    // Ensure passwordDiv is always visible
    passwordDiv.style.display = 'block';

    // Handle selection change to manage password state
    selectAuthentication.addEventListener('change', function () {
        passwordInput.disabled = (selectAuthentication.value === 'AD');
    });

    // Initial state (optional, based on default select value)
    if (selectAuthentication.value === 'AD') {
        passwordInput.disabled = true;
    } else {
        passwordInput.disabled = false;
    }
});

//Inicializar el estado del password_edicionDiv al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    var selectAutenticacion = document.getElementById('select_autenticacionEdicion');
    var passwordInput = document.getElementById('form_contraNueva');  // Target the password input

    selectAutenticacion.addEventListener('change', function () { // Handle selection change
        passwordInput.disabled = (selectAutenticacion.value === 'AD');  // Toggle disabled state
    });

    // Initial state (optional, based on default select value)
    if (selectAutenticacion.value === 'AD') {
        passwordInput.disabled = true;
    } else {
        passwordInput.disabled = false;
    }
});

$(document).ready(function () {

    document.getElementById('select_autenticacion').addEventListener('change', function () {
        var passwordInput = document.getElementById('form_contraUsuario'); // Target the password input

        // Ensure passwordDiv is always visible
        document.getElementById('passwordDiv').style.display = 'block';

        // Disable password input when "AD" is selected
        passwordInput.disabled = (this.value === 'AD');
    });

    //Agregar el listener para el cambio de autenticación y la visibilidad de la contraseña en la edicion del usuario
    document.getElementById('select_autenticacionEdicion').addEventListener('change', handleAutenticacionChange);
    document.getElementById('togglePassword_edicion').addEventListener('click', togglePasswordVisibility);

    //Comportamiento del boton para visualizar u ocultar la contraseña en la creacion del usuario
    document.getElementById('togglePassword').addEventListener('click', function () {
        var passwordField = document.getElementById('form_contraUsuario');
        var passwordFieldType = passwordField.getAttribute('type');
        var icon = this.querySelector('i');

        if (passwordFieldType === 'password') {
            passwordField.setAttribute('type', 'text');
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordField.setAttribute('type', 'password');
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    //Initialize Select2 Elements
    $('.select2').select2()

    //Llenar las aplicaciones a las que tiene acceso el rol seleccionado
    $('#select_listaRol').change(function () {
        // Obtener el RolID seleccionado
        var selectedRolID = $(this).val();

        // Llamar a la función para cargar la lista de aplicaciones
        cargarListaAplicacionRolesSeleccionadas(selectedRolID);
    });

    $('#select_listaEdicionRol').change(function () {
        // Obtener el RolID seleccionado
        var selectedEdicionRolID = $(this).val();

        // Llamar a la función para cargar la lista de aplicaciones
        cargarListaAplicacionRolesSeleccionadasEdicion(selectedEdicionRolID);
    });

    cargarListaRoles();
    CargarUserTable();
});

// Función que maneja el cambio de autenticación en la edicion
function handleAutenticacionChange() {
    var passwordInput = document.getElementById('form_contraNueva'); // Target the password input

    // Ensure passwordDiv is always visible
    document.getElementById('password_edicionDiv').style.display = 'block';

    // Disable password input when "AD" is selected
    passwordInput.disabled = (document.getElementById('select_autenticacionEdicion').value === 'AD');
}

// Función que maneja la alternancia de visibilidad de la contraseña en la edicion
function togglePasswordVisibility() {
    var passwordField = document.getElementById('form_contraNueva');
    var passwordFieldType = passwordField.getAttribute('type');
    var icon = document.getElementById('togglePassword_edicion').querySelector('i');

    if (passwordFieldType === 'password') {
        passwordField.setAttribute('type', 'text');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.setAttribute('type', 'password');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

//funcion para cargar la lista de los roles en la BD
function cargarListaRoles() {

    $('#select_listaEdicionRol').empty();

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
                if (item.Removed != true) {
                    // Agregar una opción al Select2 con el valor de Rol_id y el texto de Name
                    $('#select_listaRol').append('<option value="' + item.Rol_id + '">' + item.Name + '</option>');
                    $('#select_listaEdicionRol').append('<option value="' + item.Rol_id + '">' + item.Name + '</option>');
                }
            });

            // Actualizar el Select2 después de agregar las opciones
            $('#select_listaRol').trigger('change');
            $('#select_listaEdicionRol').trigger('change');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

//funcion para llenar los datos de la BD en los Detalles y modals
function llenar_detallesUsuario(UserID) {
    var obj = {};
    obj.UserID = UserID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'UsuarioInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);

            $.each(json, function (index, item) {
                // LLenando la informacion para el modal edicion de submenu
                document.getElementById("form_numeroEdicionUsuario").value = item.EmployeeNumber;
                document.getElementById("form_idUsuarioEdicion").value = item.User_id;
                document.getElementById("form_EdicionUsuario").value = item.User;
                document.getElementById("form_emailEdicionUsuario").value = item.Email;
                document.getElementById("select_organizacionEdicionUsuario").value = item.Organization;
                document.getElementById("form_nombreEdicionUsuario").value = item.Name;
                document.getElementById("form_apellidoEdicionUsuario").value = item.LastName;
                document.getElementById("form_contraVieja").value = item.Password;

                // Cambiar el valor del select y llamar a la función de manejo de cambio
                $('#select_autenticacionEdicion').val(item.AuthenticationType).change();
                handleAutenticacionChange(); // Llamar directamente a la función para asegurar el manejo correcto

                //validando la opcion de los roles que ha sido seleccionada
                if ($('#select_listaEdicionRol option[value="' + item.Rol_id + '"]').length > 0) {
                    // Seleccionar la opción existente
                    $('#select_listaEdicionRol').val(item.Rol_id).change();
                } else {
                    console.log('La opción no existe en el select');
                }

                cargarListaAplicacionRolesSeleccionadasEdicion(item.Rol_id);
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesUsuario")
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

            // Limpiar la lista antes de agregar nuevos elementos
            $('#lista_appsRol').empty();

            $.each(json, function (index, item) {

                $('#lista_appsRol').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - cargarListaAplicacionRolesSeleccionadas")
        }
    });
}

function cargarListaAplicacionRolesSeleccionadasEdicion(RolID) {
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

            // Limpiar la lista antes de agregar nuevos elementos
            $('#lista_appsRol_edicion').empty();

            $.each(json, function (index, item) {

                $('#lista_appsRol_edicion').append('<option value="' + item.Application_id + '">' + item.NombreAplicacion + '</option>');
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - cargarListaAplicacionRolesSeleccionadasEdicion")
        }
    });
}

//creacion de usuarios
function creacionUsuarios() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.employeeNumber = document.getElementById("form_numeroUsuario").value;
        obj.user = document.getElementById("form_Usuario").value;
        obj.password = document.getElementById("form_contraUsuario").value;
        obj.rolID = document.getElementById("select_listaRol").value;
        obj.name = document.getElementById("form_nombreUsuario").value;
        obj.lastName = document.getElementById("form_apellidoUsuario").value;
        obj.organization = document.getElementById("select_organizacionUsuario").value;
        obj.authenticationType = document.getElementById("select_autenticacion").value;
        obj.createdby = localStorage.username;
        obj.email = document.getElementById("form_emailUsuario").value;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta o POST si envias parametros.
            url: urlconexionwebservice + 'CrearUsuarios',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Usuario completado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionUsuarios').modal('hide');
                    document.getElementById("form_numeroUsuario").value = "";
                    document.getElementById("form_Usuario").value = "";
                    document.getElementById("form_contraUsuario").value = "";
                    document.getElementById("form_nombreUsuario").value = "";
                    document.getElementById("form_apellidoUsuario").value = "";
                    document.getElementById("form_emailUsuario").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionUsuarios")
            }
        });
    });
}

function editarUsuario() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idUsuarioEdicion").value;
        obj.rolID = document.getElementById("select_listaEdicionRol").value;
        obj.employeeNumber = document.getElementById("form_numeroEdicionUsuario").value;
        obj.user = document.getElementById("form_EdicionUsuario").value;
        obj.name = document.getElementById("form_nombreEdicionUsuario").value;
        obj.lastName = document.getElementById("form_apellidoEdicionUsuario").value;
        obj.organization = document.getElementById("select_organizacionEdicionUsuario").value;
        obj.authenticationType = document.getElementById("select_autenticacionEdicion").value;
        obj.updatedby = localStorage.username;
        obj.email = document.getElementById("form_emailEdicionUsuario").value;


        var contraVieja = document.getElementById("form_contraVieja").value;
        var contraNueva = document.getElementById("form_contraNueva").value;
        var numeroEmpleado = obj.employeeNumber;
        var usuario = obj.user;

        //Validando que los campos no esten vacios
        if (numeroEmpleado.trim() === '' || usuario.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Validando si no se ingresa nada en la nueva contraseña, dejar la anterior
        if (contraNueva.trim() === '') {
            obj.password = document.getElementById("form_contraVieja").value;
        }
        //Si se esta cambiando y es diferente a la que habia, guardar la nueva
        else if (contraNueva.trim() != contraVieja.trim()) {
            obj.password = document.getElementById("form_contraNueva").value;
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarUsuario',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Usuario editado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionUsuarios').modal('hide');
                    document.getElementById("form_numeroEdicionUsuario").value = "";
                    document.getElementById("form_EdicionUsuario").value = "";
                    document.getElementById("form_contraNueva").value = "";
                    document.getElementById("form_nombreEdicionUsuario").value = "";
                    document.getElementById("form_apellidoEdicionUsuario").value = "";
                    document.getElementById("form_emailEdicionUsuario").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarUsuario")
            }
        });
    });
}

function desactivarUsuario() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idUsuarioEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarUsuario',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Usuario desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarUsuario")
            }
        });
    });
}

function CargarUserTable() {
    userTableArray = [];
    var tablaUser = $('#tablaUser');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'UsuarioInfo',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionUsuarios" onclick = "llenar_detallesUsuario(' + "'" + item.User_id + "'" + ');" > ' + item.User + ' </a > ';

                userTableArray.push({
                    "User_id": item.User_id,
                    "User": hipervinculo,
                    "EmployeeNumber": item.EmployeeNumber,
                    "Email": item.Email,
                    "AuthenticationType": item.AuthenticationType,
                    "Active": item.Active,
                    "Rol": item.RolName,
                    "CreadoPor": item.CreatedBy,
                    "FechaCreacion": fecha_yyyy_MM_dd_transformar(item.Created),
                    "ModificadoPor": item.UpdatedBy,
                    "FechaModificacion": fecha_yyyy_MM_dd_transformar(item.Updated),
                    "Desactivado": item.Removed
                });
            });

            $('#tablaUser').DataTable({
                data: userTableArray,
                columns: [
                    { data: 'User' },
                    { data: 'EmployeeNumber' },
                    { data: 'Email' },
                    { data: 'AuthenticationType' },
                    { data: 'Active' },
                    { data: 'Rol' },
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