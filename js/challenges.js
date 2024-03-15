$(document).ready(function () {
  $("#logout").click(function (e) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // get events
  getEvents().then((data) => {
    data.forEach((event) => {
      $("select[name='event_id']").append(
        `<option value=${event.event_id}>${event.event_name}</option>`
      );
    });
  });

  // get categories
  getCategories().then((data) => {
    data.forEach((category) => {
      $("select[name='category_id']").append(
        `<option value=${category.category_id}>${category.category_name}</option>`
      );
    });
  });

  getChallenges().then((data) => {
    data.forEach((challenge) => {
      $("#list").append(`     
      <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${challenge.challenge_title}</h5>
            <p class="card-text">${challenge.challenge_body}</p>
            <div>
              <p class="card-text">
                ${challenge.tags?.map((tag) => {
                  return `<span class="badge bg-primary">${tag}</span>`;
                })}
              </p>
            </div>
            <div id="hint-cont" class="card m-2">
              <h5 class="card-text">Hints</h5>
              ${challenge.hint_text?.map((hint) => {
                return `<div class="container card-text">${hint}</div>`;
              })}
            </div>
            <div class="card m-2">
              <h5 class="card-text">Attachments</h5>
              

               ${challenge.files?.map((file) => {
                 return `<div class="mb-2">
                <span>${file.file_name}</span>
                <a href="url">${file.file_url}</a>
              </div>`;
               })}
              
            </div>
            
            <div class="container card-text">Flag : ${
              challenge.challenge_flag
            }</div>
            <div class="container card-text">EventName : ${
              challenge.event_name
            }</div>
            <div class="container card-text">CategoryName : ${
              challenge.category_name
            }</div>
            <div class="container card-text">Visibility : ${
              challenge.visibility
            }</div>
            <button class="btn btn-primary mt-2" onclick="toggleVisibility(
              ${challenge.challenge_id},
              ${!challenge.visibility}
            )">Change Visibility</button>
            <button class="btn btn-danger mt-2" onclick="deleteChallenge(${
              challenge.challenge_id
            })">Delete</button>
          </div>
        </div>
      </div>
    </div>`);
    });
  });

  // tags
  handleAdd(".tags_inps", "#add_tag", "tags");
  handleRemove(".tags_inps", "#remove_tag");

  // hints
  handleAdd(".hints_inps", "#add_hint", "hints");
  handleRemove(".hints_inps", "#remove_hint");

  // attachments
  handleAddAttachment(".attachments_inps", "#add_attachment");
  handleRemove(".attachments_inps", "#remove_attachment");

  const form = $("#add_challenge");
  form.submit(function (e) {
    e.preventDefault();

    const data = form.serializeArray().reduce(function (obj, item) {
      if (obj[item.name]) {
        if (Array.isArray(obj[item.name])) {
          obj[item.name].push(item.value);
        } else {
          obj[item.name] = [obj[item.name], item.value];
        }
      } else {
        if (item.name == "hints" || item.name == "tags") {
          obj[item.name] = [item.value];
        } else {
          obj[item.name] = item.value;
        }
      }
      return obj;
    }, {});

    // data combine a_key and a_url to attachments
    data.files = [];
    for (let i = 0; i < data.a_key.length; i++) {
      data.files.push({
        key: data.a_key[i],
        url: data.a_url[i],
      });
    }
    delete data.a_key;
    delete data.a_url;
    data.event_id = parseInt(data.event_id);
    data.category_id = parseInt(data.category_id);

    fetch(apiAdminUrl + "/api/admin/add_challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Invalid data");
          return Promise.reject(response);
        }
      })
      .then((data) => {
        console.log(data);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

function handleAddAttachment(inpsClass, btClass) {
  $(btClass).click(function (e) {
    $(inpsClass).append(` <div class="d-flex">
    <input
      type="text"
      class="form-control"
      name="a_key"
      id="a_key"
      placeholder="Enter Key"
    />
    <input
      type="text"
      class="form-control"
      name="a_url"
      id="a_url"
      placeholder="Enter URL"
    />
  </div>`);
  });
}

function handleAdd(inpsClass, btClass, name) {
  $(btClass).click(function (e) {
    $(inpsClass).append(
      `<input type="text" class="form-control" name="${name}" placeholder="Enter ${name}">`
    );
  });
}

function handleRemove(inpsClass, btClass) {
  $(btClass).click(function (e) {
    if ($(inpsClass).children().length > 1) {
      $(inpsClass).children().last().remove();
    }
  });
}

async function getChallenges() {
  const response = await fetch(apiUrl + "/api/all/challenges", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function getEvents() {
  const response = await fetch(apiUrl + "/api/all/events", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function getCategories() {
  const response = await fetch(apiUrl + "/api/all/categories", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function deleteChallenge(id) {
  const response = await fetch(`${apiAdminUrl}/api/admin/delete_challenges`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ id: id }),
  });

  if (response.ok == false) {
    alert("Something went wrong.");
    return Promise.reject(response);
  }

  const data = await response.json();
  location.reload();
}

async function toggleVisibility(id, visibility) {
  const response = await fetch(
    `${apiAdminUrl}/api/admin/challenge_visibility`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: id, visibility: visibility }),
    }
  );

  if (response.ok == false) {
    alert("Something went wrong.");
    return Promise.reject(response);
  }

  const data = await response.json();
  location.reload();
}
