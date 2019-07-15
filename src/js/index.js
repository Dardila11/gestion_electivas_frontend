import $ from "jquery";

export function show() {
    $("#menu").removeClass("ocultar"); 
}

export function hide() {
    console.log('oculto');
    $("#menu").addClass("ocultar"); 
}