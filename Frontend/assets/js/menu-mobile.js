
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    const panelLateral = document.getElementById('panel-lateral')
    const mobileOverlay = document.getElementById('mobile-overlay')

    if (mobileMenuButton && panelLateral && mobileOverlay) {

        mobileMenuButton.addEventListener('click', () => {

            if (panelLateral.classList.contains('-translate-x-full')) {
                panelLateral.classList.remove('-translate-x-full')
                mobileOverlay.classList.remove('hidden')
            } else {
                mobileOverlay.classList.add('hidden')
                panelLateral.classList.add('-translate-x-full')
            }
        })

        mobileOverlay.addEventListener('click', () => {
            panelLateral.classList.add('-translate-x-full')
            mobileOverlay.classList.add('hidden')
        })
    }
})