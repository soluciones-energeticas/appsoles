export function login(user,pass){
  const url = 'https://script.google.com/macros/s/AKfycbz54J6z0yU2kz5dgv8aiXg53bOka3mG4B4zwRE8-_opssCKsBB9cmuTaKKQoLVNTpg1EA/exec'
  
  const jsonData = {
    action : 'login',
    user,
    pass
  }

  const options = {
    method: "POST",
    Headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  };

  fetch(url,options)
    .then(res => res.json())
    .then(res => {
      if(res.completed = 'ok'){
        
        if(res.status){
          window.localStorage.setItem('soles_user_access',res.body.token)
          setAuthShowing(res.status,user)
        }else{
          alert('Usuario o contraseña invalidos')
        }
        
        console.log('Login terminado')
        document.getElementById('login-btn').classList.remove('d-none')
        document.getElementById('login-btn-loading').classList.add('d-none')
      }else{
        console.log(res.message,res.body.err)
      }
    })
    .catch(err => console.log(err))
    
}

export function verifyAccess(){
  const url = 'https://script.google.com/macros/s/AKfycbz54J6z0yU2kz5dgv8aiXg53bOka3mG4B4zwRE8-_opssCKsBB9cmuTaKKQoLVNTpg1EA/exec'
  
  const jsonData = {
    action : 'auth',
    user_access : window.localStorage.getItem('soles_user_access') || 'noaccess'
  }

  const options = {
    method: "POST",
    Headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  };

  fetch(url,options)
    .then(res => res.json())
    .then(res => {
      if(res.completed = 'ok'){
        setAuthShowing(res.status,res.body?.user)
        
      }else{
        console.log(res.message,res.body.err)
      }
    })
    .catch(err => console.log(err))
    
}
  
function setAuthShowing(value,user){
  if(!value){
    document.getElementById('login-div').classList.remove('d-none')
    makeLogin()
    
  }else{
    document.getElementById('user_name').textContent = user
    document.getElementById('login-div').classList.add('d-none')
    document.getElementById('content-div').classList.remove('d-none')
    document.querySelector('nav').classList.remove('d-none')
    document.querySelector('#banner').classList.remove('d-none')
    document.querySelector('body').classList.remove('d-md-flex')
    
  }

}

function makeLogin(){
  const login_btn = document.getElementById('login-btn')
  const form = document.getElementById('login-form')

  login_btn.addEventListener('click', e => {
    document.getElementById('login-btn').classList.add('d-none')
    document.getElementById('login-btn-loading').classList.remove('d-none')
    login(form.user.value,form.password.value)
    form.reset()
    
  })
}

verifyAccess()
