const token = localStorage.getItem('x-auth-token');
if (!token) {
  window.location.replace('/login');
}
var instance = axios.create({
  baseURL: "http://localhost:3000/"
})
// instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
instance.defaults.timeout = 5 * 60 * 1000;
instance.interceptors.request.use( config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
})

// instance.get('/conversations');

$(document).ready(() => {
  $('#addFriendNavigation').on('click', async (event) => {
    event.preventDefault();
    try {
      const res = await instance.get('/friends/requests');
      var string=[];
      await res.data.map(async (user) => {
        const baseURL = new Promise((resolve, reject) => {
          firebase.storage().ref('images/' + user.avatar).getDownloadURL()
            .then((url) => {
              resolve(url);
            })
            .catch((err) => reject(err));
          });
        await baseURL.then(async (url) => {
          await string.push(`<li class="list-group-item" id="invited-${user.id}">
          <div>
              <figure class="avatar"><img class="rounded-circle" src="${url}"></figure>
          </div>
          <div class="users-list-body">
              <h5>${user.lastName}</h5>
              <p>${user.message}</p>
              <div class="users-list-action action-toggle">
                  <div class="dropdown"><a data-toggle="dropdown" href="#"><i class="ti-more"></i></a>
                      <div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item" href="#">Open</a><a class="dropdown-item active" href="#" data-navigation-target="contact-information">Profile</a><a class="dropdown-item" data-userid=${user.id} href="#" onclick="acceptReqFiend.call(this, event)">Accept</a><a class="dropdown-item" href="#" data-userid=${user.id}>Delete</a></div>
                  </div>
              </div>
          </div>
        </li>`);
        })
        $('#listFriendRequestContainer').html(string.join(''));
      });
    } catch (error) {
      console.log(error);
    }
  });
  $('#addFriendBtn').on('click', async (e) => {
    e.preventDefault();
    try {
      const body = {
        emailReceiver: $('#emails').val(),
        message: $('#message').val()
      };
      await instance.post('/friends/requests', body);
    } catch (error) {
      console.log(error);
    }
  });
  $('#allFriendBtn').on('click', async (e) => {
    e.preventDefault();
    try {
      const res = await instance.get('/friends/allfriends');
      res.data.map((user) => {
        console.log(user);
      })
    } catch (error) {
      console.log(error);
    }
  })
})

async function acceptReqFiend(event) {
  event.preventDefault();

  try {
    const body = { senderId: this.dataset.userid };
    await instance.put('/friends/accept', body);
    $(`#invited-${this.dataset.userid}`).remove();
  } catch (error) {
    console.log(error);
  }
}