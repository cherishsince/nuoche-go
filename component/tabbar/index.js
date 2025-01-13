Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        active: String
    },
    methods: {
        redirectToPage (e) {
            const url = e.currentTarget.dataset.url;
            wx.switchTab({
                url
            })
        }
    }
})
