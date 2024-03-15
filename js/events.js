// jquery
$(document).ready(function () {
  $("#logout").click(function (e) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // get events
  getEvents().then((data) => {
    data.forEach((event) => {
      $("#event_cont").append(`
            <li class="list-group
        list-group-item d-flex justify-content-between align-items-center">
        ${event.event_name}
        </li>`);
    });
  });

    //  add event
    $("#add_event").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var data = form.serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        fetch(`${apiAdminUrl}/api/admin/add_events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // auth
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                location.reload();
                return response.json();
            } else {
                alert("Invalid data");
                return Promise.reject(response);
            }
        });
    }); 
});

// fetch
async function getEvents() {
  const response = await fetch(`${apiUrl}/api/all/events`);
  const data = await response.json();
  return data;
}


