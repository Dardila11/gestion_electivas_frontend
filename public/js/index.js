$(document).ready(function(){
    $("#menu").addClass("ocultar");
    $("#boton-show").change(function() {
        $("#menu").removeClass("ocultar"); 
        console.log('check');
    });
    $("#boton-hide").change(function() {
        $("#menu").addClass("ocultar");
        console.log('check');
    });
});