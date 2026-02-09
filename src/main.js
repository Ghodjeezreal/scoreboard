import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Prevent quick double-tap zoom on mobile by intercepting rapid touchend events.
// This is a progressive enhancement — it avoids disabling pinch-zoom globally.
if (typeof window !== 'undefined') {
	let __lastTouchTime = 0
	document.addEventListener('touchend', function (e) {
		const now = Date.now()
		if (now - __lastTouchTime <= 300) {
			e.preventDefault()
		}
		__lastTouchTime = now
	}, { passive: false })
}

createApp(App).mount('#app')
