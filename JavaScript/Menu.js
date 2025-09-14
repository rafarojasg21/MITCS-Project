var urlconexionwebservice = "https://localhost:44339/MITCSWS.asmx/";
var url_imagen = 'http://localhost:54391/Website/Page/';

$(document).ready(function () {

    $('#modal_seleccionImagen').on('show.bs.modal', function () {
        cargarImagenes();
    });
    $('#modal_seleccionImagenEdicion').on('show.bs.modal', function () {
        cargarImagenesEdicion();
    });


    CargarMenuTable();
    
});

function cargarImagenes() {
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ObtenerImagenes',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var imagenes = JSON.parse(data.d);
            var contenedor = $('#imagenes-predefinidas');
            contenedor.empty();
            imagenes.forEach(function (imagen) {
                var imagenCompleta = url_imagen + imagen.ImageURL;
                contenedor.append(`
                    <div class="col-md-3">
                        <img src="${imagenCompleta}" onclick="ImagenSeleccionada('${imagen.ImageURL}', '${imagenCompleta}')" 
                        style="cursor: pointer;" class="img-thumbnail imagen-fondo-menu">
                    </div>
                `);
            });
        },
        error: function (error) {
            console.error('Error al cargar las imágenes:', error);
        }
    });
}

function ImagenSeleccionada(imagenURL, imagenCompleta) {
    $('#modal_creacionMenu .imagen-fondo-menu').attr('src', imagenCompleta);
    $('#hiddenImageURL').val(imagenURL);
    $('#modal_seleccionImagen').modal('hide');
    $('#modal_creacionMenu').modal('show');
}

function cargarImagenesEdicion() {
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ObtenerImagenes',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var imagenes = JSON.parse(data.d);
            var contenedor = $('#imagenes-predefinidasEdicion');
            contenedor.empty();
            imagenes.forEach(function (imagen) {
                var imagenCompleta = url_imagen + imagen.ImageURL;
                contenedor.append(`
                    <div class="col-md-3">
                        <img src="${imagenCompleta}" onclick="ImagenSeleccionadaEdicion('${imagen.ImageURL}', '${imagenCompleta}')" 
                        style="cursor: pointer;" class="img-thumbnail imagen-fondo-menu">
                    </div>
                `);
            });
        },
        error: function (error) {
            console.error('Error al cargar las imágenes:', error);
        }
    });
}

function ImagenSeleccionadaEdicion(imagenURL, imagenCompleta) {
    $('#modal_edicionMenu .imagen-fondo-menu').attr('src', imagenCompleta);
    $('#hiddenImageURLEdicion').val(imagenURL);
    $('#modal_seleccionImagenEdicion').modal('hide');
    $('#modal_edicionMenu').modal('show');
}

function llenar_detallesmenu(menuID) {
    var obj = {};
    obj.MenuID = menuID;

    $.ajax({
        type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
        url: urlconexionwebservice + 'MenuInfoToArray',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
        success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            var json = JSON.parse(data.d);
            $.each(json, function (index, item) {

                var imagenCompleta = url_imagen + item.ImagePath;

                // LLenando la informacion para el modal edicion de menu
                document.getElementById("form_nombreMenuEdicion").value = item.Name;
                document.getElementById("form_idMenuEdicion").value = item.Menu_id;
                document.getElementById("form_descripcionMenuEdicion").value = item.Description;
                $('#modal_edicionMenu .imagen-fondo-menu').attr('src', imagenCompleta);
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            Notificacion_Error("Service Error - llenar_detallesmenu")
        }
    });
}

//creacion de menu
function creacionMenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.name = document.getElementById("form_nombreMenu").value;
        obj.description = document.getElementById("form_descripcionMenu").value;
        obj.imagePath = $('#hiddenImageURL').val();
        obj.createdby = localStorage.username;

        var nombreMenu = obj.name;
        var descripcionMenu = obj.description;

        //Validando que los campos no esten vacios
        if (nombreMenu.trim() === '' || descripcionMenu.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'CrearMenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Menu completado exitosamente");
                setTimeout(function () {
                    $('#modal_creacionMenu').modal('hide');
                    document.getElementById("form_nombreMenu").value = "";
                    document.getElementById("form_descripcionMenu").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - creacionMenu")
            }
        });
    });
}

function editarMenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idMenuEdicion").value;
        obj.name = document.getElementById("form_nombreMenuEdicion").value;
        obj.description = document.getElementById("form_descripcionMenuEdicion").value;
        obj.imagePath = $('#hiddenImageURLEdicion').val();
        obj.updatedby = localStorage.username;

        var nombreMenu = obj.name;
        var descripcionMenu = obj.description;

        //Validando que los campos no esten vacios
        if (nombreMenu.trim() === '' || descripcionMenu.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return false; // Evita que se envíe el formulario
        }

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'EditarMenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Menu editado exitosamente");
                setTimeout(function () {
                    $('#modal_edicionMenu').modal('hide');
                    document.getElementById("form_idMenuEdicion").value = "";
                    document.getElementById("form_nombreMenuEdicion").value = "";
                    document.getElementById("form_descripcionMenuEdicion").value = "";
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - editarMenu")
            }
        });
    });
}

function desactivarMenu() {   //  <- Nombre de la FUNCION
    $(document).ready(function () { //
        //para hacer llamados a metodos Web utilizamos AJAX,
        //que es otro lenguaje para consultas de servicios.
        // y en caso de recibir respuesta, la recibimos en JSON

        var obj = {};
        obj.id = document.getElementById("form_idMenuEdicion").value;
        obj.removedby = localStorage.username;

        //Funcion para consumir datos del JSON
        $.ajax({
            type: 'POST', // <- tipo de metodo web, GET si solo consulta informacion y no afectara el estado de nada o POST si se modifican (agregar/actualizar/borrar) data.
            url: urlconexionwebservice + 'DesactivarMenu',  // <- URL DEL METODO WEB.ASMX/NOMBREDELMETODO.
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json", // <- COMO SE RECIBIRA LA INFORMACION
            success: function (data) { // <- SI FUNCIONA, QUE ES LO QUE HARA
                Notificacion_Success("Menu desactivado exitosamente");
                setTimeout(function () {
                    location.reload();
                }, 2000); // Esperar 2 segundos antes de recargar la página
            },

            error: function (jqXHR, textStatus, errorThrown) {
                Notificacion_Error("Service Error - desactivarMenu")
            }
        });
    });
}

function CargarMenuTable() {
    menuTableArray = [];
    var tablamenu = $('#tablamenu');
    // Realizar la petición AJAX al servicio web
    $.ajax({
        type: 'GET',
        url: urlconexionwebservice + 'ListaMenu',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // Iterar sobre los datos obtenidos y agregar opciones al Select2
            $.each(json, function (index, item) {
                var hipervinculo = '<a href="" data-toggle="modal" data-target="#modal_edicionMenu" onclick="llenar_detallesmenu(' + "'" + item.Menu_id + "'" + ');"> ' + item.Name + ' </a>';
                menuTableArray.push({
                    "Menu_id": item.Menu_id,
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

            $('#tablamenu').DataTable({
                data: menuTableArray,
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

