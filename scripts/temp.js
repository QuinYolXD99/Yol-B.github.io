
$(document).ready(function() {
  var client = null;
  var connected= false;
  var topics = []

  $(".btn-connect").click(function() {
    var address = $("#address").val();
    var timestamp = null;
    if (address == "") {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Please add a broker address to connect..',
      });
    } else {
      if (!connected) {
        client = mqtt.connect(address);
        $(".status").text("connecting...")
        client.on("connect", function() {
          Swal.fire({
            type: 'success',
            title: 'Connected Successfilly!'
          });
          $("#conBtn").removeClass("btn-connect positive")
          $("#conBtn").addClass("wifi btn-disconnect negative")
          $("#text").text("Disconnect")
          $(".status").text("Connected")
          $(".message").addClass("green")
          connected = true;
        })
      } else {
        $(this).removeClass("wifi btn-disconnect negative")
        $(this).addClass("btn-connect positive")
        $("#text").text("Connect")
        $(".status").text("Disconnected")
        $(".message").removeClass("green")
      }
    }

    $(".btn-disconnect").click(function() {
      connected = false;
      $(this).removeClass("wifi btn-disconnect negative")
      $(this).addClass("btn-connect positive")
      $("#text").text("Connect")
      client.end();
    });

    $(".btn-publish").click(function() {
      if (connected) {
        var my_payload = $("#payload").val();
        var my_topic = $("#topic").val();
        if (my_payload == "" || my_topic == "") {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Please add a Topic or/and a Payload!',
          });
        } else {
          client.publish(my_topic, my_payload)
          timestamp = moment().format('MMMM D YYYY , h:mm:ss a')
          Swal.fire({
            type: 'success',
            title: 'Success...',
            text: 'Topic Successfully Published!',
          });
        }
      }

    });
    //   <div class="item" data-value="zw"><i class="zw flag"></i>Zimbabwe</div>
    // .menu
    $(".btn-subscribe").click(function() {
      if (!connected) {
        var topic_s = $("#topic_s").val();
        if (topic_s == "") {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Please add a Topic to Subscribe',
          });
        } else {
          if (topics.includes(topic_s)) {
            Swal.fire({
              type: 'info',
              title: 'Topic already subscribed'
            });
          } else {
            topics.push(topic_s);
            for (let i = 0; i < topics.length; i++) {
              var opt = new Option(topics[i], topics[i])
              $('select').append($(opt).attr("class", "item"));
              
            }
            
            Swal.fire({
              type: 'success',
              title: 'Success...',
              text: topic_s + ' Successfully Subscribed!',
            });
            console.log("subscribed")
            client.subscribe(topic_s);
          }
        }
      }
    });

    $(".btn-unsubscribe").click(function() {})

    client.on("message", function(topic, payload) {
      var tr = $("<tr>")
      $("<td>").text(topic).appendTo($(tr))
      $("<td>").text(payload).appendTo($(tr))
      $("<td>").text(timestamp).appendTo($(tr))
      $("tbody").append($(tr))
      console.log($(tr).html())
      console.log([topic, payload].join(": "));
    })
  })
});
