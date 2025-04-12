
function render_users(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid or empty data");
        return;
    }

    if (localStorage.getItem("users") === null) {
        localStorage.setItem("users", JSON.stringify(data));
    }

    let users = JSON.parse(localStorage.getItem("users"));
    $("#container").empty();

    users.forEach((user, index) => {
        let div_user = $("<div class='user'>").hide();
        let div_user_name = $(`<div class='user_name'>Nombre: ${user.name}</div>`);
        let div_user_username = $(`<div class='user_name'>Username: ${user.username}</div>`);
        let div_user_email = $(`<div class='user_email'>Email: ${user.email}</div>`);
        let div_user_phone = $(`<div class='user_phone'>Teléfono: ${user.phone}</div>`);

        let div_buttons = $("<div class='user_buttons'>");
        let div_button_eliminar = $("<button class='user_button_eliminar'>Eliminar</button>");
        let div_button_detalle = $("<button class='user_button_detalle'>Detalle</button>");

        div_button_eliminar.click(function () {
            div_user.fadeOut(500, function () {
                $(this).remove();
                users = users.filter((u) => u.id !== user.id);
                localStorage.setItem("users", JSON.stringify(users));
            });
        });

        div_button_detalle.click(function () {
            location.href = `detalle_user.html?id=${user.id}`;

        });

        div_buttons.append(div_button_eliminar).append(div_button_detalle);
        div_user.append(div_user_name, div_user_username, div_user_email, div_user_phone, div_buttons);
        $("#container").append(div_user);

        setTimeout(() => {
            div_user.fadeIn();
        }, index * 200);
    });
}
function render_detalle_user(user) {
    if (!user) {
        console.error("User not found");
        return;
    }

    let div_user = $("<div class='user'>").hide();
    let div_user_name = $(`<div class='user_name'>Nombre: ${user.name}</div>`);
    let div_user_username = $(`<div class='user_name'>Username: ${user.username}</div>`);
    let div_user_email = $(`<div class='user_email'>Email: ${user.email}</div>`);
    let div_user_phone = $(`<div class='user_phone'>Teléfono: ${user.phone}</div>`);

    div_user.append(div_user_name, div_user_username, div_user_email, div_user_phone);
    $(".container_detail_user").append(div_user);

    setTimeout(() => {
        div_user.fadeIn();
    }, 200);

}
if (location.pathname === "/detalle_user.html") {
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
    const currentPage = location.pathname;

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
        success: function (data) {
            console.log(data);
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
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "Tu sesión sigue activa.",
                    icon: "error"
                });
            }
        });
    });
    
    $("#back").click(function () {

        window.history.back();
    });
});
