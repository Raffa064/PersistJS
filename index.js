const { createPersistentState, createUIState } = Persist()

const state = createPersistentState({
    text: 'Showcase text',
    number: 64,
    slider: 5,
    checkbox: true,
    clicks: 0,
    contry: 'usa'
}, 'showcase-state')

const ui = createUIState(state)

ui.input('text')
ui.input('number')
ui.input('slider')
ui.checkbox('checkbox')
ui.input('contry')

const button = document.querySelector('#button')
const clicks = document.querySelector('#clicks')

clicks.textContent = state.clicks
button.onclick = () => {
    state.clicks++
    clicks.textContent = state.clicks
}