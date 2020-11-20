$(document).ready(()=> {
    $('#modalDelete').click(() => {
        var id = document.location.href.split('/participants/')[1].split('#')[0];
        var data = { id: id};
        sendAjax('/participants/deleteParticipant', data, "delete");
        setTimeout(function() {document.location.href='/participants';}, 400);
    });
    $('#___save').click(()=>{
        var id = document.location.href.split('/participants/')[1].split('#')[0];
        var data = {id: id, picture: $('#addNewPic').val(), maxPrice: $('#addPartMoney').val()}
        sendAjax('/participants/addPicToPar', data, "put");
        $("#mbody tr:last").after('<tr>'+'<td>' + $('#addNewPic').val() + '<td>'+ $('#addPartMoney').val() + '</tr>');
    })
    $('#__save').click(()=>{
        var id = document.location.href.split('/participants/')[1].split('#')[0];
        var data = {id:id, money:  $('#changePartMoney').val()}
        sendAjax('/participants/changeMoney', data, "put");
        $("#money").text($('#changePartMoney').val())
    })
});

function sendAjax(url, data, type){
    $.ajax({
        url:url,
        type: type, 
        data: data,
    });
}
