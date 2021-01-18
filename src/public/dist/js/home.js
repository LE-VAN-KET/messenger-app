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
      await res.data.listFriends.map((user) => {
          string.push(`<li class="list-group-item" id="invited-${user.id}">
          <div>
              <figure class="avatar"><img class="rounded-circle" src="${user.avatar}"></figure>
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
      // });
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
  // $('#allFriendBtn').on('click', async (e) => {
  //   e.preventDefault();
  //   try {
  //     const listFriend = await instance.get('/friends/allfriends');
  //     $('#list-friend').html("");
  //     listFriend.data.forEach(item => {
  //       $('#list-friend').append(`<li class="list-group-item"><div><figure class="avatar"><img class="rounded-circle" src="${item.avatar}"></figure></div><div class="users-list-body"><h5>${item.lastName}</h5><p>${item.description}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#" aria-expanded="false"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-142px, 22px, 0px); top: 0px; left: 0px; will-change: transform;"><a class="dropdown-item" data-id="${item.userB}" onclick="startChattingWith(event)">Open</a><a class="dropdown-item" data-id="${item.id}" onclick="getProfile(event)" data-navigation-target="contact-information">Profile</a><a class="dropdown-item" data-id="${item.id}" onclick="unfriend(event)">Unfriend</a></div></div></div></div></li>`);
  //     }) 
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })
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

const loadProfileCurrentChatting = async (id) => {
  const user = await instance.get('/friends/profileOfFriend', {
    params: { id: id }
  });
  $("#currentChattingAvatar").attr("src", user.data.profile.avatar);
  $("#currentChattingName").text(user.data.profile.lastName);
  $("#receiverId").attr("data-id", user.data.profile.id);
}

const loadSMS = async (id) => {
  const friendMessage = await instance.get('/messages/message-friend', {
    params: {id: id}
  });
  const userMessage = await instance.get('/messages/message-user', {
    params: {id: id}
  })
  const message = friendMessage.data.message.concat(userMessage.data.message);
  const message_user = message.sort((a, b) => {
    return new Date(a.sent_at.split(".")[0]) - new Date(b.sent_at.split(".")[0]);
  });
  for (let i = 0; i < message_user.length; ++i) {
    let item = message_user[i];
    if (item.from_to.toString() === id.toString()) {
      ChatosExamle.Message.add(item.body, '', new Date(item.sent_at.split(".")[0]));
    } else {
      ChatosExamle.Message.add(item.body, 'outgoing-message', new Date(item.sent_at.split(".")[0]));
    }
  }
}

const startChattingWith = (event) => {
  // console.log(event.target.dataset.id);
  loadProfileCurrentChatting(event.target.dataset.id);
  loadSMS(event.target.dataset.id);
}

const loadAllFriend = async () => {
  const listFriend = await instance.get('/friends/allfriends');
  $('#list-friend').html("");
  listFriend.data.forEach(item => {
    $('#list-friend').append(`<li class="list-group-item"><div><figure class="avatar"><img class="rounded-circle" src=""></figure></div><div class="users-list-body"><h5>${item.lastName}</h5><p>${item.description}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#" aria-expanded="false"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(-142px, 22px, 0px); top: 0px; left: 0px; will-change: transform;"><a class="dropdown-item" data-id="${item.userB}" onclick="startChattingWith(event)">Open</a><a class="dropdown-item" data-id="${item.id}" onclick="getProfile(event)" data-navigation-target="contact-information">Profile</a><a class="dropdown-item" data-id="${item.id}" onclick="unfriend(event)">Unfriend</a></div></div></div></div></li>`);
  }) 
}

loadAllFriend();