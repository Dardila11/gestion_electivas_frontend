$(document).ready(function(){
    $("#menu").hide();
    $("#boton-show").change(function() {
        $("#menu").show();  
        console.log('check')    
    });
    $("#boton-hide").change(function() {
        $("#menu").hide();
    });
});