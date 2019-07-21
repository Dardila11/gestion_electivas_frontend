import $ from "jquery";

export function agregarHorario(inicio, fin, dia) {
    if (fin > inicio) {
        var i;
        for (i = inicio - 1; i < fin - 1; i++) {
            $(".body-horario").children().eq(i).children().eq(dia).addClass("ocupado");
        }
        return true;
    }
    return false;
}

export function eliminarHorario(inicio, fin, dia) {
    var i;
    console.log(inicio);
    for (i = inicio - 1; i < fin - 1; i++) {
        $(".body-horario").children().eq(i).children().eq(dia).removeClass("ocupado");
    }
}

export function show() {
    $("#menu").addClass("mostrar-l");
    $("#menu").removeClass("ocultar-l");
}

export function hide() {
    $("#menu").addClass("ocultar-l");
    $("#menu").removeClass("mostrar-l");
}

export function time() {
    setTimeout(function () {
        $(".time").fadeIn(0);
        $(".time").fadeOut(3500);
    }, 0);
}