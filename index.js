 const { createPersistentState } = Persist()

 const text = document.querySelector('#text')
 const number = document.querySelector('#number')
 const slider = document.querySelector('#slider')
 const checkbox = document.querySelector('#checkbox')

 const state = createPersistentState({
     text: 'Showcase text',
     number: '64',
     slider: 5,
     checked: true
 }, 'showcase-state')

 text.value = state.text
 text.onchange = () => state.text = text.value

 number.value = state.number
 number.onchange = () => state.number = number.value

 slider.value = state.slider
 slider.onchange = () => state.slider = slider.value

 checkbox.checked = state.checked
 checkbox.onchange = () => state.checked = checkbox.checked