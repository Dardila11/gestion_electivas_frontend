import $ from "jquery";

export function show() {
    $("#menu").addClass("mostrar-l"); 
    $("#menu").removeClass("ocultar-l"); 
}

export function hide() {
    $("#menu").addClass("ocultar-l"); 
    $("#menu").removeClass("mostrar-l");  
}