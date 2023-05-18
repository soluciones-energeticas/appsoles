const formAsistencias = document.getElementById('asistencia-brigadas-form')
const btnAsistencias = document.getElementById('asistencia-brigadas-btn')
const btnAsistenciasLoading = document.getElementById('asistencia-brigadas-loading-btn')
const inputAsistenciasFile = document.getElementById('asistencia-brigadas-file-input')
const inputAsistenciasFileName = document.getElementById('asistencia-brigadas-file-name')
const formularioAccordion = document.getElementById('asistencia_brigadas_form_accordion')
const observacionesAccordion = document.getElementById('asistencia_brigadas_observaciones_accordion_header')
const formularioAccordionHeader = document.getElementById('asistencia_brigadas_form_accordion_header')

/* Listeners */

btnAsistencias.addEventListener('click', () => {
  btnAsistenciasLoading.classList.remove('d-none')
  btnAsistencias.classList.add('d-none')
  
  if(inputAsistenciasFile.files[0]) guardarAsistenciasMasivas()
  else guardarAsistenciaIndividual()
  
  
})

document.addEventListener('change', e => {
  if(e.target.matches('#asistencia-brigadas-file-input')){
    inputAsistenciasFileName.textContent = inputAsistenciasFile.files[0].name
    inputAsistenciasFileName.classList.remove('d-none')
  }
})

formAsistencias.addEventListener('input', e => {
  const target = e.target

  //desactivar los input de registro de horas entrada y salida cuando se digita codigo, descripcion o cantidad de actividad
  if(target.matches('#asistencia_brigadas_codigos_actividad_input') 
  || target.matches('#asistencia_brigadas_descripcion_actividad_input')
  || target.matches('#asistencia_brigadas_cantidad')){

    const inputEntrada = document.getElementById('asistencia-brigadas-entrada-input')
    const inputSalida = document.getElementById('asistencia-brigadas-salida-input')

    if(target.value){
  
      inputEntrada.value = ''
      inputEntrada.disabled = true
      inputSalida.value = ''
      inputSalida.disabled = true
      
    }else{
      inputEntrada.disabled = false
      inputSalida.disabled = false
      
    }
    
    
    
  }

  //desactivar los input de codigo, descripcion y cantidad de actividad cuando se digita hora de entrada o salida
  if(target.matches('#asistencia-brigadas-entrada-input')
  || target.matches('#asistencia-brigadas-salida-input')){

    const inputCodigo = document.getElementById('asistencia_brigadas_codigos_actividad_input')
    const inputDescripcion = document.getElementById('asistencia_brigadas_descripcion_actividad_input')
    const inputCantidad = document.getElementById('asistencia_brigadas_cantidad')

    console.log(target.value)
    
    if(target.value){
  
      inputCodigo.value = ''
      inputDescripcion.value = ''
      inputCantidad.value = ''

      inputCodigo.disabled = true
      inputDescripcion.disabled = true
      inputCantidad.disabled = true
      
    }else{
      inputCodigo.disabled = false
      inputDescripcion.disabled = false
      inputCantidad.disabled = false
      
    }
    
  }
  
  
  
  
})



/* guardado de asistencia */
function guardarAsistenciaIndividual(){
  const data = [{}]

  const formData = new FormData(formAsistencias)

  for(let key of formData.keys()){
    data[0][key] = formData.get(key)
  }

  const url = 'https://script.google.com/macros/s/AKfycbz54J6z0yU2kz5dgv8aiXg53bOka3mG4B4zwRE8-_opssCKsBB9cmuTaKKQoLVNTpg1EA/exec'
  
  const jsonData = {
    action : 'asistencia brigadas',
    user_access : window.localStorage.getItem('soles_user_access') || 'noaccess',
    data
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
          console.log('Completado exitosamente')
          formAsistencias.reset()
        }else{
          console.log(`Mensaje del servidor: ${res.message}`)
        }
        
      }else{
        console.log(res.message,res.body.err)
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      btnAsistenciasLoading.classList.add('d-none')
      btnAsistencias.classList.remove('d-none')
    })
}

function guardarAsistenciasMasivas(){
  
  readXlsxFile(inputAsistenciasFile.files[0]).then(rows => {
    const url = 'https://script.google.com/macros/s/AKfycbz54J6z0yU2kz5dgv8aiXg53bOka3mG4B4zwRE8-_opssCKsBB9cmuTaKKQoLVNTpg1EA/exec'
    
    if(rows.length < 3) return

    const data = []

    for(let i = 2; i < rows.length; i++){
      const obj = {}

      rows[1].forEach((enc,n) => obj[enc] = rows[i][n] || '')

      const dateText = JSON.parse(JSON.stringify(obj['Fecha'])).toString()
      
      obj['Fecha'] = `${dateText.substring(0,4)}-${dateText.substring(5,7)}-${dateText.substring(8,10)}`

      validacionesDataAsistencia(obj)
      
      data.push(obj)
      
    }

    
    const jsonData = {
      action : 'asistencia brigadas',
      user_access : window.localStorage.getItem('soles_user_access') || 'noaccess',
      data
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
            console.log('Completado exitosamente')
            formAsistencias.reset()
            inputAsistenciasFileName.classList.add('d-none')
            formularioAccordion.classList.add('show')
            observacionesAccordion.classList.add('d-none')
            formularioAccordionHeader.classList.add('d-none')

          }else{
            console.log(`Mensaje del servidor: ${res.message}`)
            console.log(res.body)
            if(res.body?.map){
              console.log(res.body.map(e => e.observaciones))
              makeTable(res.body)
              formularioAccordionHeader.classList.remove('d-none')
            }
          }
          
        }else{
          console.log(res.message,res.body.err)
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        btnAsistenciasLoading.classList.add('d-none')
        btnAsistencias.classList.remove('d-none')
      })
    
    

    
  })

  
}

function validacionesDataAsistencia(obj){
  const regex = {
    'asistencia_brigadas_date_input' : /20(2[3-9]|3[0-9])-[0-9]{2}-[0-9]{2}/,
    'asistencia-brigadas-entrada-input' : /([0-1][0-9]|2[0-3]):[0-5][0-9]/,
    'asistencia-brigadas-salida-input' : /([0-1][0-9]|2[0-3]):[0-5][0-9]/
  }

  for(let key in regex){
    if(!regex[key].test(obj[key])) return {res: false,key,value: obj[key]}
    
  }

  return {res: true,key: ''}

}

function makeTable(body){
  const table = document.getElementById('asistencia_brigadas_table')
  const $tbody = table.querySelector('tbody')

  formularioAccordion.classList.remove('show')
  observacionesAccordion.classList.remove('d-none')

  $tbody.textContent = ''

  let result = ''

  body.forEach(registro => {
    if(registro['observaciones']){
      result += '<tr class="table-warning">'
    }else{
      result += '<tr>'
    }
    result += `
    <td>${registro['Fecha']}</td>
    <td>${registro['Campamento']}</td>
    <td>${registro['Ficha']}</td>
    <td>${registro['Hora Entrada'] || ''}</td>
    <td>${registro['Hora Salida'] || ''}</td>
    <td>${registro['Codigo Actividad'] || ''}</td>
    <td>${registro['Descripcion Actividad'] || ''}</td>
    <td>${registro['Cantidad Actividad'] || ''}</td>
    <td>${registro['observaciones']}</td>
    </tr>`
    
  })

  $tbody.innerHTML = result
  
}








