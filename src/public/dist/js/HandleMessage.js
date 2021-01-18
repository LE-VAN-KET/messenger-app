$(document).ready(() => {
    const socket = io();
    // validate login
    socket.on("connect", () => {
        // console.log("socket connected to server");
        socket.emit("singinUser", { token: localStorage.getItem("x-auth-token") });
    })
    //receive msg from server
    socket.on("message", (response) => {
        // console.log("oke")
        if ($("#receiverId").data("id") === response.senderId) {
            ChatosExamle.Message.add(response.msg, '');
        } else {
            const htmlSeeMsg = `<br><br><a data-id="${response.senderId}" onclick="startChattingWith(event)">See more</a>`;
            toastr.info(response.senderName + ": " + response.msg + htmlSeeMsg, "Tin nhắn mới");
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "10000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
        }
    })
    // send a msg
    $("form#chat-message").submit((e) => {
        e.preventDefault();
        let msg = $('#chat-message input').val();
        msg = $.trim(msg);
        $("#chat-message input").val("");
        socket.emit("message", {
            msg: msg,
            receiver: $("#receiverId").data("id"),
        });
        ChatosExamle.Message.add(msg, 'outgoing-message');
        return false;
    })
  })