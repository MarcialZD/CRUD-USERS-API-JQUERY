function append_user(user, index = 0) {
    const $tbody = $("#users_table tbody");

    let $tr = $("<tr style='display:none;'>");
    $tr.append(`<td>${user.id}</td>`);
    $tr.append(`<td>${user.name}</td>`);
    $tr.append(`<td>${user.username}</td>`);
    $tr.append(`<td>${user.email}</td>`);
    $tr.append(`<td>${user.phone}</td>`);

    let $actions = $("<td>");
    let $btnEliminar = $("<button class='btn btn-danger btn-sm me-2'>Eliminar</button>");
    let $btnDetalle = $("<button class='btn btn-info btn-sm'>Detalle</button>");

    $btnEliminar.click(function () {
        $tr.fadeOut(500, function () {
            $tr.remove();
            let users = JSON.parse(localStorage.getItem("users")).filter((u) => u.id !== user.id);
            localStorage.setItem("users", JSON.stringify(users));
        });
    });

    $btnDetalle.click(function () {
        location.href = `detalle_user.html?id=${user.id}`;
    });

    $actions.append($btnEliminar, $btnDetalle);
    $tr.append($actions);

    $tbody.append($tr);
    setTimeout(() => {
        $tr.fadeIn();
    }, index * 200);
}

function render_users(data) {
    $("#form_container").hide();

    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid or empty data");
        return;
    }

    if (localStorage.getItem("users") === null) {
        localStorage.setItem("users", JSON.stringify(data));
    }

    let users = JSON.parse(localStorage.getItem("users"));
    $("#users_table tbody").empty();

    users.forEach((user, index) => {
        append_user(user, index);
    });
}

function render_detalle_user(user) {
    if (!user) {
        console.error("User not found");
        return;
    }

    let div_user = $("<div class='user'>").hide();
    div_user.append(`<div class='user_name'>Nombre: ${user.name}</div>`);
    div_user.append(`<div class='user_name'>Username: ${user.username}</div>`);
    div_user.append(`<div class='user_email'>Email: ${user.email}</div>`);
    div_user.append(`<div class='user_phone'>Teléfono: ${user.phone}</div>`);
    $(".container_detail_user").append(div_user);
    div_user.fadeIn();
}

if (location.pathname.includes("/detalle_user.html")) {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
        let users = JSON.parse(localStorage.getItem("users"));
        let user = users.find((u) => u.id == id);
        if (user) {
            render_detalle_user(user);
        } else {
            console.error("User not found");
        }
    } else {
        console.error("ID not found in URL");
    }
}

$(document).ready(function () {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
        success: function (data) {
            render_users(data);
        },
        error: function (err) {
            console.log(err);
        }
    });

    $("#logout").click(function () {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "No, cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("users");
                swalWithBootstrapButtons.fire({
                    title: "Sesión cerrada",
                    text: "Has salido correctamente.",
                    icon: "success"
                }).then(() => {
                    location.href = "index.html";
                });
            } else {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "Tu sesión sigue activa.",
                    icon: "error"
                });
            }
        });
    });

    $("#add_user").click(function () {
        $("#form_container").toggle();
        $(this).text("Añadiendo usuario...").prop("disabled", true);
    });

    $("#btn_cancel_add_user").click(function () {
        $("#form_container").toggle();
        $("#add_user").text("Agregar").prop("disabled", false);
    });

    $("#form").submit(function (event) {
        event.preventDefault();

        let name = $("#name").val();
        let username = $("#user_name").val();
        let email = $("#email").val();
        let phone = $("#telefono").val();

        if (!name || !username || !email || !phone) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor completa todos los campos.",
            });
            return;
        }

        let users = JSON.parse(localStorage.getItem("users"));
        let newUser = {
            id: users.length + 1,
            name: name,
            username: username,
            email: email,
            phone: phone
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        append_user(newUser); 
        $("#form_container").toggle();
        $("#add_user").text("Agregar").prop("disabled", false);
        $("#form")[0].reset();

        Swal.fire({
            icon: "success",
            title: "Usuario añadido",
            text: "El usuario ha sido añadido correctamente.",
        });
    });
});
