const handleAlerts = (type, msg) => {
    alertBox.innerHTML = `
        <div id="alert-modal" class="alert alert-${type}" role="alert">
            ${msg}
        </div>
    `
}