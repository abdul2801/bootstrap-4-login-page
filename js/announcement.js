const getAnnouncements = async () => {
  const response = await fetch(`${apiUrl}/api/all/announcements`);
  const data = await response.json();
  return data;
};

const deleteAnnouncement = async (id) => {
  const response = await fetch(
    `${apiAdminUrl}/api/admin/delete_announcements`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },

      body: JSON.stringify({ id: id }),
    }
  );

  if (response.ok == false) {
    alert("Something went wrong.");
    return Promise.reject(response);
  }

  const data = await response.json();
  console.log(data);
  location.reload();
};

$(function () {
  // if (!LoggedIn()) {
  //     window.location.href = "index.html";
  // }

  // Logout
  $("#logout").click(function (e) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Get the announcements
  getAnnouncements().then((data) => {
    console.log(data);
    data.forEach((announcement) => {
      $("#list").append(`
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${announcement.title}</h5>
              <p class="card-text">
                ${announcement.description}
              </p>
              <p class="card-text">
                Author : ${announcement.author}
                
              </p>
                <p class="card-text">
                Priority : ${announcement.priority}
                </p>    
              <button class="btn btn-danger" onClick="deleteAnnouncement(${announcement.id})">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </button>
            </div>
          </div>`);
    });
  });

  // Add an announcement
  $("#add_announcement").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var data = form.serializeArray().reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    console.log(data);
    fetch(`${apiAdminUrl}/api/admin/add_announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // auth
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Something went wrong.");
          return Promise.reject(response);
        }
      })
      .then((data) => {
        console.log(data);
        location.reload();
      });
  });
});
