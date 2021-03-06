$(document).ready(function () {
  var readURL = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.profile-pic').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
  }

  $(".file-upload").on('change', function(){
      readURL(this);
  });

  $(".upload-button").on('click', function() {
    $(".file-upload").click();
  });

  $('form.resgister').submit(function(event) {
    event.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      firebase.auth().currentUser.sendEmailVerification();
    }).catch(function (error) {
      alert(error.message);
    })
  });

  $('.signin').submit(function(event) {
    event.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      // alert('account login success');
      if (!firebase.auth().currentUser.emailVerified) {
        alert('user not verify email');
        return;
      }

      const body = {
        email,
        password
      }
      $.post('/login', body).then(async function(response) {
        localStorage.setItem('x-auth-token', response.accessToken);
        window.location.replace('http://localhost:3000/conversations');
        // console.log(window.axios.defaults.headers.common['Authorization']);
      })
    }).catch(function (error) {
      console.log(error);
      alert(error.message);
    });
    // const sentLinkEmail = firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  });
  var file;
  $('#files').on('change', (e) => {
    file = e.target.files[0];
  })

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  $('form.register-app').submit(function (event) {
    event.preventDefault();

    var lastName = $('input[name="lastName"]').val();
    var firstName = $('input[name="firstName"]').val();
    var email = $('input[name="email"]').val();
    var password = $('input[name="password"]').val();
    // var phoneNumber = $('input[name="phone"]').val();
    var confirmPassword = $('input[name="confirmPassword"]').val();
    var avatar;
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storage = firebase.storage().ref('images/' + file.name)
    const uploadTask = storage.put(file, metadata);
    uploadTask.on('state_changed',
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
      switch (error.code) {
        case 'storage/unauthorized':
          console.log("User doesn't have permission to access the object");
          break;
    
        case 'storage/canceled':
          console.log('User canceled the upload');
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          console.log('nknown error occurred, inspect error.serverResponse');
          break;
      }
    },function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        avatar = downloadURL;
      });
    });
    // console.log(avatar);
    const body = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      avatar,
    };
    $.post('http://localhost:3000/register', body).then((user) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        firebase.auth().currentUser.sendEmailVerification();
        window.location.assign('http://localhost:3000/login');
      })
      .catch(err => {
        alert(err.message);
      })
    }).catch(err => {
      var user = firebase.auth().currentUser;
      user.delete().then(function() {
        // User deleted.
        alert("Delete success");
      }).catch(function(error) {
        // An error happened.
        alert(error);
      });
      location.reload();
    });
  });

  $('#login-phone-number').submit(function (event) {
    event.preventDefault();

    const phoneNumber = $('input[name="phoneNumber"]').val();
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        const firstName = $('input[name="firstName"]').val();
        const lastName = $('input[name="lastName"]').val();
        $('#login-phone-step1').remove();
        $('#login-phone-step2').css('display', 'block');

        $('#phone-number-verify').submit(function (event) {
          event.preventDefault();
          const code = $('input[name="code"]').val();
          confirmationResult.confirm(code).then(function (result) {
            var user = result.user;

            const body = {
              firstName,
              lastName,
              phoneNumber,
              forceRefresh: user.refreshToken
            }
            $.post('/login-phone-number', body);
            window.location.assign('http://localhost:3000/conversations');
          }).catch(function (error) {
            console.log('error2', error);
          });
        });
      }).catch(function (error) {
        console.log('error', error);
      });
  });
  
});

// import axios from 'axios'; 

// export default fetchClient(); 

