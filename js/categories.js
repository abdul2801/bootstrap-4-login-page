// jquery
$(document).ready(function () {
    $("#logout").click(function (e) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  
    // get events
    getCategories().then((data) => {
      data.forEach((event) => {
        $("#event_cont").append(`
              <li class="list-group
          list-group-item d-flex justify-content-between align-items-center">
          ${event.category_name}
          </li>`);
      });
    });
  
      //  add event
      $("#add_category").submit(function (e) {
          e.preventDefault();
          var form = $(this);
          var data = form.serializeArray().reduce(function (obj, item) {
              obj[item.name] = item.value;
              return obj;
          }, {});
          fetch(`${apiAdminUrl}/api/admin/add_categories`, {
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
                  alert("Something went wrong.");
                  return Promise.reject(response);
              }
          });
      }); 
  });
  
  // fetch
  async function getCategories() {
    const response = await fetch(`${apiUrl}/api/all/categories`);
    const data = await response.json();
    return data;
  }
  
  
  