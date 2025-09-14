var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function autenticacion() {
    var obj = {};
    obj.usuario = document.getElementById("user").value;
    obj.password = document.getElementById("password").value;

    var user = obj.usuario;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'Autenticacion',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            if (data.d == true) {
                //Guardar el usuario y el ROL en variables locales de la pagina
                localStorage.username = document.getElementById("user").value;

                obtener_RolID(user);
                localStorage.RolID = document.getElementById("form_RolID").value;

                //Mandar a la pagina de inicio
                //location.href = urlconexionsite + 'events.html';
                location.href = 'http://localhost:54391/Website/Page/HomePage.html';
                
            }
            else {
                alert("Usuario o contraseña incorrecta");
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - Autenticacion")
        }
    });
}

function obtener_RolID(user) {
    var obj = {};
    obj.user = user;
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'POST',
        url: urlconexionwebservice + 'ObtenerUsuario',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            // El servidor ya devuelve un objeto JSON, no es necesario usar JSON.parse
            var json = JSON.parse(data.d);
            if (json && json.Removed !== true) {
                document.getElementById("form_RolID").value = json.Rol_id;
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}