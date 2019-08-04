import $ from "jquery";

export function changePage(pos, elemento) {
    const size = $("#"+elemento).children().length;
    for (var i = 0; i < size; i++) {
        if (i === pos - 1) {
            $("#"+elemento).children().eq(i).children().eq(0).addClass("select");
            $("#"+elemento).children().eq(i).children().eq(0).removeClass("unselect");
        } else {
            $("#"+elemento).children().eq(i).children().eq(0).addClass("unselect");
            $("#"+elemento).children().eq(i).children().eq(0).removeClass("select");
        }
    }
}

export function addSchedule(time_from, time_to, day, elemento) {
    if (time_to > time_from) {
        var i;
        for (i = time_from - 1; i < time_to - 1; i++) {
            $("."+elemento).children().eq(i).children().eq(day).addClass("ocupado");
        }
        return true;
    }
    return false;
}

export function removeSchedule(time_from, time_to, day, elemento) {
    var i;
    for (i = time_from - 1; i < time_to - 1; i++) {
        $("."+elemento).children().eq(i).children().eq(day).removeClass("ocupado");
    }
}

export function hidemenu() {
    $(".menu-body").addClass("ocultar-l");
    $(".menu-body").removeClass("mostrar-l");
}

export function show() {
    $(".menu-body").addClass("mostrar-l");
    $(".menu-body").removeClass("ocultar-l");
}

export function hide() {
    console.log("ocultar")
    $(".menu-body").addClass("ocultar-l");
    $(".menu-body").removeClass("mostrar-l");
}

export function time() {
    setTimeout(function () {
        $(".time").fadeIn(0);
        $(".time").fadeOut(2000);
    }, 100);
}