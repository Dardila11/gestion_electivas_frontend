import $ from "jquery";

export function addSchedule(time_from, time_to, day) {
    if (time_to > time_from) {
        var i;
        for (i = time_from - 1; i < time_to - 1; i++) {
            $(".body-horario").children().eq(i).children().eq(day).addClass("ocupado");
        }
        return true;
    }
    return false;
}

export function removeSchedule(time_from, time_to, day) {
    var i;
    for (i = time_from - 1; i < time_to - 1; i++) {
        $(".body-horario").children().eq(i).children().eq(day).removeClass("ocupado");
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
        $(".time").fadeOut(2000);
    }, 100);
}