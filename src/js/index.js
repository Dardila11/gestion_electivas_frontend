import $ from "jquery";

export function show() {
    $("#menu").removeClass("ocultar"); 
}

export function hide() {
    $("#menu").addClass("ocultar"); 
}